import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor');
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 10;
  const searchTerm = searchParams.get('searchTerm');
  const brandTerm = searchParams.get('brandTerm');

  let where: any = {};
  if (searchTerm) {
    where.name = { contains: searchTerm, mode: 'insensitive' };
  }
  if (brandTerm) {
    where.brand = { slug: brandTerm };
  }

  try {
    const phones = await prisma.phone.findMany({
      take: limit,
      where,
      ...(cursor && { 
        skip: 1, // Skip the cursor itself
        cursor: { id: cursor } 
      }),
      include: {
        brand: true,
        images: true,
        specifications: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const nextCursor = phones.length === limit ? phones[limit - 1].id : null;

    return NextResponse.json({ phones, nextCursor });
  } catch (error) {
    console.error('Error fetching phones:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}