'use client';

import React from 'react';
import { LandingPage } from '../components_react/LandingPage';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // If user is logged in, redirect to map view
  React.useEffect(() => {
    if (user) {
      router.push('/map');
    }
  }, [user, router]);

  // Show landing page for non-logged in users
  if (user) {
    return null; // Will redirect
  }

  const handleGetStarted = () => {
    router.push('/auth/register');
  };

  return <LandingPage onGetStarted={handleGetStarted} />;
}