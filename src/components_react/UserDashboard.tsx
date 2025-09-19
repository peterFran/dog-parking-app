import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Plus, 
  CreditCard, 
  Calendar, 
  Clock, 
  MapPin, 
  Star,
  Edit,
  Settings,
  Heart,
  Award
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: string;
  size: 'Small' | 'Medium' | 'Large';
  image: string;
  specialNeeds?: string[];
  vaccinated: boolean;
}

interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  date: string;
  time: string;
  duration: string;
  pointsUsed: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  dogNames: string[];
}

interface PointsPackage {
  id: string;
  name: string;
  points: number;
  price: number;
  bonus?: number;
  popular?: boolean;
}

const mockDogs: Dog[] = [
  {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: '3 years',
    size: 'Large',
    image: 'https://images.unsplash.com/photo-1687211818108-667d028f1ae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2d8ZW58MXx8fHwxNzU2NzA2MTQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    vaccinated: true,
    specialNeeds: ['Friendly with other dogs']
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'French Bulldog',
    age: '2 years',
    size: 'Small',
    image: 'https://images.unsplash.com/photo-1617223777538-5698e655a613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU2NzAyOTE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    vaccinated: true,
    specialNeeds: ['Needs frequent water breaks']
  }
];

const mockBookings: Booking[] = [
  {
    id: '1',
    venueId: '1',
    venueName: 'Liverpool Street',
    date: 'Sept 2, 2025',
    time: '9:00 AM',
    duration: '4 hours',
    pointsUsed: 100,
    status: 'upcoming',
    dogNames: ['Buddy']
  },
  {
    id: '2',
    venueId: '2',
    venueName: 'Strand',
    date: 'Aug 30, 2025',
    time: '2:00 PM',
    duration: '2 hours',
    pointsUsed: 60,
    status: 'completed',
    dogNames: ['Luna']
  }
];

const pointsPackages: PointsPackage[] = [
  { id: '1', name: 'Starter Pack', points: 100, price: 20 },
  { id: '2', name: 'Value Pack', points: 250, price: 48, bonus: 25, popular: true },
  { id: '3', name: 'Premium Pack', points: 500, price: 92, bonus: 75 },
  { id: '4', name: 'Ultimate Pack', points: 1000, price: 160, bonus: 200 }
];

export function UserDashboard() {
  const [currentPoints] = useState(150);
  const [dogs] = useState(mockDogs);
  const [bookings] = useState(mockBookings);

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium">My Dashboard</h2>
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
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <div className="flex-1">
                        <p className="font-medium">{booking.venueName}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{booking.date}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{booking.time}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{booking.pointsUsed} points</Badge>
                    </div>
                  ))
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
                {dogs.map((dog) => (
                  <div key={dog.id} className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={dog.image} alt={dog.name} />
                      <AvatarFallback>{dog.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{dog.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dog.breed} • {dog.age} • {dog.size}
                      </p>
                    </div>
                    <Badge variant={dog.vaccinated ? "default" : "secondary"}>
                      {dog.vaccinated ? "Vaccinated" : "Needs Update"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dogs" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">My Dogs</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Dog
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map((dog) => (
              <Card key={dog.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{dog.name}</CardTitle>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square overflow-hidden rounded-lg">
                    <ImageWithFallback
                      src={dog.image}
                      alt={dog.name}
                      className="w-full h-full object-cover"
                    />
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

                  {dog.specialNeeds && dog.specialNeeds.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Special Notes:</p>
                      <div className="space-y-1">
                        {dog.specialNeeds.map((need, index) => (
                          <p key={index} className="text-xs bg-muted/50 rounded px-2 py-1">
                            {need}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <Badge variant={dog.vaccinated ? "default" : "secondary"}>
                      {dog.vaccinated ? "Vaccinated" : "Needs Update"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h4 className="font-medium">{booking.venueName}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{booking.time} ({booking.duration})</span>
                            </div>
                          </div>
                          <p className="text-sm">
                            Dogs: {booking.dogNames.join(', ')}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge variant="outline">{booking.pointsUsed} points</Badge>
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
                ))
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
              {pastBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h4 className="font-medium">{booking.venueName}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{booking.time} ({booking.duration})</span>
                          </div>
                        </div>
                        <p className="text-sm">
                          Dogs: {booking.dogNames.join(', ')}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge variant="secondary">Completed</Badge>
                        <p className="text-sm text-muted-foreground">
                          {booking.pointsUsed} points used
                        </p>
                        <Button variant="outline" size="sm">
                          Book Again
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
    </div>
  );
}