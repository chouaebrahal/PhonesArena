import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // Optional: filter by phone category

    // Build where clause for filtering
    let whereClause: any = {
      deletedAt: null,
      status: 'ACTIVE',
    };

    if (category) {
      whereClause.series = {
        contains: category,
        mode: 'insensitive',
      };
    }

    // Get all filter options in parallel
    const [
      brands,
      priceRange,
      ratingRange,
      releaseYears,
      series,
      specifications,
      colors,
      statusOptions,
    ] = await Promise.all([
      // Brands with phone count
      prisma.brand.findMany({
        where: {
          deletedAt: null,
          isActive: true,
          phones: {
            some: whereClause,
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          _count: {
            select: {
              phones: {
                where: whereClause,
              },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),

      // Price range
      prisma.phone.aggregate({
        where: {
          ...whereClause,
          currentPrice: {
            not: null,
          },
        },
        _min: {
          currentPrice: true,
        },
        _max: {
          currentPrice: true,
        },
      }),

      // Rating range
      prisma.phone.aggregate({
        where: {
          ...whereClause,
          averageRating: {
            gt: 0,
          },
        },
        _min: {
          averageRating: true,
        },
        _max: {
          averageRating: true,
        },
      }),

      // Release years
      prisma.phone.findMany({
        where: {
          ...whereClause,
          releaseDate: {
            not: null,
          },
        },
        select: {
          releaseDate: true,
        },
      }),

      // Series/Categories
      prisma.phone.groupBy({
        by: ['series'],
        where: {
          ...whereClause,
          series: {
            not: null,
          },
        },
        _count: {
          series: true,
        },
        orderBy: {
          _count: {
            series: 'desc',
          },
        },
      }),

      // Popular specifications
      prisma.phoneSpecification.groupBy({
        by: ['key', 'category'],
        where: {
          phone: whereClause,
        },
        _count: {
          key: true,
        },
        orderBy: {
          _count: {
            key: 'desc',
          },
        },
        take: 50, // Limit to most common specs
      }),

      // Popular colors
      prisma.phoneColor.groupBy({
        by: ['name'],
        where: {
          phone: whereClause,
        },
        _count: {
          name: true,
        },
        orderBy: {
          _count: {
            name: 'desc',
          },
        },
        take: 20,
      }),

      // Status options
      prisma.phone.groupBy({
        by: ['status'],
        where: {
          deletedAt: null,
        },
        _count: {
          status: true,
        },
      }),
    ]);

    // Process release years
    const years = Array.from(
      new Set(
        releaseYears
          .map(phone => phone.releaseDate ? new Date(phone.releaseDate).getFullYear() : null)
          .filter(Boolean)
      )
    ).sort((a, b) => b! - a!); // Sort descending

    // Group specifications by category
    const specsByCategory = specifications.reduce((acc, spec) => {
      const category = spec.category || 'OTHER';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        key: spec.key,
        count: spec._count.key,
      });
      return acc;
    }, {} as Record<string, Array<{ key: string; count: number }>>);

    // Transform brands data
    const brandsData = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      phoneCount: brand._count.phones,
    }));

    // Transform series data
    const seriesData = series
      .filter(item => item.series)
      .map(item => ({
        name: item.series!,
        count: item._count.series,
      }));

    // Transform colors data
    const colorsData = colors.map(color => ({
      name: color.name,
      count: color._count.name,
    }));

    // Transform status data
    const statusData = statusOptions.map(status => ({
      value: status.status,
      label: status.status.charAt(0).toUpperCase() + status.status.slice(1).toLowerCase(),
      count: status._count.status,
    }));

    // Create price ranges
    const minPrice = priceRange._min.currentPrice || 0;
    const maxPrice = priceRange._max.currentPrice || 1000;
    const priceRanges = [
      { label: 'Under $200', min: 0, max: 200, count: 0 },
      { label: '$200 - $400', min: 200, max: 400, count: 0 },
      { label: '$400 - $600', min: 400, max: 600, count: 0 },
      { label: '$600 - $800', min: 600, max: 800, count: 0 },
      { label: '$800 - $1000', min: 800, max: 1000, count: 0 },
      { label: '$1000+', min: 1000, max: maxPrice, count: 0 },
    ];

    // Get counts for each price range
    for (const range of priceRanges) {
      const count = await prisma.phone.count({
        where: {
          ...whereClause,
          currentPrice: {
            gte: range.min,
            ...(range.max < maxPrice ? { lt: range.max } : { lte: range.max }),
          },
        },
      });
      range.count = count;
    }

    return NextResponse.json({
      success: true,
      data: {
        brands: brandsData,
        priceRanges: priceRanges.filter(range => range.count > 0),
        priceRange: {
          min: minPrice,
          max: maxPrice,
        },
        ratingRange: {
          min: ratingRange._min.averageRating || 0,
          max: ratingRange._max.averageRating || 5,
        },
        releaseYears: years,
        series: seriesData,
        specifications: specsByCategory,
        colors: colorsData,
        status: statusData,
      },
      metadata: {
        totalBrands: brandsData.length,
        totalSeries: seriesData.length,
        totalSpecs: Object.keys(specsByCategory).length,
        totalColors: colorsData.length,
        category,
      },
    });

  } catch (error:any) {
    console.error('Error fetching search filters:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch filters',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      },
      { status: 500 }
    );
  }
}