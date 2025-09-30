'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { useIsMobile } from './ui/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Hide footer on mobile map view (find-care page)
  const hideFooter = isMobile && pathname === '/find-care';

  // Check if this is the map page for special styling
  const isMapPage = pathname === '/find-care';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />

      <main className={`flex-1 ${isMapPage ? 'relative' : 'container mx-auto px-4 py-6'}`}>
        {isMapPage ? (
          <div className="h-full md:container md:mx-auto md:px-4 md:py-6">
            {children}
          </div>
        ) : (
          children
        )}
      </main>

      <AppFooter hide={hideFooter} />
    </div>
  );
}