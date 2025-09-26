import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// Endpoint to DELETE a user
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    if (!params.userId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    const user = await prisma.user.delete({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json(user);

  } catch (error) {
    console.error('[ADMIN_USER_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Endpoint to UPDATE a user (e.g., change their role)
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    const body = await req.json();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    if (!params.userId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    const user = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: body, // The body can contain any fields to update, e.g., { "role": "ADMIN" }
    });

    return NextResponse.json(user);

  } catch (error) {
    console.error('[ADMIN_USER_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
