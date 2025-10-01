import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (isActive !== null && isActive !== undefined) {
      whereClause.isActive = isActive === 'true';
    }

    // Fetch brands with filters, pagination, and sorting
    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.brand.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      data: brands,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, displayName, description, logo, website, headquarters, 
            foundedYear, isActive, isVerified } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if brand with this name already exists
    const existingBrandByName = await prisma.brand.findUnique({
      where: { name },
    });

    if (existingBrandByName) {
      return NextResponse.json(
        { error: 'Brand with this name already exists' },
        { status: 409 }
      );
    }

    // Check if brand with this slug already exists
    const existingBrandBySlug = await prisma.brand.findUnique({
      where: { slug },
    });

    if (existingBrandBySlug) {
      return NextResponse.json(
        { error: 'Brand with this slug already exists' },
        { status: 409 }
      );
    }

    // Create new brand
    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        displayName,
        description,
        logo,
        website,
        headquarters,
        foundedYear,
        isActive: isActive !== undefined ? isActive : true,
        isVerified: isVerified !== undefined ? isVerified : false,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}