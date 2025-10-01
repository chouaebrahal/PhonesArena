import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Stat Cards Data
    const totalPhones = await prisma.phone.count();
    const totalUsers = await prisma.user.count();
    const totalViewsData = await prisma.phone.aggregate({ _sum: { viewCount: true } });
    const totalViews = totalViewsData._sum.viewCount || 0;
    const trendingPhone = await prisma.phone.findFirst({ orderBy: { viewCount: 'desc' } });

    // Charts Data
    // Line Chart: Generate revenue data for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse();

    const lineChartData = {
      labels: last7Days,
      datasets: [
        {
          label: 'Revenue',
          data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 5000) + 1000),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.3,
        },
      ],
    };

    // Bar Chart: Top 5 most viewed phones
    const topPhones = await prisma.phone.findMany({
      orderBy: { viewCount: 'desc' },
      take: 5,
    });

    const barChartData = {
      labels: topPhones.map(p => p.name),
      datasets: [
        {
          label: 'Views',
          data: topPhones.map(p => p.viewCount),
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
        },
      ],
    };

    // Doughnut Chart: Traffic Sources (static for now)
    const doughnutChartData = {
      labels: ['Direct', 'Social', 'Referral', 'Organic'],
      datasets: [
        {
          data: [55, 25, 10, 10],
          backgroundColor: [
            'rgb(99, 102, 241)',
            'rgb(139, 92, 246)',
            'rgb(168, 85, 247)',
            'rgb(217, 70, 239)',
          ],
        },
      ],
    };

    // Table Data: Recent Users
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true, // To show a status-like field, we can use createdAt
      }
    });
    
    const tableHeaders = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'createdAt', label: 'Joined' },
      ];

    const tableData = recentUsers.map(user => ({
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: new Date(user.createdAt).toLocaleDateString(),
    }))


    return NextResponse.json({
      stats: {
        totalPhones,
        totalUsers,
        totalViews,
        trendingPhone: trendingPhone?.name || 'N/A',
      },
      charts: {
        lineChartData,
        barChartData,
        doughnutChartData,
      },
      table: {
        headers: tableHeaders,
        data: tableData,
      }
    });

  } catch (error) {
    console.error('[ADMIN_ANALYTICS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}