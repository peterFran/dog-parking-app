import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ArrowLeft, Star, MapPin, Phone, Clock, Users, Wifi, Car, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TimeSlot {
  id: string;
  time: string;
  duration: string;
  points: number;
  available: boolean;
  spotsLeft: number;
}

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
  phone?: string;
  description?: string;
  amenities?: string[];
}

const mockTimeSlots: TimeSlot[] = [
  { id: '1', time: '9:00 AM', duration: '2 hours', points: 50, available: true, spotsLeft: 3 },
  { id: '2', time: '11:00 AM', duration: '3 hours', points: 75, available: true, spotsLeft: 1 },
  { id: '3', time: '1:00 PM', duration: '2 hours', points: 50, available: false, spotsLeft: 0 },
  { id: '4', time: '3:00 PM', duration: '4 hours', points: 100, available: true, spotsLeft: 5 },
  { id: '5', time: '5:00 PM', duration: '2 hours', points: 60, available: true, spotsLeft: 2 },
];

interface VenueDetailProps {
  venue: Venue;
  onBack: () => void;
  onBookSlot: (venue: Venue, slot: TimeSlot) => void;
}

export function VenueDetail({ venue, onBack, onBookSlot }: VenueDetailProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const extendedVenue = {
    ...venue,
    phone: '+44 20 7946 0958',
    description: 'A premium dog care facility dedicated to providing safe, fun, and enriching experiences for your furry friends. Our trained staff ensures every dog gets the attention and care they deserve.',
    amenities: ['WiFi', 'Parking', 'Indoor Play', 'Outdoor Yard', 'Climate Control', 'Security Cameras']
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    }
  };

  const handleBooking = () => {
    if (selectedSlot) {
      onBookSlot(venue, selectedSlot);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Map
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-medium">{extendedVenue.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{extendedVenue.address}</span>
            <span>•</span>
            <span>{extendedVenue.distance}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{extendedVenue.rating}</span>
          <span className="text-muted-foreground text-sm">(127 reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="aspect-video overflow-hidden rounded-lg">
            <ImageWithFallback
              src={extendedVenue.image}
              alt={extendedVenue.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Facility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {extendedVenue.description}
              </p>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {extendedVenue.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Amenities</h4>
                <div className="grid grid-cols-2 gap-2">
                  {extendedVenue.amenities?.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      {amenity === 'WiFi' && <Wifi className="h-4 w-4 text-muted-foreground" />}
                      {amenity === 'Parking' && <Car className="h-4 w-4 text-muted-foreground" />}
                      {amenity.includes('Play') && <Heart className="h-4 w-4 text-muted-foreground" />}
                      {!['WiFi', 'Parking'].includes(amenity) && !amenity.includes('Play') && 
                        <Clock className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{extendedVenue.phone}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
              <p className="text-sm text-muted-foreground">Today, Sept 1, 2025</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockTimeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    !slot.available 
                      ? 'bg-muted/50 border-muted cursor-not-allowed opacity-60'
                      : selectedSlot?.id === slot.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleSlotSelect(slot)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{slot.time}</span>
                    <span className="text-sm font-medium text-primary">
                      {slot.points} points
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{slot.duration}</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>
                        {slot.available 
                          ? `${slot.spotsLeft} spots left`
                          : 'Fully booked'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedSlot && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{selectedSlot.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{selectedSlot.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost:</span>
                    <span className="font-medium">{selectedSlot.points} points</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{selectedSlot.points} points</span>
                </div>

                <Button className="w-full" onClick={handleBooking}>
                  Book This Slot
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  You currently have 150 points available
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}