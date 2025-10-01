// components/dashboard/Charts.tsx
'use client';

import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { ChartData } from '@/lib/types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: ChartData;
  options?: ChartOptions<'line'>;
}

interface BarChartProps {
  data: ChartData;
  options?: ChartOptions<'bar'>;
}

interface DoughnutChartProps {
  data: ChartData;
  options?: ChartOptions<'doughnut'>;
}

export function LineChart({ data, options }: LineChartProps) {
  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    ...options,
  };

  return <Line data={data} options={defaultOptions} />;
}

export function BarChart({ data, options }: BarChartProps) {
  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    ...options,
  };

  return <Bar data={data} options={defaultOptions} />;
}

export function DoughnutChart({ data, options }: DoughnutChartProps) {
  const defaultOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    ...options,
  };

  return <Doughnut data={data} options={defaultOptions} />;
}