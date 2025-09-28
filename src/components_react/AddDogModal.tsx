import {
  AlertCircle,
  Heart,
  Plus,
  Scale,
  Shield,
  Upload,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

interface Dog {
  id: string;
  name: string;
  breed: string;
  age: string;
  size: 'Small' | 'Medium' | 'Large';
  image: string;
  specialNeeds?: string[];
  vaccinated: boolean;
  birthDate?: string;
  microchipped?: boolean;
  medicalNotes?: string;
  behaviorNotes?: string;
  favoriteActivities?: string[];
}

interface AddDogModalProps {
  children: React.ReactNode;
  onAddDog: (dog: Omit<Dog, 'id'>) => void;
}

const breedSuggestions = [
  'Golden Retriever', 'Labrador Retriever', 'French Bulldog', 'German Shepherd',
  'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund',
  'Siberian Husky', 'Boxer', 'Border Collie', 'Boston Terrier', 'Shih Tzu',
  'Pomeranian', 'Australian Shepherd', 'Cavalier King Charles Spaniel', 'Mixed Breed'
];

const activityOptions = [
  'Playing fetch', 'Swimming', 'Running', 'Hiking', 'Socializing with other dogs',
  'Playing with toys', 'Agility training', 'Beach walks', 'Park visits', 'Trick training'
];

export function AddDogModal({ children, onAddDog }: AddDogModalProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    size: 'Medium' as 'Small' | 'Medium' | 'Large',
    birthDate: '',
    vaccinated: true,
    microchipped: false,
    image: '',
    medicalNotes: '',
    behaviorNotes: '',
    specialNeeds: [] as string[],
    favoriteActivities: [] as string[]
  });
  
  const [newSpecialNeed, setNewSpecialNeed] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSpecialNeed = () => {
    if (newSpecialNeed.trim() && !formData.specialNeeds.includes(newSpecialNeed.trim())) {
      setFormData(prev => ({
        ...prev,
        specialNeeds: [...prev.specialNeeds, newSpecialNeed.trim()]
      }));
      setNewSpecialNeed('');
    }
  };

  const removeSpecialNeed = (need: string) => {
    setFormData(prev => ({
      ...prev,
      specialNeeds: prev.specialNeeds.filter(n => n !== need)
    }));
  };

  const toggleActivity = (activity: string) => {
    const newActivities = selectedActivities.includes(activity)
      ? selectedActivities.filter(a => a !== activity)
      : [...selectedActivities, activity];
    
    setSelectedActivities(newActivities);
    setFormData(prev => ({
      ...prev,
      favoriteActivities: newActivities
    }));
  };

  const handleSubmit = () => {
    // Calculate age from birth date
    const calculateAge = (birthDate: string) => {
      const today = new Date();
      const birth = new Date(birthDate);
      const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
      
      if (ageInMonths < 12) {
        return `${ageInMonths} months`;
      } else {
        const years = Math.floor(ageInMonths / 12);
        const remainingMonths = ageInMonths % 12;
        if (remainingMonths === 0) {
          return `${years} year${years > 1 ? 's' : ''}`;
        } else {
          return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} months`;
        }
      }
    };

    const dogData = {
      // Required fields for API
      name: formData.name,
      breed: formData.breed,
      date_of_birth: formData.birthDate,
      size: formData.size.toUpperCase(), // Convert "Medium" to "MEDIUM"
      vaccination_status: formData.vaccinated ? "VACCINATED" : "NOT_VACCINATED",

      // Optional fields for API
      microchipped: formData.microchipped,
      special_needs: formData.specialNeeds,
      medical_notes: formData.medicalNotes || "",
      behavior_notes: formData.behaviorNotes || "",
      favorite_activities: formData.favoriteActivities.length > 0
        ? formData.favoriteActivities.join(", ")
        : "",

      // Additional fields for local display (not sent to API)
      age: calculateAge(formData.birthDate),
      image: formData.image || `https://images.unsplash.com/photo-1561037404-61cd46aa615b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTY3MDI5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080`
    };

    onAddDog(dogData);
    setOpen(false);
    setCurrentStep(1);
    setFormData({
      name: '',
      breed: '',
      size: 'Medium',
      birthDate: '',
      vaccinated: true,
      microchipped: false,
      image: '',
      medicalNotes: '',
      behaviorNotes: '',
      specialNeeds: [],
      favoriteActivities: []
    });
    setSelectedActivities([]);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        // Check that name, breed, and birth date are filled
        if (!formData.name || !formData.breed || !formData.birthDate) {
          return false;
        }
        // Check that birth date is not in the future
        const birthDate = new Date(formData.birthDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        return birthDate <= today;
      case 2:
        return true; // Physical details & health
      case 3:
        return true; // Preferences
      case 4:
        return true; // Review - always can proceed to submit
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Add New Dog
          </DialogTitle>
          <DialogDescription>
            Complete this form to add your dog to DogPark(ing) and start booking care sessions.
          </DialogDescription>
          {/* Step Progress Bar */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors ${
                    step === currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : step < currentStep 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 mx-2 transition-colors ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <p className="text-sm text-muted-foreground">Let's start with the essentials</p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.image} alt={formData.name || "Dog photo"} />
                    <AvatarFallback className="text-lg">
                      {formData.name ? formData.name[0].toUpperCase() : <Upload className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
                  >
                    <Upload className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Add a photo (optional)</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Dog's Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your dog's name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed *</Label>
                  <Select onValueChange={(value) => handleInputChange('breed', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select or search breed" />
                    </SelectTrigger>
                    <SelectContent>
                      {breedSuggestions.map((breed) => (
                        <SelectItem key={breed} value={breed}>
                          {breed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {formData.birthDate && new Date(formData.birthDate) > new Date() && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Birth date cannot be in the future
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Physical Details & Health */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">Physical Details & Health</h3>
                <p className="text-sm text-muted-foreground">Help caregivers understand your dog's needs</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Size Category
                  </Label>
                  <RadioGroup
                    value={formData.size}
                    onValueChange={(value) => handleInputChange('size', value as 'Small' | 'Medium' | 'Large')}
                  >
                    <div className="grid grid-cols-3 gap-4">
                      <Label className="flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="Small" />
                        <div className="text-center">
                          <p className="font-medium">Small</p>
                          <p className="text-xs text-muted-foreground">Under 25 lbs</p>
                        </div>
                      </Label>
                      <Label className="flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="Medium" />
                        <div className="text-center">
                          <p className="font-medium">Medium</p>
                          <p className="text-xs text-muted-foreground">25-60 lbs</p>
                        </div>
                      </Label>
                      <Label className="flex flex-col items-center gap-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="Large" />
                        <div className="text-center">
                          <p className="font-medium">Large</p>
                          <p className="text-xs text-muted-foreground">Over 60 lbs</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Up to date with vaccinations</span>
                      </div>
                      <Switch
                        checked={formData.vaccinated}
                        onCheckedChange={(checked) => handleInputChange('vaccinated', checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Microchipped</span>
                      </div>
                      <Switch
                        checked={formData.microchipped}
                        onCheckedChange={(checked) => handleInputChange('microchipped', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label htmlFor="medicalNotes">Medical Notes (optional)</Label>
                  <Textarea
                    id="medicalNotes"
                    value={formData.medicalNotes}
                    onChange={(e) => handleInputChange('medicalNotes', e.target.value)}
                    placeholder="Any medical conditions, medications, or health considerations..."
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Special Needs & Requirements</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSpecialNeed}
                      onChange={(e) => setNewSpecialNeed(e.target.value)}
                      placeholder="e.g. Needs frequent water breaks"
                      onKeyPress={(e) => e.key === 'Enter' && addSpecialNeed()}
                    />
                    <Button type="button" variant="outline" onClick={addSpecialNeed}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.specialNeeds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.specialNeeds.map((need, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {need}
                          <button
                            type="button"
                            onClick={() => removeSpecialNeed(need)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">Preferences</h3>
                <p className="text-sm text-muted-foreground">Help us provide the best care experience</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="behaviorNotes">Personality & Behavior Notes</Label>
                  <Textarea
                    id="behaviorNotes"
                    value={formData.behaviorNotes}
                    onChange={(e) => handleInputChange('behaviorNotes', e.target.value)}
                    placeholder="Describe your dog's personality, behavior with other dogs, energy level..."
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Favorite Activities (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {activityOptions.map((activity) => (
                      <Label
                        key={activity}
                        className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedActivities.includes(activity)
                            ? 'bg-primary/10 border-primary'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedActivities.includes(activity)}
                          onChange={() => toggleActivity(activity)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          selectedActivities.includes(activity)
                            ? 'bg-primary border-primary'
                            : 'border-muted-foreground'
                        }`}>
                          {selectedActivities.includes(activity) && (
                            <div className="w-2 h-2 bg-primary-foreground rounded" />
                          )}
                        </div>
                        <span className="text-sm">{activity}</span>
                      </Label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium">Review & Confirm</h3>
                <p className="text-sm text-muted-foreground">Please review your dog's information before adding</p>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={formData.image} alt={formData.name} />
                        <AvatarFallback className="text-lg">
                          {formData.name ? formData.name[0].toUpperCase() : <Upload className="h-6 w-6" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{formData.name}</h4>
                        <p className="text-sm text-muted-foreground">{formData.breed}</p>
                        <p className="text-sm text-muted-foreground">Born: {formData.birthDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Physical Details & Health */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Physical Details & Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Size</p>
                        <Badge variant="outline">{formData.size}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Vaccinated</p>
                        <Badge variant={formData.vaccinated ? "default" : "secondary"}>
                          {formData.vaccinated ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Microchipped</p>
                        <Badge variant={formData.microchipped ? "default" : "secondary"}>
                          {formData.microchipped ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>

                    {formData.medicalNotes && (
                      <div>
                        <p className="text-sm text-muted-foreground">Medical Notes</p>
                        <p className="text-sm bg-muted/50 rounded p-2 mt-1">{formData.medicalNotes}</p>
                      </div>
                    )}

                    {formData.specialNeeds.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Special Needs</p>
                        <div className="flex flex-wrap gap-1">
                          {formData.specialNeeds.map((need, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {need}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {formData.behaviorNotes && (
                      <div>
                        <p className="text-sm text-muted-foreground">Behavior Notes</p>
                        <p className="text-sm bg-muted/50 rounded p-2 mt-1">{formData.behaviorNotes}</p>
                      </div>
                    )}

                    {formData.favoriteActivities.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Favorite Activities</p>
                        <div className="flex flex-wrap gap-1">
                          {formData.favoriteActivities.map((activity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.favoriteActivities.length === 0 && !formData.behaviorNotes && (
                      <p className="text-sm text-muted-foreground italic">No preferences specified</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Add Dog
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}