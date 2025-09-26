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

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);

  } catch (error) {
    console.error('[ADMIN_USERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
