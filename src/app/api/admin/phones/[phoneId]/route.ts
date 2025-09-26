import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

// Endpoint to DELETE a phone
export async function DELETE(
  req: Request,
  { params }: { params: { phoneId: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    if (!params.phoneId) {
      return new NextResponse('Phone ID is required', { status: 400 });
    }

    const phone = await prisma.phone.delete({
      where: {
        id: params.phoneId,
      },
    });

    return NextResponse.json(phone);

  } catch (error) {
    console.error('[ADMIN_PHONE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Endpoint to UPDATE a phone
export async function PATCH(
  req: Request,
  { params }: { params: { phoneId: string } }
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

    if (!params.phoneId) {
      return new NextResponse('Phone ID is required', { status: 400 });
    }

    const phone = await prisma.phone.update({
      where: {
        id: params.phoneId,
      },
      data: body,
    });

    return NextResponse.json(phone);

  } catch (error) {
    console.error('[ADMIN_PHONE_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
