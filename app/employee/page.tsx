'use client';

import dynamic from 'next/dynamic';

const DeveloperDashboard = dynamic(() => import('@/components/DeveloperDashboard'), { ssr: false });

export default function EmployeeDashboardPage() {
  return <DeveloperDashboard />;
}
