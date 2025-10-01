import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const userId = searchParams.get('userId') || '';
    const phoneId = searchParams.get('phoneId') || '';
    const minRating = searchParams.get('minRating') || '';
    const maxRating = searchParams.get('maxRating') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    if (phoneId) {
      whereClause.phoneId = phoneId;
    }
    
    if (minRating) {
      whereClause.rating = {
        ...whereClause.rating,
        gte: parseInt(minRating)
      };
    }
    
    if (maxRating) {
      whereClause.rating = {
        ...whereClause.rating,
        lte: parseInt(maxRating)
      };
    }

    // Fetch reviews with filters, pagination, and sorting
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            }
          },
          phone: {
            select: {
              id: true,
              name: true,
              slug: true,
            }
          }
        }
      }),
      prisma.review.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, rating, userId, phoneId, pros, cons, isVerifiedPurchase, 
            isRecommended, usageDuration, images, videos } = body;

    // Validate required fields
    if (!title || !content || !rating || !userId || !phoneId) {
      return NextResponse.json(
        { error: 'Title, content, rating, userId, and phoneId are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if phone exists
    const phone = await prisma.phone.findUnique({
      where: { id: phoneId },
    });

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this phone
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_phoneId: {
          userId: userId,
          phoneId: phoneId,
        }
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'User has already reviewed this phone' },
        { status: 409 }
      );
    }

    // Create new review
    const review = await prisma.review.create({
      data: {
        title,
        content,
        rating,
        userId,
        phoneId,
        pros: pros || [],
        cons: cons || [],
        isVerifiedPurchase: isVerifiedPurchase || false,
        isRecommended,
        usageDuration,
        images: images || [],
        videos: videos || [],
      },
    });

    // Update phone's review count and average rating
    const updatedPhone = await prisma.phone.update({
      where: { id: phoneId },
      data: {
        reviewCount: {
          increment: 1
        },
        averageRating: {
          set: await calculateAverageRating(phoneId)
        }
      },
      include: {
        brand: true
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// Helper function to calculate average rating
async function calculateAverageRating(phoneId: string) {
  const ratings = await prisma.rating.findMany({
    where: { phoneId },
    select: { value: true }
  });

  if (ratings.length === 0) return 0;

  const total = ratings.reduce((sum, rating) => sum + rating.value, 0);
  return total / ratings.length;
}