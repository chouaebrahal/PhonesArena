import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [totalPhones, totalUsers, viewsData, topPhones, recentUsers] = await Promise.all([
      prisma.phone.count(),
      prisma.user.count(),
      prisma.phone.aggregate({ _sum: { viewCount: true } }),
      prisma.phone.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        select: { id: true, name: true, viewCount: true }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true
        }
      })
    ]);

    return NextResponse.json({
      totalPhones,
      totalUsers,
      totalViews: viewsData._sum.viewCount || 0,
      topPhones,
      recentUsers
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
