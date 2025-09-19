'use client';

import { UserDashboard } from '../../components_react/UserDashboard';
import { AppLayout } from '../../components_react/AppLayout';

export default function DashboardPage() {
  return (
    <AppLayout>
      <UserDashboard />
    </AppLayout>
  );
}