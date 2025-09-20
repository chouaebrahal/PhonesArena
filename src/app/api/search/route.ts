import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q')?.trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const category = searchParams.get('category'); // 'phones', 'brands', 'all'

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Search query must be at least 2 characters long',
      }, { status: 400 });
    }

    const results: any = {
      phones: [],
      brands: [],
      totalResults: 0,
    };

    // Search phones
    if (!category || category === 'phones' || category === 'all') {
      const phoneResults = await prisma.phone.findMany({
        where: {
          AND: [
            { deletedAt: null },
            { status: 'ACTIVE' },
            {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  model: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  series: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  brand: {
                    name: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  specifications: {
                    some: {
                      OR: [
                        {
                          key: {
                            contains: query,
                            mode: 'insensitive',
                          },
                        },
                        {
                          value: {
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
                  },
                },
              ],
            },
          ],
        },
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
          colors: {
            select: {
              id: true,
              name: true,
              hexCode: true,
              imageUrl: true,
            },
            take: 1,
            orderBy: { priority: 'asc' },
          },
          specifications: {
            where: {
              isHighlight: true,
            },
            select: {
              key: true,
              value: true,
              displayName: true,
              unit: true,
            },
            take: 3,
          },
        },
        orderBy: [
          { averageRating: 'desc' },
          { viewCount: 'desc' },
          { name: 'asc' },
        ],
        take: category === 'phones' ? limit : Math.ceil(limit * 0.7),
      });

      results.phones = phoneResults;
    }

    // Search brands
    if (!category || category === 'brands' || category === 'all') {
      const brandResults = await prisma.brand.findMany({
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
                {
                  description: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          ],
        },
        include: {
          _count: {
            select: {
              phones: {
                where: {
                  status: 'ACTIVE',
                  deletedAt: null,
                },
              },
            },
          },
        },
        orderBy: [
          { phoneCount: 'desc' },
          { name: 'asc' },
        ],
        take: category === 'brands' ? limit : Math.floor(limit * 0.3),
      });

      results.brands = brandResults.map(brand => {
        const { _count, ...brandData } = brand as any;
        return {
          ...brandData,
          phoneCount: _count.phones,
        };
      });
    }

    results.totalResults = results.phones.length + results.brands.length;

    // Track search query for analytics (async, don't wait)
    const userAgent = request.headers.get('user-agent');
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown';

    prisma.searchQuery.create({
      data: {
        query,
        results: results.totalResults,
        ipAddress,
      },
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      data: results,
      query,
      category: category || 'all',
    });

  } catch (error:any) {
    console.error('Error performing search:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Search failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      },
      { status: 500 }
    );
  }
}