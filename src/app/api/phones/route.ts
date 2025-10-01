import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

const phoneSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  price: z.number().positive(),
  description: z.string(),
  stock: z.number().min(0),
  specifications: z.record(z.string(), z.string()),
});

export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Basic search params
    const search = searchParams.get('search') || '';
    const brand = searchParams.get('brand') || '';
    const inStock = searchParams.get('inStock') === 'true';

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const skip = (page - 1) * limit;

    // Build where clause
    let where: any = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        brand ? { brand: { name: { in: brand.split(','), mode: 'insensitive' } } } : {},
        inStock ? { isAvailable: true } : {}
      ]
    };

    // Execute query
    const total = await prisma.phone.count({ where });
    const phones = await prisma.phone.findMany({
      where,
      include: {
        specifications: true,
        brand: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);
    const pagination = {
      page,
      limit,
      totalCount: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return NextResponse.json({
      success: true,
      data: phones,
      pagination: pagination,
    });
  } catch (error) {
    console.error('Phones API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = phoneSchema.parse(body);

    // Generate slug from name (you can adjust this logic as needed)
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const brandSlug = validatedData.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const phone = await prisma.phone.create({
      data: {
        ...validatedData,
        slug,
        brand: {
          connectOrCreate: {
            where: { name: validatedData.brand },
            create: { name: validatedData.brand, slug: brandSlug },
          },
        },
      },
      include: {
        specifications: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: { phone }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to create phone' },
      { status: 500 }
    );
  }
}