import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import StatCard, { StatCardSkeleton } from '@/components/dashboard/StatCard';
import { LineChart, BarChart, DoughnutChart } from '@/components/dashboard/Charts';
import DataTable from '@/components/dashboard/DataTable';
import { ChartData, TableHeader, TableData } from '@/lib/types/dashboard';
import prisma from '@/lib/prisma';

// Add type for analytics data
interface AnalyticsData {
  totalRevenue: number;
  monthlyRevenue: Record<string, number>;
  trafficSources: Record<string, number>;
}

async function fetchAnalytics(): Promise<AnalyticsData> {
  // Implement real analytics fetching here
  return {
    totalRevenue: 150000,
    monthlyRevenue: {
      'Jan': 12000, 'Feb': 19000, 'Mar': 15000,
      'Apr': 25000, 'May': 22000, 'Jun': 30000
    },
    trafficSources: {
      'Direct': 55, 'Social': 25, 'Referral': 10, 'Organic': 10
    }
  };
}

async function fetchDashboardData() {
  const [phoneStats, userStats, analytics, topPhones, recentUsers] = await Promise.all([
    prisma.phone.aggregate({
      _count: { id: true },
      _sum: { viewCount: true }
    }),
    prisma.user.aggregate({
      _count: { id: true }
    }),
    fetchAnalytics(),
    prisma.phone.findMany({
      take: 5,
      orderBy: { viewCount: 'desc' },
      select: { name: true, viewCount: true }
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

  return { phoneStats, userStats, analytics, topPhones, recentUsers };
}

export default async function DashboardPage() {
  const { 
    phoneStats, 
    userStats, 
    analytics, 
    topPhones, 
    recentUsers 
  } = await fetchDashboardData();

  // Create chart data from real analytics
  const lineChartData: ChartData = {
    labels: Object.keys(analytics.monthlyRevenue),
    datasets: [{
      label: 'Revenue',
      data: Object.values(analytics.monthlyRevenue),
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.3,
    }]
  };

  // Generate bar chart data from topPhones
  const barChartData: ChartData = {
    labels: topPhones.map(phone => phone.name),
    datasets: [{
      label: 'Views',
      data: topPhones.map(phone => phone.viewCount || 0),
      backgroundColor: 'rgba(99, 102, 241, 0.7)',
    }]
  };

  const doughnutChartData: ChartData = {
    labels: Object.keys(analytics.trafficSources),
    datasets: [{
      data: Object.values(analytics.trafficSources),
      backgroundColor: [
        'rgb(99, 102, 241)',
        'rgb(139, 92, 246)',
        'rgb(168, 85, 247)',
        'rgb(217, 70, 239)',
      ],
    }]
  };

  // Table configuration
  const tableHeaders: TableHeader[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Suspense fallback={<StatCardSkeleton />}>
          <StatCard 
            title="Total Phones" 
            value={phoneStats._count.id.toString()}
            icon="📱"
            color="blue"
          />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <StatCard 
            title="Total Users" 
            value={userStats._count.id.toString()}
            icon="👥" 
            color="green" 
          />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <StatCard 
            title="Total Views" 
            value={(phoneStats._sum.viewCount || 0).toLocaleString()}
            icon="👀"
            color="purple" 
          />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <StatCard 
            title="Trending Phone" 
            value={topPhones[0]?.name || 'N/A'}
            icon="🔥"
            color="yellow" 
          />
        </Suspense>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          <LineChart data={lineChartData} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Top Products</h2>
          <BarChart data={barChartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
          <DataTable
            headers={tableHeaders}
            data={recentUsers.map(user => ({
              ...user,
              name: user.name ?? '',
              email: user.email ?? '',
            }))}
            itemsPerPage={5}
          />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Traffic Sources</h2>
          <DoughnutChart data={doughnutChartData} />
        </div>
      </div>
    </>
  );
}