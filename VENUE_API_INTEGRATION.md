# Venue API Integration

The venue endpoints are now **fully integrated** with the real API using an elegant enrichment layer for missing fields.

## Status: ✅ Live with Real API Data

### What's Working

- **Real venue data** from `/venues` endpoint
- **Coordinates** (`latitude`, `longitude`) from API
- **Typed integration** with OpenAPI-generated types
- **Elegant fallbacks** for fields not yet in API

## Architecture

### 1. API Layer ([src/lib/api-client.ts](src/lib/api-client.ts))

```typescript
async getVenues(): Promise<VenueResponse[]> {
  const response = await this.request<VenueListResponse>('/venues');
  return response.venues;
}
```

Returns: `VenueResponse` with fields from API:
- `id`, `name`, `address`
- `latitude`, `longitude` ✅ (newly added to API)
- `capacity`, `operating_hours`
- `services`, `slot_duration`
- `created_at`, `updated_at`

### 2. Enrichment Layer ([src/lib/venue-enrichment.ts](src/lib/venue-enrichment.ts))

Adds mock data for fields not yet available in the API:

```typescript
export interface EnrichedVenue extends VenueResponse {
  // Enriched fields (mocked until available in API)
  rating: number;          // Deterministic mock based on venue ID
  pricePerHour: number;    // Based on capacity + venue hash
  availableSlots: number;  // Random 40-70% of capacity
  distance: string;        // Calculated from user location
  image: string;           // Cycling through stock images
}
```

**Key Features:**
- **Deterministic mocks**: Same venue always gets same rating/price
- **Distance calculation**: Haversine formula from user location
- **Type-safe**: Extends API types, never conflicts
- **Easy to replace**: When API adds these fields, just remove from enrichment

### 3. Component Integration ([src/components_react/MapView.tsx](src/components_react/MapView.tsx))

```typescript
const { data: apiVenues = [], isLoading, error } = useVenues();
const venues = useMemo(() => enrichVenues(apiVenues, userLocation), [apiVenues]);
```

- Fetches real data via React Query
- Enriches with mock fields
- Full loading/error states
- Type-safe throughout

## When API Fields Become Available

To migrate from mock to real data when API adds a field:

### Example: Adding `rating` to API

1. **Regenerate types**: `npm run generate:types`
2. **Remove from enrichment**: Delete mock logic in [venue-enrichment.ts](src/lib/venue-enrichment.ts)
3. **Type system enforces**: TypeScript will catch any issues

```typescript
// Before (mock)
rating: mockRating(venue.id)

// After (real data from API)
// Just delete the line - rating comes from VenueResponse now!
```

## Mock Data Strategy

### Currently Mocked

| Field | Strategy | When Real? |
|-------|----------|-----------|
| `rating` | Hash-based (4.3-4.9) | When API adds reviews |
| `pricePerHour` | Capacity-based + hash | When API adds pricing |
| `availableSlots` | % of capacity | When real-time availability added |
| `distance` | Haversine formula | Keep calculating client-side |
| `image` | Stock photo rotation | When media uploads added |

### From Real API

| Field | Source |
|-------|--------|
| `id`, `name`, `address` | API |
| `latitude`, `longitude` | API ✅ |
| `capacity` | API |
| `operating_hours` | API |
| `services` | API |
| `slot_duration` | API |

## Usage

### In Components

```typescript
import { useVenues } from '../hooks/useApi';
import { enrichVenues, EnrichedVenue } from '../lib/venue-enrichment';

const { data: apiVenues = [] } = useVenues();
const venues = enrichVenues(apiVenues, userLocation);

// venues now has all fields (real + mocked)
venues.forEach(venue => {
  console.log(venue.name);        // Real from API
  console.log(venue.latitude);    // Real from API
  console.log(venue.rating);      // Mocked (deterministic)
  console.log(venue.distance);    // Calculated
});
```

### Type Safety

```typescript
// TypeScript knows the full shape
function handleVenue(venue: EnrichedVenue) {
  // All fields available with IntelliSense
  const { name, latitude, rating, pricePerHour } = venue;
}
```

## Benefits

1. **Real data now**: Using actual venues from database
2. **Graceful degradation**: Mock fields until API ready
3. **No breaking changes**: Adding API fields is backwards compatible
4. **Deterministic**: Same venue always looks the same
5. **Type-safe**: Full TypeScript coverage
6. **Easy migration**: Remove mocks when ready, types enforce it

## Next Steps

As backend adds these fields, the enrichment layer can be incrementally removed:

1. Add `rating` to backend → regenerate types → delete mock
2. Add `pricing` to backend → regenerate types → delete mock
3. Add `images` to backend → regenerate types → delete mock
4. Add real-time slots → regenerate types → delete mock

The enrichment layer is designed to disappear gracefully as the API matures.
