import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { makeId } from '@/utils/id';

import {
  emptyData,
  type AppData,
  type Caregiver,
  type FeedingInput,
  type MedicationInput,
  type Pet,
  type PetInput,
  type VaccinationInput,
  type VisitInput,
} from './types';
import { normalizeData } from './validate';

const STORAGE_KEY = '@catalarm/data';

interface DataContextValue {
  data: AppData;
  /** True once the initial load from AsyncStorage has finished. */
  ready: boolean;
  saveCaregiver: (caregiver: Caregiver) => void;
  addPet: (input: PetInput) => Pet;
  updatePet: (id: string, patch: Partial<PetInput>) => void;
  removePet: (id: string) => void;
  addFeeding: (input: FeedingInput) => void;
  removeFeeding: (id: string) => void;
  addVaccination: (input: VaccinationInput) => void;
  removeVaccination: (id: string) => void;
  addMedication: (input: MedicationInput) => void;
  removeMedication: (id: string) => void;
  addVisit: (input: VisitInput) => void;
  removeVisit: (id: string) => void;
  replaceAll: (data: AppData) => void;
  resetAll: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw) {
          setData(normalizeData(JSON.parse(raw)));
        }
      } catch {
        // Missing or corrupt storage: start with an empty dataset.
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {
      // Storage write failures are non-fatal; data remains in memory.
    });
  }, [data, ready]);

  const addPet = useCallback((input: PetInput): Pet => {
    const pet: Pet = { ...input, id: makeId(), createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, pets: [pet, ...d.pets] }));
    return pet;
  }, []);

  const saveCaregiver = useCallback((caregiver: Caregiver) => {
    setData((d) => ({ ...d, caregiver }));
  }, []);

  const updatePet = useCallback((id: string, patch: Partial<PetInput>) => {
    setData((d) => ({
      ...d,
      pets: d.pets.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }, []);

  const removePet = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      pets: d.pets.filter((p) => p.id !== id),
      feedings: d.feedings.filter((r) => r.petId !== id),
      vaccinations: d.vaccinations.filter((r) => r.petId !== id),
      medications: d.medications.filter((r) => r.petId !== id),
      visits: d.visits.filter((r) => r.petId !== id),
    }));
  }, []);

  const addFeeding = useCallback((input: FeedingInput) => {
    setData((d) => ({
      ...d,
      feedings: [{ ...input, id: makeId() }, ...d.feedings],
    }));
  }, []);

  const removeFeeding = useCallback((id: string) => {
    setData((d) => ({ ...d, feedings: d.feedings.filter((r) => r.id !== id) }));
  }, []);

  const addVaccination = useCallback((input: VaccinationInput) => {
    setData((d) => ({
      ...d,
      vaccinations: [{ ...input, id: makeId() }, ...d.vaccinations],
    }));
  }, []);

  const removeVaccination = useCallback((id: string) => {
    setData((d) => ({ ...d, vaccinations: d.vaccinations.filter((r) => r.id !== id) }));
  }, []);

  const addMedication = useCallback((input: MedicationInput) => {
    setData((d) => ({
      ...d,
      medications: [{ ...input, id: makeId() }, ...d.medications],
    }));
  }, []);

  const removeMedication = useCallback((id: string) => {
    setData((d) => ({ ...d, medications: d.medications.filter((r) => r.id !== id) }));
  }, []);

  const addVisit = useCallback((input: VisitInput) => {
    setData((d) => ({
      ...d,
      visits: [{ ...input, id: makeId() }, ...d.visits],
    }));
  }, []);

  const removeVisit = useCallback((id: string) => {
    setData((d) => ({ ...d, visits: d.visits.filter((r) => r.id !== id) }));
  }, []);

  const replaceAll = useCallback((next: AppData) => {
    setData(normalizeData(next));
  }, []);

  const resetAll = useCallback(() => {
    setData(emptyData());
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      data,
      ready,
      saveCaregiver,
      addPet,
      updatePet,
      removePet,
      addFeeding,
      removeFeeding,
      addVaccination,
      removeVaccination,
      addMedication,
      removeMedication,
      addVisit,
      removeVisit,
      replaceAll,
      resetAll,
    }),
    [
      data,
      ready,
      saveCaregiver,
      addPet,
      updatePet,
      removePet,
      addFeeding,
      removeFeeding,
      addVaccination,
      removeVaccination,
      addMedication,
      removeMedication,
      addVisit,
      removeVisit,
      replaceAll,
      resetAll,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData debe usarse dentro de un DataProvider');
  }
  return ctx;
}
