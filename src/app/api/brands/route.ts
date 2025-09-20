import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const skip = (page - 1) * limit;

    // Search
    const searchTerm = searchParams.get('search')?.trim();

    // Filtering
    const isActive = searchParams.get('isActive');
    const isVerified = searchParams.get('isVerified');
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

    // Include options
    const includeStats = searchParams.get('includeStats') === 'true';
    const includePhones = searchParams.get('includePhones') === 'true';

    // Build where clause
    let where: any = {
      deletedAt: null,
    };

    if (searchTerm) {
      where.OR = [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          displayName: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    if (isVerified !== null) {
      where.isVerified = isVerified === 'true';
    }

    // Build orderBy
    let orderBy: any = {};
    switch (sortBy) {
      case 'phoneCount':
        orderBy = { phoneCount: sortOrder };
        break;
      case 'rating':
        orderBy = { averageRating: sortOrder };
        break;
      case 'founded':
        orderBy = { foundedYear: sortOrder };
        break;
      default:
        orderBy = { [sortBy]: sortOrder };
    }

    // Build include clause
    const include: any = {};
    
    if (includeStats) {
      include._count = {
        select: {
          phones: {
            where: {
              status: 'ACTIVE',
              deletedAt: null,
            },
          },
        },
      };
    }

    if (includePhones) {
      include.phones = {
        where: {
          status: 'ACTIVE',
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          primaryImage: true,
          currentPrice: true,
          averageRating: true,
        },
        orderBy: {
          averageRating: 'desc',
        },
        take: 5, // Top 5 phones per brand
      };
    }

    // Execute query
    const [brands, totalCount] = await Promise.all([
      prisma.brand.findMany({
        where,
        include,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.brand.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Transform data if needed
    const transformedBrands = brands.map(brand => {
      const { _count, ...brandData } = brand as any;
      return {
        ...brandData,
        ...(includeStats && { phoneCount: _count?.phones || 0 }),
      };
    });

    return NextResponse.json({
      success: true,
      data: transformedBrands,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });

  } catch (error:any) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication middleware
    const body = await request.json();

    // Validate required fields
    const { name, slug } = body;
    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingBrand = await prisma.brand.findUnique({
      where: { slug },
    });

    if (existingBrand) {
      return NextResponse.json(
        { success: false, error: 'Brand slug already exists' },
        { status: 409 }
      );
    }

    const newBrand = await prisma.brand.create({
      data: {
        name,
        slug,
        displayName: body.displayName,
        description: body.description,
        logo: body.logo,
        website: body.website,
        headquarters: body.headquarters,
        foundedYear: body.foundedYear,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        isActive: body.isActive ?? true,
        isVerified: body.isVerified ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      data: newBrand,
      message: 'Brand created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}