import { MD3LightTheme, MD3DarkTheme, type MD3Theme } from 'react-native-paper';

/**
 * Pastel, warm, pet-friendly palette used across the app.
 * Each record category and species gets its own accent so the UI feels
 * colorful without losing cohesion.
 */
export const palette = {
  // Brand
  primary: '#56936E',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E8F5EC',
  onPrimaryContainer: '#1C3E28',

  secondary: '#7FAECB',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#D8EAF6',
  onSecondaryContainer: '#1D3443',

  tertiary: '#8FBF9F',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#D9F0E1',
  onTertiaryContainer: '#1C3A29',

  // Surfaces
  background: '#FAF9F6',
  onBackground: '#1F2937',
  surface: '#FFFFFF',
  onSurface: '#1F2937',
  surfaceVariant: '#F3F4F6',
  onSurfaceVariant: '#6B7280',
  surfaceContainer: '#FFFFFF',

  outline: '#E5E7EB',
  outlineVariant: '#EFEFEF',

  error: '#EF4444',
  onError: '#FFFFFF',
  errorContainer: '#FEE2E2',
  onErrorContainer: '#991B1B',

  // Record categories
  feeding: '#6FAE8F',
  feedingContainer: '#D8F0E2',
  onFeedingContainer: '#1C3B2A',
  vaccination: '#5F9BC9',
  vaccinationContainer: '#D6E9F7',
  onVaccinationContainer: '#1B3548',
  medication: '#DD7C9C',
  medicationContainer: '#FADCE4',
  onMedicationContainer: '#4A1E2E',
  visit: '#DE9A5C',
  visitContainer: '#FAE3CD',
  onVisitContainer: '#4A2E14',

  // Species
  dog: '#C9956B',
  dogContainer: '#F4E3D3',
  cat: '#939FC0',
  catContainer: '#E2E6F1',
} as const;

export type CategoryKey = 'feeding' | 'vaccination' | 'medication' | 'visit';

export const categoryColor = {
  feeding: { main: palette.feeding, container: palette.feedingContainer, onContainer: palette.onFeedingContainer },
  vaccination: { main: palette.vaccination, container: palette.vaccinationContainer, onContainer: palette.onVaccinationContainer },
  medication: { main: palette.medication, container: palette.medicationContainer, onContainer: palette.onMedicationContainer },
  visit: { main: palette.visit, container: palette.visitContainer, onContainer: palette.onVisitContainer },
} as const;

export const paperLightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 6,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    onPrimary: palette.onPrimary,
    primaryContainer: palette.primaryContainer,
    onPrimaryContainer: palette.onPrimaryContainer,
    secondary: palette.secondary,
    onSecondary: palette.onSecondary,
    secondaryContainer: palette.secondaryContainer,
    onSecondaryContainer: palette.onSecondaryContainer,
    tertiary: palette.tertiary,
    onTertiary: palette.onTertiary,
    tertiaryContainer: palette.tertiaryContainer,
    onTertiaryContainer: palette.onTertiaryContainer,
    background: palette.background,
    onBackground: palette.onBackground,
    surface: palette.surface,
    onSurface: palette.onSurface,
    surfaceVariant: palette.surfaceVariant,
    onSurfaceVariant: palette.onSurfaceVariant,
    outline: palette.outline,
    outlineVariant: palette.outlineVariant,
    error: palette.error,
    onError: palette.onError,
    errorContainer: palette.errorContainer,
    onErrorContainer: palette.onErrorContainer,
  },
};

export const paperDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 6,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#F09BB6',
    onPrimary: '#4A1E2C',
    primaryContainer: '#5C2736',
    onPrimaryContainer: '#FFD9E2',
    secondary: '#9CC3DB',
    onSecondary: '#1D3443',
    secondaryContainer: '#2A4558',
    onSecondaryContainer: '#D8EAF6',
    tertiary: '#A9D0B6',
    onTertiary: '#1C3A29',
    tertiaryContainer: '#2A4A36',
    onTertiaryContainer: '#D9F0E1',
    background: '#1C1719',
    onBackground: '#EAE0E3',
    surface: '#241E21',
    onSurface: '#EAE0E3',
    surfaceVariant: '#3A3134',
    onSurfaceVariant: '#C9BDBF',
    outline: '#8F8184',
    outlineVariant: '#3A3134',
    error: '#F2B8B8',
    onError: '#4A1A1A',
    errorContainer: '#5C2626',
    onErrorContainer: '#FFDAD6',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const shadows = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    shadowColor: '#56936E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const maxContentWidth = 720;
