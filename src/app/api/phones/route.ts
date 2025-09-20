import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PhoneStatus, SpecificationCategory } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50); // Max 50 items per page
    const skip = (page - 1) * limit;

    // Search
    const searchTerm = searchParams.get('search')?.trim();

    // Filtering
    const brandId = searchParams.get('brandId');
    const brandSlug = searchParams.get('brandSlug');
    const series = searchParams.get('series');
    const status = searchParams.get('status') as PhoneStatus;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
    const releaseYear = searchParams.get('releaseYear') ? parseInt(searchParams.get('releaseYear')!) : undefined;
    
    // Specification filters
    const specFilters = searchParams.get('specs'); // JSON string of spec filters
    let parsedSpecFilters: any = null;
    if (specFilters) {
      try {
        parsedSpecFilters = JSON.parse(specFilters);
      } catch (e) {
        return NextResponse.json({ error: 'Invalid specs filter format' }, { status: 400 });
      }
    }

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Include options
    const includeBrand = searchParams.get('includeBrand') !== 'false';
    const includeColors = searchParams.get('includeColors') === 'true';
    const includeSpecs = searchParams.get('includeSpecs') === 'true';
    const includeVariants = searchParams.get('includeVariants') === 'true';
    const includeImages = searchParams.get('includeImages') === 'true';

    // Build where clause
    let where: any = {};
    
    // Only add deletedAt filter if not explicitly disabled
    const includeSoftDeleted = searchParams.get('includeSoftDeleted') === 'true';
    if (!includeSoftDeleted) {
      where.deletedAt = null; // Exclude soft deleted phones
    }

    // Search logic
    if (searchTerm) {
      where.OR = [
        {
          name: {
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
        {
          model: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          series: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          brand: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Brand filtering
    if (brandId) {
      where.brandId = brandId;
    } else if (brandSlug) {
      where.brand = {
        slug: brandSlug,
      };
    }

    // Other filters
    if (series) {
      where.series = {
        contains: series,
        mode: 'insensitive',
      };
    }

    if (status) {
      where.status = status;
    }

    // Price filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.currentPrice = {};
      if (minPrice !== undefined) {
        where.currentPrice.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.currentPrice.lte = maxPrice;
      }
    }

    // Rating filtering
    if (minRating !== undefined) {
      where.averageRating = {
        gte: minRating,
      };
    }

    // Release year filtering
    if (releaseYear) {
      where.releaseDate = {
        gte: new Date(`${releaseYear}-01-01`),
        lt: new Date(`${releaseYear + 1}-01-01`),
      };
    }

    // Specification filtering
    if (parsedSpecFilters && Object.keys(parsedSpecFilters).length > 0) {
      where.specifications = {
        some: {
          OR: Object.entries(parsedSpecFilters).map(([key, value]) => ({
            key: key,
            value: {
              contains: String(value),
              mode: 'insensitive',
            },
          })),
        },
      };
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'name':
        orderBy = { name: sortOrder };
        break;
      case 'price':
        orderBy = { currentPrice: sortOrder };
        break;
      case 'rating':
        orderBy = { averageRating: sortOrder };
        break;
      case 'releaseDate':
        orderBy = { releaseDate: sortOrder };
        break;
      case 'viewCount':
        orderBy = { viewCount: sortOrder };
        break;
      case 'brand':
        orderBy = { brand: { name: sortOrder } };
        break;
      default:
        orderBy = { [sortBy]: sortOrder };
    }

    // Build include clause
    const include: any = {};
    if (includeBrand) {
      include.brand = {
        select: {
          id: true,
          name: true,
          slug: true,
          displayName: true,
          logo: true,
        },
      };
    }
    if (includeColors) {
      include.colors = {
        orderBy: { priority: 'asc' },
      };
    }
    if (includeSpecs) {
      include.specifications = {
        orderBy: { priority: 'asc' },
      };
    }
    if (includeVariants) {
      include.variants = {
        where: { isAvailable: true },
        orderBy: { price: 'asc' },
      };
    }
    if (includeImages) {
      include.gallery = {
        orderBy: { order: 'asc' },
        take: 5, // Limit to first 5 images for performance
      };
    }

    // Execute query with total count
    const [phones, totalCount] = await Promise.all([
      prisma.phone.findMany({
        where,
        include,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.phone.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Increment view counts for returned phones (async, don't wait)
    if (phones.length > 0) {
      const phoneIds = phones.map(phone => phone.id);
      prisma.phone.updateMany({
        where: { id: { in: phoneIds } },
        data: { viewCount: { increment: 1 } },
      }).catch(console.error); // Log error but don't fail the request
    }

    return NextResponse.json({
      success: true,
      data: phones,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
      filters: {
        searchTerm,
        brandId,
        brandSlug,
        series,
        status,
        minPrice,
        maxPrice,
        minRating,
        releaseYear,
        specs: parsedSpecFilters,
      },
      sorting: {
        sortBy,
        sortOrder,
      },
    });

  } catch (error:any) {
    console.error('Error fetching phones:', error);
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