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

    const userCount = await prisma.user.count();
    const phoneCount = await prisma.phone.count();
    const reviewCount = await prisma.review.count();

    return NextResponse.json({
      userCount,
      phoneCount,
      reviewCount,
    });

  } catch (error) {
    console.error('[ADMIN_ANALYTICS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
