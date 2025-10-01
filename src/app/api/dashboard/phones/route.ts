import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PhoneStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const brandId = searchParams.get('brandId') || '';
    const status = searchParams.get('status') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { series: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (brandId) {
      whereClause.brandId = brandId;
    }
    
    if (status) {
      whereClause.status = status as PhoneStatus;
    }
    
    if (minPrice) {
      whereClause.launchPrice = {
        ...whereClause.launchPrice,
        gte: parseFloat(minPrice)
      };
    }
    
    if (maxPrice) {
      whereClause.launchPrice = {
        ...whereClause.launchPrice,
        lte: parseFloat(maxPrice)
      };
    }

    // Fetch phones with filters, pagination, and sorting
    const [phones, total] = await Promise.all([
      prisma.phone.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          brand: true,
        }
      }),
      prisma.phone.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      data: phones,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching phones:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phones' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, model, series, brandId, status, releaseDate, description, 
            launchPrice, currency, keyFeatures, metaTitle, metaDescription, keywords } = body;

    // Validate required fields
    if (!name || !slug || !brandId) {
      return NextResponse.json(
        { error: 'Name, slug, and brandId are required' },
        { status: 400 }
      );
    }

    // Check if phone with this slug already exists
    const existingPhone = await prisma.phone.findUnique({
      where: { slug },
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: 'Phone with this slug already exists' },
        { status: 409 }
      );
    }

    // Check if brand exists
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    // Create new phone
    const phone = await prisma.phone.create({
      data: {
        name,
        slug,
        model,
        series,
        brand: {
          connect: { id: brandId }
        },
        status: status || 'DRAFT',
        releaseDate: releaseDate ? new Date(releaseDate) : undefined,
        description,
        launchPrice,
        currency,
        keyFeatures: keyFeatures || [],
        metaTitle,
        metaDescription,
        keywords: keywords || [],
      },
    });

    return NextResponse.json(phone);
  } catch (error) {
    console.error('Error creating phone:', error);
    return NextResponse.json(
      { error: 'Failed to create phone' },
      { status: 500 }
    );
  }
}