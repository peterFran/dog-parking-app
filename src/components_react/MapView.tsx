import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Clock, Users, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BottomDrawer } from './BottomDrawer';
import { useIsMobile } from './ui/use-mobile';

interface Venue {
  id: string;
  name: string;
  address: string;
  rating: number;
  pricePerHour: number;
  availableSlots: number;
  distance: string;
  image: string;
  specialties: string[];
  coordinates: { lat: number; lng: number };
}

const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Liverpool Street',
    address: 'Liverpool Street, City of London',
    rating: 4.8,
    pricePerHour: 25,
    availableSlots: 8,
    distance: '0.3 mi',
    image: 'https://images.unsplash.com/photo-1748915948966-a0f1d7691585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBkYXljYXJlJTIwZmFjaWxpdHl8ZW58MXx8fHwxNzU2NzE2MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    specialties: ['Small Dogs', 'Socialization'],
    coordinates: { lat: 51.5174, lng: -0.0778 }
  },
  {
    id: '2',
    name: 'Strand',
    address: 'Strand, Westminster',
    rating: 4.6,
    pricePerHour: 30,
    availableSlots: 5,
    distance: '0.7 mi',
    image: 'https://images.unsplash.com/photo-1702489899194-ba1c1a3dec79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZXQlMjBjYXJlJTIwY2VudGVyfGVufDF8fHx8MTc1NjcxNjI1NHww&ixlib=rb-4.1.0&q=80&w=1080',
    specialties: ['Large Dogs', 'Grooming'],
    coordinates: { lat: 51.5081, lng: -0.1208 }
  },
  {
    id: '3',
    name: 'Oxford Street',
    address: 'Oxford Street, Fitzrovia',
    rating: 4.9,
    pricePerHour: 35,
    availableSlots: 12,
    distance: '1.2 mi',
    image: 'https://images.unsplash.com/photo-1650062417263-5b5633237ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZ3MlMjBwbGF5aW5nfGVufDF8fHx8MTc1NjcxNjI1NXww&ixlib=rb-4.1.0&q=80&w=1080',
    specialties: ['All Sizes', 'Training', 'Swimming'],
    coordinates: { lat: 51.5154, lng: -0.1423 }
  },
  {
    id: '4',
    name: 'King\'s Road',
    address: 'King\'s Road, Chelsea',
    rating: 4.7,
    pricePerHour: 40,
    availableSlots: 6,
    distance: '1.5 mi',
    image: 'https://images.unsplash.com/photo-1748915948966-a0f1d7691585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBkYXljYXJlJTIwZmFjaWxpdHl8ZW58MXx8fHwxNzU2NzE2MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    specialties: ['Luxury Care', 'Behavioural Training'],
    coordinates: { lat: 51.4877, lng: -0.1690 }
  },
  {
    id: '5',
    name: 'Regent Street',
    address: 'Regent Street, Mayfair',
    rating: 4.5,
    pricePerHour: 28,
    availableSlots: 9,
    distance: '0.9 mi',
    image: 'https://images.unsplash.com/photo-1702489899194-ba1c1a3dec79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZXQlMjBjYXJlJTIwY2VudGVyfGVufDF8fHx8MTc1NjcxNjI1NHww&ixlib=rb-4.1.0&q=80&w=1080',
    specialties: ['Puppy Care', 'Senior Dogs'],
    coordinates: { lat: 51.5156, lng: -0.1427 }
  }
];

interface MapViewProps {
  onVenueSelect: (venue: Venue) => void;
}

export function MapView({ onVenueSelect }: MapViewProps) {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue.id);
    onVenueSelect(venue);
  };

  const MapComponent = () => (
    <div className={`relative bg-muted/30 rounded-lg ${isMobile ? 'h-full' : 'flex-1 mr-4'}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Interactive map would be here</p>
          <p className="text-sm text-muted-foreground mt-2">
            {isMobile ? 'Tap venue markers or use the drawer below' : 'Click venue cards to see details'}
          </p>
        </div>
      </div>
      
      {/* Mock map markers */}
      <div className="absolute top-20 left-20">
        <Button
          variant={selectedVenue === '1' ? 'default' : 'secondary'}
          size="sm"
          className="rounded-full h-8 w-8 p-0"
          onClick={() => handleVenueClick(mockVenues[0])}
        >
          1
        </Button>
      </div>
      <div className="absolute top-32 right-32">
        <Button
          variant={selectedVenue === '2' ? 'default' : 'secondary'}
          size="sm"
          className="rounded-full h-8 w-8 p-0"
          onClick={() => handleVenueClick(mockVenues[1])}
        >
          2
        </Button>
      </div>
      <div className="absolute bottom-20 left-1/2">
        <Button
          variant={selectedVenue === '3' ? 'default' : 'secondary'}
          size="sm"
          className="rounded-full h-8 w-8 p-0"
          onClick={() => handleVenueClick(mockVenues[2])}
        >
          3
        </Button>
      </div>
      <div className="absolute top-1/2 left-1/4">
        <Button
          variant={selectedVenue === '4' ? 'default' : 'secondary'}
          size="sm"
          className="rounded-full h-8 w-8 p-0"
          onClick={() => handleVenueClick(mockVenues[3])}
        >
          4
        </Button>
      </div>
      <div className="absolute bottom-1/3 right-1/4">
        <Button
          variant={selectedVenue === '5' ? 'default' : 'secondary'}
          size="sm"
          className="rounded-full h-8 w-8 p-0"
          onClick={() => handleVenueClick(mockVenues[4])}
        >
          5
        </Button>
      </div>
    </div>
  );

  const VenueList = () => (
    <div className={`space-y-4 ${isMobile ? '' : 'w-96 max-h-full overflow-y-auto'}`}>
      {!isMobile && <h3 className="font-medium mb-4">Available Venues</h3>}
      {mockVenues.map((venue) => (
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
              {venue.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
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

  if (isMobile) {
    return (
      <div className="relative h-full">
        {/* Full-screen map on mobile */}
        <MapComponent />
        
        {/* Bottom drawer with venue list */}
        <BottomDrawer>
          <div className="py-4">
            <h3 className="font-medium mb-4 px-1">Available Venues ({mockVenues.length})</h3>
            <VenueList />
          </div>
        </BottomDrawer>
      </div>
    );
  }

  // Desktop layout (unchanged)
  return (
    <div className="flex h-full">
      <MapComponent />
      <VenueList />
    </div>
  );
}