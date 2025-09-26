import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Phone ID is required' },
        { status: 400 }
      );
    }

    // Get phone with all related data
    const phone = await prisma.phone.findUnique({
      where: {
        id: id,
        deletedAt: null, // Exclude soft deleted
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            displayName: true,
            logo: true,
            website: true,
            description: true,
          },
        },
        specifications: {
          orderBy: [
            { priority: 'desc' },
            { category: 'asc' },
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
        },
        reviews: {
          where: {
            // Only published reviews
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5, // Latest 5 reviews
        },
        comments: {
          where: {
            status: 'PUBLISHED',
            parentId: null, // Only top-level comments
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true,
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        ratings: {
          select: {
            value: true,
          },
        },
      },
    });

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone not found' },
        { status: 404 }
      );
    }

    // Increment view count (async, don't wait)
    prisma.phone.update({
      where: { id: phone.id },
      data: { viewCount: { increment: 1 } },
    }).catch(console.error);

    // Track view for analytics (async, don't wait)
    const userAgent = request.headers.get('user-agent');
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown';

    prisma.phoneView.create({
      data: {
        phoneId: phone.id,
        ipAddress,
        userAgent,
        referrer: request.headers.get('referer') || null,
      },
    }).catch(console.error);

    // Calculate rating statistics
    const ratingStats = phone.ratings.reduce(
      (acc, rating) => {
        acc.total += rating.value;
        acc.count++;
        acc.distribution[rating.value] = (acc.distribution[rating.value] || 0) + 1;
        return acc;
      },
      {
        total: 0,
        count: 0,
        average: 0,
        distribution: {} as Record<number, number>,
      }
    );

    if (ratingStats.count > 0) {
      ratingStats.average = Number((ratingStats.total / ratingStats.count).toFixed(2));
    }

    // Get similar phones (same brand or similar price range)
    const similarPhones = await prisma.phone.findMany({
      where: {
        AND: [
          { id: { not: phone.id } },
          { deletedAt: null },
          { status: 'ACTIVE' },
          {
            OR: [
              { brandId: phone.brandId },
              {
                AND: [
                  { currentPrice: { gte: (phone.currentPrice || 0) * 0.8 } },
                  { currentPrice: { lte: (phone.currentPrice || 0) * 1.2 } },
                ],
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
          },
        },
        colors: {
          take: 1,
          orderBy: { priority: 'asc' },
        },
      },
      orderBy: [
        { averageRating: 'desc' },
        { viewCount: 'desc' },
      ],
      take: 6,
    });

    // Remove ratings from response (we calculated stats above)
    const { ratings, ...phoneWithoutRatings } = phone;

    return NextResponse.json({
      success: true,
      data: {
        ...phoneWithoutRatings,
        ratingStats,
        similarPhones,
      },
    });

  } catch (error:any) {
    console.error('Error fetching phone details:', error);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication middleware to check if user is admin
    const { id } = params;
    const body = await request.json();

    const updatedPhone = await prisma.phone.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        brand: true,
        specifications: true,
        colors: true,
        variants: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedPhone,
      message: 'Phone updated successfully',
    });

  } catch (error) {
    console.error('Error updating phone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update phone' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication middleware to check if user is admin
    const { id } = params;

    // Soft delete
    await prisma.phone.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'DRAFT', // Change status to draft
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Phone deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting phone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete phone' },
      { status: 500 }
    );
  }
}