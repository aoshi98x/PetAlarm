import type { FoodType, Sex, Species } from '@/data/types';
import type { CategoryKey } from '@/theme/theme';

export const SPECIES_LABEL: Record<Species, string> = {
  dog: 'Perro',
  cat: 'Gato',
};

export const SEX_LABEL: Record<Sex, string> = {
  male: 'Macho',
  female: 'Hembra',
};

export const FOOD_TYPE_LABEL: Record<FoodType, string> = {
  dry: 'Pienso seco',
  wet: 'Comida húmeda',
  homemade: 'Comida casera',
  other: 'Otro',
};

export const CATEGORY_LABEL: Record<CategoryKey, string> = {
  feeding: 'Alimentación',
  vaccination: 'Vacunación',
  medication: 'Medicación',
  visit: 'Visitas',
};
