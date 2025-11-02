import {
  AlertCircle,
  Award,
  Calendar,
  Clock,
  CreditCard,
  Edit,
  Heart,
  Loader2,
  Plus,
  Star,
  Trash2
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBookings, useCreateDog, useDeleteDog, useDogs, useUpdateDog, useVenues } from '../hooks/useApi';
import { BookingResponse, Dog, DogRequest } from '../lib/api-client';
import { AddDogModal } from './AddDogModal';
import { EditDogModal } from './EditDogModal';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from './ui/toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';


interface PointsPackage {
  id: string;
  name: string;
  points: number;
  price: number;
  bonus?: number;
  popular?: boolean;
}

const pointsPackages: PointsPackage[] = [
  { id: '1', name: 'Starter Pack', points: 100, price: 20 },
  { id: '2', name: 'Value Pack', points: 250, price: 48, bonus: 25, popular: true },
  { id: '3', name: 'Premium Pack', points: 500, price: 92, bonus: 75 },
  { id: '4', name: 'Ultimate Pack', points: 1000, price: 160, bonus: 200 }
];

export function UserDashboard() {
  const { user } = useAuth();
  const [currentPoints] = useState(150);
  const { addToast } = useToast();

  // Edit and delete state
  const [editingDog, setEditingDog] = useState<Dog | null>(null);
  const [deletingDogId, setDeletingDogId] = useState<string | null>(null);

  // Real API hooks
  const { data: dogs = [], isLoading: dogsLoading, error: dogsError } = useDogs();
  const { data: bookingsData = [], isLoading: bookingsLoading, error: bookingsError } = useBookings();
  const { data: venues = [] } = useVenues();
  const createDogMutation = useCreateDog();
  const updateDogMutation = useUpdateDog();
  const deleteDogMutation = useDeleteDog();

  // Extract first name from user's display name or email
  const getUserFirstName = () => {
    if (!user) return 'My';
    
    // Try to get first name from displayName
    if (user.displayName) {
      return user.displayName.split(' ')[0];
    }
    
    // Fallback to first part of email before @
    if (user.email) {
      const emailName = user.email.split('@')[0];
      // Capitalize first letter
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return 'My';
  };

  const handleAddDog = async (dogData: DogRequest) => {
    try {
      await createDogMutation.mutateAsync(dogData);
      addToast({
        type: 'success',
        title: 'Dog Added Successfully!',
        description: `${dogData.name} has been added to your profile.`
      });
    } catch (error) {
      console.error('Error adding dog:', error);
      addToast({
        type: 'error',
        title: 'Failed to Add Dog',
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
      });
    }
  };

  const handleUpdateDog = async (id: string, dogData: Partial<DogRequest>) => {
    try {
      await updateDogMutation.mutateAsync({ id, data: dogData });
      addToast({
        type: 'success',
        title: 'Dog Updated Successfully!',
        description: `${dogData.name}'s profile has been updated.`
      });
    } catch (error) {
      console.error('Error updating dog:', error);
      addToast({
        type: 'error',
        title: 'Failed to Update Dog',
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
      });
    }
  };

  const handleDeleteDog = async (dogId: string, dogName: string) => {
    try {
      console.log('[UserDashboard] Attempting to delete dog:', dogId, dogName);
      await deleteDogMutation.mutateAsync(dogId);
      setDeletingDogId(null);
      addToast({
        type: 'success',
        title: 'Dog Deleted Successfully',
        description: `${dogName} has been removed from your profile.`
      });
    } catch (error) {
      console.error('[UserDashboard] Error deleting dog:', error);
      setDeletingDogId(null);

      // Provide more specific error message
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'Delete functionality is not yet available. The backend endpoint may not be implemented.';
        } else {
          errorMessage = error.message;
        }
      }

      addToast({
        type: 'error',
        title: 'Failed to Delete Dog',
        description: errorMessage
      });
    }
  };

  // Helper function to get venue name by ID
  const getVenueName = (venueId: string) => {
    const venue = venues.find(v => v.id === venueId);
    return venue?.name || 'Unknown Venue';
  };

  // Helper function to get dog name by ID
  const getDogName = (dogId: string) => {
    const dog = dogs.find(d => d.id === dogId);
    return dog?.name || 'Unknown Dog';
  };

  // Helper function to format date and time from ISO string
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  // Helper function to calculate duration between start and end times
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  // Process bookings into upcoming and past
  const upcomingBookings = useMemo(() => {
    return bookingsData.filter((b: BookingResponse) =>
      b.status === 'pending' || b.status === 'confirmed' || b.status === 'in_progress'
    );
  }, [bookingsData]);

  const pastBookings = useMemo(() => {
    return bookingsData.filter((b: BookingResponse) =>
      b.status === 'completed' || b.status === 'cancelled'
    );
  }, [bookingsData]);

  // Error handling for API
  if (dogsError || bookingsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to Load Data</h3>
          <p className="text-muted-foreground mb-4">
            There was an error loading your {dogsError ? 'dogs' : 'bookings'}. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">{getUserFirstName()}'s Dashboard</h2>
          <p className="text-muted-foreground">Manage your dogs and bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Available Points</p>
            <p className="text-lg font-medium">{currentPoints} points</p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Buy Points
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dogs">My Dogs</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="points">Points</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Dogs</p>
                    <p className="text-2xl font-medium">{dogs.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-orange-100">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-medium">{upcomingBookings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-amber-100">
                    <Award className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Points Balance</p>
                    <p className="text-2xl font-medium">{currentPoints}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-red-100">
                    <Star className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-medium">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookingsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading bookings...</span>
                  </div>
                ) : upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => {
                    const { date, time } = formatDateTime(booking.start_time);
                    return (
                      <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                        <div className="flex-1">
                          <p className="font-medium">{getVenueName(booking.venue_id)}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>{date}</span>
                            <Clock className="h-3 w-3 ml-2" />
                            <span>{time}</span>
                          </div>
                        </div>
                        <Badge variant="outline">£{booking.price}</Badge>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-4">No upcoming bookings</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Dogs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dogsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading dogs...</span>
                  </div>
                ) : dogs.length > 0 ? (
                  dogs.map((dog) => (
                    <div key={dog.id} className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{dog.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{dog.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {dog.breed} • {dog.age} • {dog.size}
                        </p>
                      </div>
                      <Badge variant={dog.vaccination_status === 'VACCINATED' ? "default" : "secondary"}>
                        {dog.vaccination_status === 'VACCINATED' ? "Vaccinated" : "Needs Update"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">No dogs added yet</p>
                    <AddDogModal onAddDog={handleAddDog}>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Dog
                      </Button>
                    </AddDogModal>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dogs" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">My Dogs</h3>
            <AddDogModal onAddDog={handleAddDog} isSubmitting={createDogMutation.isPending}>
              <Button disabled={createDogMutation.isPending}>
                {createDogMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add New Dog
              </Button>
            </AddDogModal>
          </div>

          {dogsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Loading dogs...</span>
            </div>
          ) : dogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dogs.map((dog) => (
                <Card key={dog.id}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{dog.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingDog(dog)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingDogId(dog.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-accent-sage/20 to-accent-lavender/20 flex items-center justify-center">
                      <div className="text-6xl font-bold text-muted-foreground/30">
                        {dog.name[0]}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Breed:</span>
                        <span className="text-sm">{dog.breed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Age:</span>
                        <span className="text-sm">{dog.age}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Size:</span>
                        <Badge variant="outline" className="text-xs">{dog.size}</Badge>
                      </div>
                    </div>

                    {dog.special_needs && dog.special_needs.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Special Notes:</p>
                        <div className="space-y-1">
                          {dog.special_needs.map((need, index) => (
                            <p key={index} className="text-xs bg-muted/50 rounded px-2 py-1">
                              {need}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant={dog.vaccination_status === 'VACCINATED' ? "default" : "secondary"}>
                        {dog.vaccination_status === 'VACCINATED' ? "Vaccinated" : "Needs Update"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingDog(dog)}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No dogs added yet</h3>
                <p className="text-muted-foreground mb-6">
                  Add your first dog to start booking care sessions
                </p>
                <AddDogModal onAddDog={handleAddDog} isSubmitting={createDogMutation.isPending}>
                  <Button disabled={createDogMutation.isPending}>
                    {createDogMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    Add Your First Dog
                  </Button>
                </AddDogModal>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-muted-foreground">Loading bookings...</span>
                </div>
              ) : upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => {
                  const { date, time } = formatDateTime(booking.start_time);
                  const duration = calculateDuration(booking.start_time, booking.end_time);
                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h4 className="font-medium">{getVenueName(booking.venue_id)}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{time} ({duration})</span>
                              </div>
                            </div>
                            <p className="text-sm">
                              Dog: {getDogName(booking.dog_id)}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {booking.service_type}
                            </Badge>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge variant="outline">£{booking.price}</Badge>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Modify
                              </Button>
                              <Button variant="outline" size="sm">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No upcoming bookings</p>
                    <Button className="mt-4">Book Your First Visit</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-muted-foreground">Loading bookings...</span>
                </div>
              ) : pastBookings.length > 0 ? (
                pastBookings.map((booking) => {
                  const { date, time } = formatDateTime(booking.start_time);
                  const duration = calculateDuration(booking.start_time, booking.end_time);
                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h4 className="font-medium">{getVenueName(booking.venue_id)}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{time} ({duration})</span>
                              </div>
                            </div>
                            <p className="text-sm">
                              Dog: {getDogName(booking.dog_id)}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {booking.service_type}
                            </Badge>
                          </div>
                          <div className="text-right space-y-2">
                            <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                              {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              £{booking.price}
                            </p>
                            <Button variant="outline" size="sm">
                              Book Again
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No past bookings</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="points" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-medium mb-4">Buy Points</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pointsPackages.map((pkg) => (
                  <Card key={pkg.id} className={pkg.popular ? 'ring-2 ring-primary' : ''}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        {pkg.popular && <Badge>Popular</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-medium">£{pkg.price}</p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.points} points
                          {pkg.bonus && (
                            <span className="text-primary"> + {pkg.bonus} bonus</span>
                          )}
                        </p>
                      </div>
                      <Button className="w-full">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Purchase
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Points Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-medium">{currentPoints}</p>
                    <p className="text-sm text-muted-foreground">Available Points</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This month usage</span>
                      <span>85 points</span>
                    </div>
                    <Progress value={57} className="h-2" />
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Points earned</span>
                      <span className="text-amber-600">+25</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Points used</span>
                      <span className="text-orange-600">-110</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Booking at Strand</span>
                    <span className="text-orange-600">-60</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Referral bonus</span>
                    <span className="text-amber-600">+25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Booking at Liverpool Street</span>
                    <span className="text-orange-600">-50</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dog Modal */}
      {editingDog && (
        <EditDogModal
          dog={editingDog}
          open={!!editingDog}
          onOpenChange={(open) => !open && setEditingDog(null)}
          onUpdateDog={handleUpdateDog}
          isSubmitting={updateDogMutation.isPending}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingDogId} onOpenChange={(open) => !open && setDeletingDogId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {dogs.find(d => d.id === deletingDogId)?.name}&apos;s profile.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const dog = dogs.find(d => d.id === deletingDogId);
                if (dog && deletingDogId) {
                  handleDeleteDog(deletingDogId, dog.name);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteDogMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}