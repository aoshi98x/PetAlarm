export type Species = 'dog' | 'cat';
export type Sex = 'male' | 'female';
export type FoodType = 'dry' | 'wet' | 'homemade' | 'other';

export interface Caregiver {
  name: string;
  age?: string;
  birthDate?: string;
  numberOfPets?: string;
  address?: string;
  photoUri?: string;
}


export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed?: string;
  /** ISO date (YYYY-MM-DD). */
  birthDate?: string;
  sex?: Sex;
  color?: string;
  weightKg?: number;
  notes?: string;
  photoUri?: string;
  createdAt: string;
}

export interface FeedingRecord {
  id: string;
  petId: string;
  /** ISO datetime. */
  dateTime: string;
  foodType: FoodType;
  amount?: string;
  notes?: string;
  reminderAt?: string;
}

export interface VaccinationRecord {
  id: string;
  petId: string;
  vaccineName: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** ISO date (YYYY-MM-DD). */
  nextDueDate?: string;
  vet?: string;
  notes?: string;
  reminderAt?: string;
}

export interface MedicationRecord {
  id: string;
  petId: string;
  name: string;
  /** ISO datetime. */
  dateTime: string;
  dosage?: string;
  frequency?: string;
  notes?: string;
  reminderAt?: string;
}

export interface VisitRecord {
  id: string;
  petId: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  vet?: string;
  reason?: string;
  weightKg?: number;
  notes?: string;
  reminderAt?: string;
}

export interface AppData {
  version: number;
  caregiver?: Caregiver;
  pets: Pet[];
  feedings: FeedingRecord[];
  vaccinations: VaccinationRecord[];
  medications: MedicationRecord[];
  visits: VisitRecord[];
}

export const DATA_VERSION = 1;

export function emptyData(): AppData {
  return {
    version: DATA_VERSION,
    caregiver: undefined,
    pets: [],
    feedings: [],
    vaccinations: [],
    medications: [],
    visits: [],
  };
}

export type PetInput = Omit<Pet, 'id' | 'createdAt'>;
export type FeedingInput = Omit<FeedingRecord, 'id'>;
export type VaccinationInput = Omit<VaccinationRecord, 'id'>;
export type MedicationInput = Omit<MedicationRecord, 'id'>;
export type VisitInput = Omit<VisitRecord, 'id'>;
