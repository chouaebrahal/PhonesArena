import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// import { getServerSession } from 'next-auth'; // You'll need to implement auth
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }

    // For now, we'll use a placeholder user ID - replace with actual auth
    const userId = request.headers.get('x-user-id'); // Temporary header-based auth
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const skip = (page - 1) * limit;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case 'phonePrice':
        orderBy = { phone: { currentPrice: sortOrder } };
        break;
      case 'phoneRating':
        orderBy = { phone: { averageRating: sortOrder } };
        break;
      case 'phoneName':
        orderBy = { phone: { name: sortOrder } };
        break;
      case 'priority':
        orderBy = { priority: sortOrder };
        break;
      default:
        orderBy = { [sortBy]: sortOrder };
    }

    const [wishlistItems, totalCount] = await Promise.all([
      prisma.wishlist.findMany({
        where: {
          userId: userId,
        },
        include: {
          phone: {
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
                orderBy: { priority: 'asc' },
                take: 1,
              },
              variants: {
                where: { isAvailable: true },
                orderBy: { price: 'asc' },
                take: 1,
              },
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.wishlist.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: wishlistItems,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add phone to wishlist
export async function POST(request: NextRequest) {
  try {
    // TODO: Implement authentication
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { phoneId, notes, priority } = body;

    if (!phoneId) {
      return NextResponse.json(
        { success: false, error: 'Phone ID is required' },
        { status: 400 }
      );
    }

    // Check if phone exists
    const phone = await prisma.phone.findUnique({
      where: {
        id: phoneId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone not found' },
        { status: 404 }
      );
    }

    // Check if already in wishlist
    const existingItem = await prisma.wishlist.findUnique({
      where: {
        userId_phoneId: {
          userId: userId,
          phoneId: phoneId,
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { success: false, error: 'Phone already in wishlist' },
        { status: 409 }
      );
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: userId,
        phoneId: phoneId,
        notes: notes || null,
        priority: priority || 0,
      },
      include: {
        phone: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: wishlistItem,
      message: 'Phone added to wishlist successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// PUT /api/wishlist/[phoneId] - Update wishlist item
export async function PUT(
  request: NextRequest,
  { params }: { params: { phoneId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    const { phoneId } = params;
    const body = await request.json();
    const { notes, priority } = body;

    const updatedItem = await prisma.wishlist.update({
      where: {
        userId_phoneId: {
          userId: userId,
          phoneId: phoneId,
        },
      },
      data: {
        notes: notes !== undefined ? notes : undefined,
        priority: priority !== undefined ? priority : undefined,
        updatedAt: new Date(),
      },
      include: {
        phone: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: 'Wishlist item updated successfully',
    });

  } catch (error:any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Wishlist item not found' },
        { status: 404 }
      );
    }

    console.error('Error updating wishlist item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update wishlist item' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist/[phoneId] - Remove from wishlist
export async function DELETE(
  request: NextRequest,
  { params }: { params: { phoneId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 401 }
      );
    }

    const { phoneId } = params;

    await prisma.wishlist.delete({
      where: {
        userId_phoneId: {
          userId: userId,
          phoneId: phoneId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Phone removed from wishlist successfully',
    });

  } catch (error:any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Wishlist item not found' },
        { status: 404 }
      );
    }

    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}