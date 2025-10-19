import {
  Building2,
  Clock,
  Loader2,
  MapPin,
  Plus,
  Users,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { VenueRequest, ServiceType, DayHours } from '../lib/api-client';
import { PlaceAutocompleteInput } from './PlaceAutocompleteInput';

interface AddVenueModalProps {
  children: React.ReactNode;
  onAddVenue: (venue: VenueRequest) => Promise<void>;
  isSubmitting?: boolean;
}

const serviceTypes: ServiceType[] = ['daycare', 'boarding', 'grooming', 'walking', 'training'];

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function AddVenueModal({ children, onAddVenue, isSubmitting = false }: AddVenueModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    capacity: '',
    slotDuration: '60',
    services: ['daycare'] as ServiceType[],
    operatingHours: {
      monday: { open: true, start: '09:00', end: '18:00' },
      tuesday: { open: true, start: '09:00', end: '18:00' },
      wednesday: { open: true, start: '09:00', end: '18:00' },
      thursday: { open: true, start: '09:00', end: '18:00' },
      friday: { open: true, start: '09:00', end: '18:00' },
      saturday: { open: false, start: '09:00', end: '18:00' },
      sunday: { open: false, start: '09:00', end: '18:00' },
    } as Record<typeof daysOfWeek[number], DayHours>
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceSelect = (place: { address: string; latitude: number; longitude: number; name?: string }) => {
    setFormData(prev => ({
      ...prev,
      address: place.address,
      latitude: place.latitude.toString(),
      longitude: place.longitude.toString(),
      // Optionally pre-fill name if not already set
      name: prev.name || place.name || ''
    }));
  };

  const toggleService = (service: ServiceType) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const updateOperatingHours = (day: typeof daysOfWeek[number], field: keyof DayHours, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async () => {
    const venueData: VenueRequest = {
      name: formData.name,
      address: formData.address,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      capacity: parseInt(formData.capacity),
      slot_duration: parseInt(formData.slotDuration),
      services: formData.services,
      operating_hours: formData.operatingHours
    };

    try {
      await onAddVenue(venueData);
      // Reset form and close modal on success
      setOpen(false);
      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        capacity: '',
        slotDuration: '60',
        services: ['daycare'],
        operatingHours: {
          monday: { open: true, start: '09:00', end: '18:00' },
          tuesday: { open: true, start: '09:00', end: '18:00' },
          wednesday: { open: true, start: '09:00', end: '18:00' },
          thursday: { open: true, start: '09:00', end: '18:00' },
          friday: { open: true, start: '09:00', end: '18:00' },
          saturday: { open: false, start: '09:00', end: '18:00' },
          sunday: { open: false, start: '09:00', end: '18:00' },
        }
      });
    } catch (error) {
      console.error('Error in AddVenueModal:', error);
    }
  };

  const canSubmit = () => {
    return (
      formData.name.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.latitude !== '' &&
      !isNaN(parseFloat(formData.latitude)) &&
      formData.longitude !== '' &&
      !isNaN(parseFloat(formData.longitude)) &&
      formData.capacity !== '' &&
      parseInt(formData.capacity) > 0 &&
      formData.services.length > 0
    );
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Add New Venue
          </DialogTitle>
          <DialogDescription>
            Complete this form to add a new venue to the DogPark(ing) platform.
          </DialogDescription>
        </DialogHeader>

        <APIProvider apiKey={apiKey}>
          <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Venue Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Happy Paws Downtown"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Search Address (UK only) *</Label>
                <PlaceAutocompleteInput
                  onPlaceSelect={handlePlaceSelect}
                  value={formData.address}
                  placeholder="Start typing to search for an address..."
                />
                <p className="text-xs text-muted-foreground">
                  Select an address from the dropdown to auto-fill coordinates
                </p>
              </div>

              {/* Show selected coordinates as read-only badges */}
              {formData.latitude && formData.longitude && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Selected Location
                  </Label>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Latitude</p>
                          <p className="text-sm font-mono">{parseFloat(formData.latitude).toFixed(6)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Longitude</p>
                          <p className="text-sm font-mono">{parseFloat(formData.longitude).toFixed(6)}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, address: '', latitude: '', longitude: '' }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Capacity & Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Capacity & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Maximum Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    placeholder="e.g. 20"
                  />
                  <p className="text-xs text-muted-foreground">Max dogs at one time</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slotDuration">Slot Duration (minutes)</Label>
                  <Input
                    id="slotDuration"
                    type="number"
                    min="15"
                    step="15"
                    value={formData.slotDuration}
                    onChange={(e) => handleInputChange('slotDuration', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Default: 60 minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Services Offered *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {serviceTypes.map((service) => (
                  <Badge
                    key={service}
                    variant={formData.services.includes(service) ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2"
                    onClick={() => toggleService(service)}
                  >
                    {formData.services.includes(service) && (
                      <Plus className="h-3 w-3 mr-1 rotate-45" />
                    )}
                    {service.charAt(0).toUpperCase() + service.slice(1)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-28">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.operatingHours[day].open}
                        onCheckedChange={(checked) => updateOperatingHours(day, 'open', checked)}
                      />
                      <Label className="capitalize font-medium">{day}</Label>
                    </div>
                  </div>

                  {formData.operatingHours[day].open ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={formData.operatingHours[day].start || '09:00'}
                        onChange={(e) => updateOperatingHours(day, 'start', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={formData.operatingHours[day].end || '18:00'}
                        onChange={(e) => updateOperatingHours(day, 'end', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Closed</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Venue...
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4 mr-2" />
                  Add Venue
                </>
              )}
            </Button>
          </div>
        </div>
        </APIProvider>
      </DialogContent>
    </Dialog>
  );
}
