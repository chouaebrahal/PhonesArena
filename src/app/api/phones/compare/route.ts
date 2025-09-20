import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get phone IDs from query parameters
    const phoneIds = searchParams.getAll('phones'); // ?phones=id1&phones=id2&phones=id3
    const idsParam = searchParams.get('ids'); // Alternative: ?ids=id1,id2,id3
    
    let ids: string[] = [];
    
    if (phoneIds.length > 0) {
      ids = phoneIds;
    } else if (idsParam) {
      ids = idsParam.split(',').map(id => id.trim()).filter(Boolean);
    }

    if (ids.length < 2) {
      return NextResponse.json({
        success: false,
        error: 'At least 2 phones are required for comparison',
      }, { status: 400 });
    }

    if (ids.length > 5) {
      return NextResponse.json({
        success: false,
        error: 'Maximum 5 phones can be compared at once',
      }, { status: 400 });
    }

    // Fetch phones with all necessary data for comparison
    const phones = await prisma.phone.findMany({
      where: {
        id: {
          in: ids,
        },
        deletedAt: null,
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
        specifications: {
          orderBy: [
            { category: 'asc' },
            { priority: 'desc' },
            { key: 'asc' },
          ],
        },
        colors: {
          orderBy: { priority: 'asc' },
        },
        variants: {
          where: { isAvailable: true },
          orderBy: { price: 'asc' },
        },
        gallery: {
          orderBy: { order: 'asc' },
          take: 3, // First 3 images for comparison
        },
        reviews: {
          select: {
            rating: true,
            designRating: true,
            performanceRating: true,
            cameraRating: true,
            batteryRating: true,
            valueRating: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    if (phones.length !== ids.length) {
      const foundIds = phones.map(p => p.id);
      const missingIds = ids.filter(id => !foundIds.includes(id));
      
      return NextResponse.json({
        success: false,
        error: `Phones not found: ${missingIds.join(', ')}`,
      }, { status: 404 });
    }

    // Process specifications for comparison
    const allSpecKeys = new Set<string>();
    phones.forEach(phone => {
      phone.specifications.forEach(spec => {
        allSpecKeys.add(spec.key);
      });
    });

    // Group specifications by category
    const specCategories = new Set<string>();
    phones.forEach(phone => {
      phone.specifications.forEach(spec => {
        specCategories.add(spec.category);
      });
    });

    // Create comparison matrix
    const comparisonData = Array.from(specCategories).map(category => {
      const categorySpecs = Array.from(allSpecKeys).filter(key => {
        return phones.some(phone => 
          phone.specifications.some(spec => 
            spec.key === key && spec.category === category
          )
        );
      });

      const specs = categorySpecs.map(specKey => {
        const specData = {
          key: specKey,
          displayName: '',
          unit: '',
          values: [] as any[],
        };

        phones.forEach(phone => {
          const spec = phone.specifications.find(s => s.key === specKey);
          if (spec) {
            specData.displayName = spec.displayName || spec.key;
            specData.unit = spec.unit || '';
            specData.values.push({
              phoneId: phone.id,
              value: spec.value,
              isHighlight: spec.isHighlight,
            });
          } else {
            specData.values.push({
              phoneId: phone.id,
              value: 'N/A',
              isHighlight: false,
            });
          }
        });

        return specData;
      });

      return {
        category,
        categoryName: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase().replace('_', ' '),
        specifications: specs,
      };
    });

    // Calculate average ratings for each phone
    const phonesWithRatings = phones.map(phone => {
      const ratings = phone.reviews;
      const avgRatings = {
        overall: 0,
        design: 0,
        performance: 0,
        camera: 0,
        battery: 0,
        value: 0,
        reviewCount: ratings.length,
      };

      if (ratings.length > 0) {
        avgRatings.overall = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        avgRatings.design = ratings.filter(r => r.designRating).reduce((sum, r) => sum + (r.designRating || 0), 0) / ratings.filter(r => r.designRating).length || 0;
        avgRatings.performance = ratings.filter(r => r.performanceRating).reduce((sum, r) => sum + (r.performanceRating || 0), 0) / ratings.filter(r => r.performanceRating).length || 0;
        avgRatings.camera = ratings.filter(r => r.cameraRating).reduce((sum, r) => sum + (r.cameraRating || 0), 0) / ratings.filter(r => r.cameraRating).length || 0;
        avgRatings.battery = ratings.filter(r => r.batteryRating).reduce((sum, r) => sum + (r.batteryRating || 0), 0) / ratings.filter(r => r.batteryRating).length || 0;
        avgRatings.value = ratings.filter(r => r.valueRating).reduce((sum, r) => sum + (r.valueRating || 0), 0) / ratings.filter(r => r.valueRating).length || 0;
      }

      // Remove reviews from the response (we only needed them for calculations)
      const { reviews, ...phoneWithoutReviews } = phone;

      return {
        ...phoneWithoutReviews,
        calculatedRatings: avgRatings,
      };
    });

    // Find best values for highlighting
    const highlights = {
      highestRating: Math.max(...phonesWithRatings.map(p => p.averageRating)),
      lowestPrice: Math.min(...phonesWithRatings.filter(p => p.currentPrice).map(p => p.currentPrice!)),
      highestPrice: Math.max(...phonesWithRatings.filter(p => p.currentPrice).map(p => p.currentPrice!)),
      newestRelease: Math.max(...phonesWithRatings.filter(p => p.releaseDate).map(p => new Date(p.releaseDate!).getTime())),
      mostViewed: Math.max(...phonesWithRatings.map(p => p.viewCount)),
    };

    // Create summary comparison
    const summary = {
      totalPhones: phones.length,
      priceRange: {
        min: highlights.lowestPrice,
        max: highlights.highestPrice,
        difference: highlights.highestPrice - highlights.lowestPrice,
      },
      ratingRange: {
        min: Math.min(...phonesWithRatings.map(p => p.averageRating)),
        max: highlights.highestRating,
      },
      brands: Array.from(new Set(phonesWithRatings.map(p => p.brand.name))),
      commonFeatures: [], // Could be calculated by finding common specs
      uniqueFeatures: [], // Could be calculated by finding unique specs
    };

    // Track comparison for analytics (async, don't wait)
    const userAgent = request.headers.get('user-agent');
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown';

    // Could store comparison analytics here
    
    return NextResponse.json({
      success: true,
      data: {
        phones: phonesWithRatings,
        specifications: comparisonData,
        summary,
        highlights,
        comparedAt: new Date().toISOString(),
      },
      metadata: {
        totalPhones: phones.length,
        totalCategories: specCategories.size,
        totalSpecs: allSpecKeys.size,
      },
    });

  } catch (error:any) {
    console.error('Error comparing phones:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to compare phones',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      },
      { status: 500 }
    );
  }
}