// app/dashboard/layout.tsx
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/common/ErrorFallback';

interface DashboardRootLayoutProps {
  children: ReactNode;
}

export default function DashboardRootLayout({ children }: DashboardRootLayoutProps) {
  return (
    
      <DashboardLayout>{children}</DashboardLayout>
    
  );
}