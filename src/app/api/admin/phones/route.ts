import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const phones = await prisma.phone.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: { // Also include the brand name for context
        brand: true,
      }
    });

    return NextResponse.json(phones);

  } catch (error) {
    console.error('[ADMIN_PHONES_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // A simple slug generation
    const slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

    const phone = await prisma.phone.create({
      data: {
        ...body,
        slug: slug,
      },
    });

    return NextResponse.json(phone, { status: 201 });

  } catch (error) {
    console.error('[ADMIN_PHONES_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
