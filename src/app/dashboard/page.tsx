'use client';

import { UserDashboard } from '../../components_react/UserDashboard';
import { AppLayout } from '../../components_react/AppLayout';
import { ProtectedRoute } from '../../components/auth/protected-route';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <UserDashboard />
      </AppLayout>
    </ProtectedRoute>
  );
}