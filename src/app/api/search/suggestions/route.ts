import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q')?.trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '8'), 20);

    if (!query || query.length < 1) {
      return NextResponse.json({
        success: true,
        data: {
          suggestions: [],
          popular: [],
        },
      });
    }

    const suggestions: any[] = [];

    // Get phone suggestions
    const phoneNames = await prisma.phone.findMany({
      where: {
        AND: [
          { deletedAt: null },
          { status: 'ACTIVE' },
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        name: true,
        slug: true,
        primaryImage: true,
        brand: {
          select: {
            name: true,
            logo: true,
          },
        },
      },
      orderBy: [
        { viewCount: 'desc' },
        { averageRating: 'desc' },
      ],
      take: Math.ceil(limit * 0.6),
    });

    suggestions.push(
      ...phoneNames.map(phone => ({
        type: 'phone',
        text: phone.name,
        slug: phone.slug,
        image: phone.primaryImage,
        brand: phone.brand.name,
        brandLogo: phone.brand.logo,
      }))
    );

    // Get brand suggestions
    const brandNames = await prisma.brand.findMany({
      where: {
        AND: [
          { deletedAt: null },
          { isActive: true },
          {
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
              {
                displayName: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      select: {
        name: true,
        slug: true,
        logo: true,
        phoneCount: true,
      },
      orderBy: {
        phoneCount: 'desc',
      },
      take: Math.floor(limit * 0.4),
    });

    suggestions.push(
      ...brandNames.map(brand => ({
        type: 'brand',
        text: brand.name,
        slug: brand.slug,
        image: brand.logo,
        phoneCount: brand.phoneCount,
      }))
    );

    // Get popular searches (if query is short)
    let popular: any[] = [];
    if (query.length <= 3) {
      const popularQueries = await prisma.searchQuery.groupBy({
        by: ['query'],
        _count: {
          query: true,
        },
        where: {
          query: {
            contains: query,
            mode: 'insensitive',
          },
          searchedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        orderBy: {
          _count: {
            query: 'desc',
          },
        },
        take: 5,
      });

      popular = popularQueries.map(item => ({
        type: 'popular',
        text: item.query,
        searchCount: item._count.query,
      }));
    }

    // Sort suggestions by relevance
    const sortedSuggestions = suggestions
      .sort((a, b) => {
        // Exact matches first
        const aExact = a.text.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
        const bExact = b.text.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
        
        if (aExact !== bExact) return bExact - aExact;
        
        // Then by type (phones first)
        if (a.type !== b.type) {
          return a.type === 'phone' ? -1 : 1;
        }
        
        return 0;
      })
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: {
        suggestions: sortedSuggestions,
        popular,
        query,
      },
    });

  } catch (error:any) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch suggestions',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      },
      { status: 500 }
    );
  }
}