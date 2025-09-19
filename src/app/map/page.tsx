'use client';

import React, { useState } from 'react';
import { MapView } from '../../components_react/MapView';
import { VenueDetail } from '../../components_react/VenueDetail';
import { UserDashboard } from '../../components_react/UserDashboard';
import { Button } from '../../components_react/ui/button';
import { Badge } from '../../components_react/ui/badge';
import { Separator } from '../../components_react/ui/separator';
import { 
  Map, 
  User, 
  Heart, 
  Search, 
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useIsMobile } from '../../components_react/ui/use-mobile';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

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

interface TimeSlot {
  id: string;
  time: string;
  duration: string;
  points: number;
  available: boolean;
  spotsLeft: number;
}

type ViewType = 'map' | 'venue-detail' | 'dashboard';

export default function MapPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<ViewType>('map');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [userPoints] = useState(150);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Redirect to home if not logged in
  React.useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return null; // Will redirect
  }

  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
    setCurrentView('venue-detail');
  };

  const handleBookSlot = (venue: Venue, slot: TimeSlot) => {
    // In a real app, this would make an API call to book the slot
    alert(`Booking ${slot.duration} at ${venue.name} for ${slot.points} points!`);
    setCurrentView('dashboard');
  };

  const handleBackToMap = () => {
    setCurrentView('map');
    setSelectedVenue(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-medium">DogPark(ing)</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Find your perfect dog parking spot
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Button
                variant={currentView === 'map' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('map')}
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                Find Care
              </Button>
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Dashboard
              </Button>
            </nav>

            {/* User Info & Mobile Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {userPoints} points
                </Badge>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t">
              <div className="space-y-3">
                <Button
                  variant={currentView === 'map' ? 'default' : 'ghost'}
                  onClick={() => {
                    setCurrentView('map');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <Map className="h-4 w-4 mr-2" />
                  Find Care
                </Button>
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => {
                    setCurrentView('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Separator />
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm text-muted-foreground">Points Balance</span>
                  <Badge variant="outline">{userPoints} points</Badge>
                </div>
                <Separator />
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-muted-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 ${currentView === 'map' ? 'relative' : 'container mx-auto px-4 py-6'}`}>
        {currentView === 'map' && (
          <div className="h-full md:container md:mx-auto md:px-4 md:py-6">
            <MapView onVenueSelect={handleVenueSelect} />
          </div>
        )}
        
        {currentView === 'venue-detail' && selectedVenue && (
          <VenueDetail 
            venue={selectedVenue}
            onBack={handleBackToMap}
            onBookSlot={handleBookSlot}
          />
        )}
        
        {currentView === 'dashboard' && (
          <UserDashboard />
        )}
      </main>

      {/* Footer - Hidden on mobile map view */}
      {!(isMobile && currentView === 'map') && (
        <footer className="border-t bg-card/30 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  © 2025 DogPark(ing). Your trusted dog parking solution.
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Help</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}