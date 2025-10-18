import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Clock, Users, Star, Loader2, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BottomDrawer } from './BottomDrawer';
import { useIsMobile } from './ui/use-mobile';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { useVenues } from '../hooks/useApi';
import { enrichVenues, EnrichedVenue } from '../lib/venue-enrichment';

interface MapViewProps {
  onVenueSelect: (venue: EnrichedVenue) => void;
}

export function MapView({ onVenueSelect }: MapViewProps) {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Fetch venues from API
  const { data: apiVenues = [], isLoading, error } = useVenues();

  // Default user location (London center) - in production, use geolocation API
  const userLocation = { lat: 51.5074, lng: -0.1278 };

  // Enrich venues with mock data for missing fields
  const venues = useMemo(() =>
    enrichVenues(apiVenues, userLocation),
    [apiVenues]
  );

  const handleVenueClick = (venue: EnrichedVenue) => {
    setSelectedVenue(venue.id);
    onVenueSelect(venue);
  };

  const MapComponent = () => {
    // Center on London (average of all venue coordinates)
    const center = { lat: 51.5100, lng: -0.1180 };
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    return (
      <div className={`relative rounded-lg overflow-hidden ${isMobile ? 'h-full' : 'flex-1'}`}>
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={center}
            defaultZoom={13}
            mapId="dog-parking-map"
            style={{ width: '100%', height: '100%' }}
            gestureHandling="greedy"
            disableDefaultUI={true}
            zoomControl={false}
            mapTypeControl={false}
            scaleControl={false}
            streetViewControl={false}
            rotateControl={false}
            fullscreenControl={false}
          >
            {venues.map((venue) => (
              <AdvancedMarker
                key={venue.id}
                position={{ lat: venue.latitude, lng: venue.longitude }}
                onClick={() => handleVenueClick(venue)}
              >
                <Pin
                  background={selectedVenue === venue.id ? '#4f46e5' : '#f97316'}
                  borderColor={selectedVenue === venue.id ? '#312e81' : '#c2410c'}
                  glyphColor="#fff"
                  scale={selectedVenue === venue.id ? 1.2 : 1}
                />
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      </div>
    );
  };

  const VenueList = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading venues...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-sm text-muted-foreground">Failed to load venues</p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
        </div>
      );
    }

    if (venues.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No venues available</p>
        </div>
      );
    }

    return (
      <div className={`space-y-4 ${isMobile ? '' : 'w-96 max-h-full overflow-y-auto'}`}>
        {!isMobile && <h3 className="font-medium mb-4">Available Venues</h3>}
        {venues.map((venue) => (
        <Card 
          key={venue.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedVenue === venue.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => handleVenueClick(venue)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{venue.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {venue.address} • {venue.distance}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{venue.rating}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video mb-3 overflow-hidden rounded-md">
              <ImageWithFallback
                src={venue.image}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{venue.pricePerHour} points/hour</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{venue.availableSlots} slots</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {venue.services?.map((service) => (
                <Badge key={service} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>

            <Button 
              className="w-full" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleVenueClick(venue);
              }}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
    );
  };

  if (isMobile) {
    return (
      <div className="relative h-full">
        {/* Full-screen map on mobile */}
        <MapComponent />
        
        {/* Bottom drawer with venue list */}
        <BottomDrawer>
          <div className="py-4">
            <h3 className="font-medium mb-4 px-1">Available Venues ({venues.length})</h3>
            <VenueList />
          </div>
        </BottomDrawer>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex h-full gap-4 p-4">
      <MapComponent />
      <VenueList />
    </div>
  );
}