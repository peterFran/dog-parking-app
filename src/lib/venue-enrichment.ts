import { VenueResponse } from './api-client';

/**
 * UI-enhanced venue with mock data for fields not yet available in API
 */
export interface EnrichedVenue extends VenueResponse {
  // Fields from API: id, name, address, latitude, longitude, capacity, operating_hours, services, slot_duration

  // Enriched fields (mocked until available in API)
  rating: number;
  pricePerHour: number;
  availableSlots: number;
  distance: string;
  image: string;
}

/**
 * Stock images for venues (cycling through these until API provides images)
 */
const VENUE_IMAGES = [
  'https://images.unsplash.com/photo-1748915948966-a0f1d7691585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBkYXljYXJlJTIwZmFjaWxpdHl8ZW58MXx8fHwxNzU2NzE2MjUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1702489899194-ba1c1a3dec79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZXQlMjBjYXJlJTIwY2VudGVyfGVufDF8fHx8MTc1NjcxNjI1NHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1650062417263-5b5633237ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZ3MlMjBwbGF5aW5nfGVufDF8fHx8MTc1NjcxNjI1NXww&ixlib=rb-4.1.0&q=80&w=1080',
];

/**
 * Calculates distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generates a deterministic mock rating based on venue ID
 * This ensures the same venue always gets the same rating
 */
function mockRating(venueId: string): number {
  const hash = venueId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Generate rating between 4.3 and 4.9
  return 4.3 + ((hash % 60) / 100);
}

/**
 * Generates a deterministic mock price based on venue ID and capacity
 * This ensures the same venue always gets the same price
 */
function mockPricePerHour(venueId: string, capacity: number): number {
  const hash = venueId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Base price on capacity (larger venues tend to be pricier)
  const basePrice = Math.min(capacity, 50) / 2;
  // Add variation based on hash (±10)
  const variation = (hash % 20) - 10;
  return Math.round(basePrice + variation + 15);
}

/**
 * Generates mock available slots based on capacity
 * In production, this would come from real-time availability API
 */
function mockAvailableSlots(capacity: number): number {
  // Randomly use 40-70% of capacity as available
  const utilization = 0.4 + Math.random() * 0.3;
  return Math.round(capacity * utilization);
}

/**
 * Selects an image for the venue based on its ID (deterministic)
 */
function selectVenueImage(venueId: string): string {
  const hash = venueId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return VENUE_IMAGES[hash % VENUE_IMAGES.length];
}

/**
 * Enriches a venue from the API with mock data for missing fields
 *
 * @param venue - Venue data from API
 * @param userLocation - Optional user location for distance calculation
 * @returns Enriched venue with all UI fields populated
 */
export function enrichVenue(
  venue: VenueResponse,
  userLocation?: { lat: number; lng: number }
): EnrichedVenue {
  // Calculate distance if user location is provided
  let distance = 'N/A';
  if (userLocation) {
    const distanceMiles = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      venue.latitude,
      venue.longitude
    );
    distance = `${distanceMiles.toFixed(1)} mi`;
  }

  return {
    ...venue,
    rating: mockRating(venue.id),
    pricePerHour: mockPricePerHour(venue.id, venue.capacity),
    availableSlots: mockAvailableSlots(venue.capacity),
    distance,
    image: selectVenueImage(venue.id),
  };
}

/**
 * Enriches multiple venues
 */
export function enrichVenues(
  venues: VenueResponse[],
  userLocation?: { lat: number; lng: number }
): EnrichedVenue[] {
  return venues.map((venue) => enrichVenue(venue, userLocation));
}
