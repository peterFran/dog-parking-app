'use client';

import { MapView } from '../../components_react/MapView';
import { AppLayout } from '../../components_react/AppLayout';

export default function FindCarePage() {
  const handleVenueSelect = (venue: any) => {
    // For now, just log - we'll implement routing to venue detail later
    console.log('Selected venue:', venue);
  };

  return (
    <AppLayout>
      <MapView onVenueSelect={handleVenueSelect} />
    </AppLayout>
  );
}