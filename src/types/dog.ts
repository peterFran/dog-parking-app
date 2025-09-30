// API request/response types matching the backend contract
export interface CreateDogRequest {
  name: string;
  breed: string;
  date_of_birth: string; // ISO date string (YYYY-MM-DD)
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  vaccination_status: 'VACCINATED' | 'NOT_VACCINATED';
  microchipped: boolean;
  special_needs: string[];
  medical_notes: string;
  behavior_notes: string;
  favorite_activities: string; // comma-separated string
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  date_of_birth: string; // ISO date string
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  vaccination_status: 'VACCINATED' | 'NOT_VACCINATED';
  microchipped: boolean;
  special_needs: string[];
  medical_notes: string;
  behavior_notes: string;
  favorite_activities: string; // comma-separated string
  owner_id?: string; // Added by backend
  created_at?: string; // Added by backend
  updated_at?: string; // Added by backend
}

// UI-specific types for display purposes
export interface DogForUI {
  id: string;
  name: string;
  breed: string;
  age: string; // Calculated from date_of_birth
  size: 'Small' | 'Medium' | 'Large'; // UI-friendly format
  image: string; // Default image or uploaded photo
  specialNeeds?: string[];
  vaccinated: boolean; // Simplified from vaccination_status
  birthDate?: string;
  microchipped?: boolean;
  medicalNotes?: string;
  behaviorNotes?: string;
  favoriteActivities?: string[];
}

// Utility functions for data transformation
export const transformDogForUI = (dog: Dog): DogForUI => {
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

  return {
    id: dog.id,
    name: dog.name,
    breed: dog.breed,
    age: calculateAge(dog.date_of_birth),
    size: dog.size.charAt(0) + dog.size.slice(1).toLowerCase() as 'Small' | 'Medium' | 'Large',
    image: `https://images.unsplash.com/photo-1561037404-61cd46aa615b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTY3MDI5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080`,
    specialNeeds: dog.special_needs,
    vaccinated: dog.vaccination_status === 'VACCINATED',
    birthDate: dog.date_of_birth,
    microchipped: dog.microchipped,
    medicalNotes: dog.medical_notes,
    behaviorNotes: dog.behavior_notes,
    favoriteActivities: dog.favorite_activities ? dog.favorite_activities.split(', ') : []
  };
};

export const transformDogForAPI = (dogData: Omit<DogForUI, 'id' | 'age'>): CreateDogRequest => {
  return {
    name: dogData.name,
    breed: dogData.breed,
    date_of_birth: dogData.birthDate || '',
    size: dogData.size.toUpperCase() as 'SMALL' | 'MEDIUM' | 'LARGE',
    vaccination_status: dogData.vaccinated ? 'VACCINATED' : 'NOT_VACCINATED',
    microchipped: dogData.microchipped || false,
    special_needs: dogData.specialNeeds || [],
    medical_notes: dogData.medicalNotes || '',
    behavior_notes: dogData.behaviorNotes || '',
    favorite_activities: dogData.favoriteActivities ? dogData.favoriteActivities.join(', ') : ''
  };
};