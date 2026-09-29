import { makeId } from '@/utils/id';
import {
  DATA_VERSION,
  emptyData,
  type AppData,
  type FeedingRecord,
  type MedicationRecord,
  type Pet,
  type VaccinationRecord,
  type VisitRecord,
} from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function asDate(value: unknown): string | undefined {
  const s = asString(value);
  if (!s) return undefined;
  return Number.isNaN(new Date(s).getTime()) ? undefined : s;
}

function asDateTime(value: unknown): string | undefined {
  const s = asString(value);
  if (!s) return undefined;
  return Number.isNaN(new Date(s).getTime()) ? undefined : s;
}

/**
 * Coerces an unknown value into a valid {@link AppData} shape. Lenient on
 * missing fields (falls back to empty/defaults) so older or hand-edited
 * backups still import without crashing.
 */
export function normalizeData(raw: unknown): AppData {
  const base = emptyData();
  if (!isRecord(raw)) return base;

  const pets: Pet[] = Array.isArray(raw.pets)
    ? raw.pets.filter(isRecord).map((p) => ({
        id: asString(p.id) ?? makeId(),
        name: asString(p.name) ?? 'Sin nombre',
        species: p.species === 'cat' ? 'cat' : 'dog',
        breed: asString(p.breed),
        birthDate: asDate(p.birthDate),
        sex: p.sex === 'male' || p.sex === 'female' ? p.sex : undefined,
        color: asString(p.color),
        weightKg: asNumber(p.weightKg),
        notes: asString(p.notes),
        photoUri: asString(p.photoUri),
        createdAt: asString(p.createdAt) ?? new Date().toISOString(),
      }))
    : [];

  const feedings: FeedingRecord[] = Array.isArray(raw.feedings)
    ? raw.feedings.filter(isRecord).map((r) => ({
        id: asString(r.id) ?? makeId(),
        petId: asString(r.petId) ?? '',
        dateTime: asString(r.dateTime) ?? '',
        foodType:
          r.foodType === 'wet' || r.foodType === 'homemade' || r.foodType === 'other'
            ? r.foodType
            : 'dry',
        amount: asString(r.amount),
        notes: asString(r.notes),
        reminderAt: asDateTime(r.reminderAt),
      }))
    : [];

  const vaccinations: VaccinationRecord[] = Array.isArray(raw.vaccinations)
    ? raw.vaccinations.filter(isRecord).map((r) => ({
        id: asString(r.id) ?? makeId(),
        petId: asString(r.petId) ?? '',
        vaccineName: asString(r.vaccineName) ?? 'Vacuna',
        date: asDate(r.date) ?? '',
        nextDueDate: asDate(r.nextDueDate),
        vet: asString(r.vet),
        notes: asString(r.notes),
        reminderAt: asDateTime(r.reminderAt),
      }))
    : [];

  const medications: MedicationRecord[] = Array.isArray(raw.medications)
    ? raw.medications.filter(isRecord).map((r) => ({
        id: asString(r.id) ?? makeId(),
        petId: asString(r.petId) ?? '',
        name: asString(r.name) ?? 'Medicamento',
        dateTime: asString(r.dateTime) ?? '',
        dosage: asString(r.dosage),
        frequency: asString(r.frequency),
        notes: asString(r.notes),
        reminderAt: asDateTime(r.reminderAt),
      }))
    : [];

  const visits: VisitRecord[] = Array.isArray(raw.visits)
    ? raw.visits.filter(isRecord).map((r) => ({
        id: asString(r.id) ?? makeId(),
        petId: asString(r.petId) ?? '',
        date: asDate(r.date) ?? '',
        vet: asString(r.vet),
        reason: asString(r.reason),
        weightKg: asNumber(r.weightKg),
        notes: asString(r.notes),
        reminderAt: asDateTime(r.reminderAt),
      }))
    : [];

  return {
    version: typeof raw.version === 'number' ? raw.version : DATA_VERSION,
    pets,
    feedings,
    vaccinations,
    medications,
    visits,
  };
}

const KNOWN_KEYS = ['pets', 'feedings', 'vaccinations', 'medications', 'visits', 'version'];

/** Parses and validates an exported CatAlarm backup, throwing on clearly invalid input. */
export function parseBackupJson(text: string): AppData {
  const raw: unknown = JSON.parse(text);
  if (!isRecord(raw)) {
    throw new Error('El archivo no tiene un formato válido.');
  }
  const looksLikeBackup = KNOWN_KEYS.some(
    (key) => Array.isArray(raw[key]) || (key === 'version' && typeof raw[key] === 'number'),
  );
  if (!looksLikeBackup) {
    throw new Error('El archivo no parece ser una copia de seguridad de CatAlarm.');
  }
  return normalizeData(raw);
}
