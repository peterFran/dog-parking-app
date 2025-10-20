'use client';

import { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Input } from './ui/input';
import { MapPin, Loader2 } from 'lucide-react';

interface PlaceDetails {
  address: string;
  latitude: number;
  longitude: number;
  name?: string;
}

interface PlaceAutocompleteInputProps {
  onPlaceSelect: (place: PlaceDetails) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function PlaceAutocompleteInput({
  onPlaceSelect,
  value = '',
  placeholder = 'Search for an address...',
  disabled = false
}: PlaceAutocompleteInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null>(null);

  // Load the Places library
  const places = useMapsLibrary('places');

  // Initialize services when Places library is loaded
  useEffect(() => {
    if (!places) return;

    setAutocompleteService(new places.AutocompleteService());
    setSessionToken(new places.AutocompleteSessionToken());

    // Create a dummy div for PlacesService (it requires a map or div)
    const dummyDiv = document.createElement('div');
    setPlacesService(new places.PlacesService(dummyDiv));
  }, [places]);

  // Set up autocomplete on the input element
  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'gb' }, // Restrict to UK only
      fields: ['formatted_address', 'geometry', 'name', 'place_id'],
      types: ['establishment', 'geocode'] // Allow both businesses and addresses
    });

    // Listen for place selection
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.error('No geometry found for selected place');
        return;
      }

      const placeDetails: PlaceDetails = {
        address: place.formatted_address || '',
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        name: place.name
      };

      onPlaceSelect(placeDetails);

      // Create new session token for next search
      if (places) {
        setSessionToken(new places.AutocompleteSessionToken());
      }
    });

    return () => {
      // Cleanup
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [places, onPlaceSelect]);

  if (!places) {
    return (
      <div className="relative">
        <Input
          disabled
          placeholder="Loading Places API..."
          className="pl-10"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        defaultValue={value}
        disabled={disabled}
        className="pl-10"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <MapPin className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
