import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { FAB, IconButton, SegmentedButtons, Text } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { RecordItem } from '@/components/RecordItem';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SpeciesAvatar, categoryIcon } from '@/components/icons';
import { useData } from '@/data/DataContext';
import { spacing, type CategoryKey } from '@/theme/theme';
import { ageLabel, formatDate, formatDateTime } from '@/utils/dates';
import { FOOD_TYPE_LABEL, SEX_LABEL } from '@/utils/labels';

const CATEGORIES: CategoryKey[] = ['feeding', 'vaccination', 'medication', 'visit'];

const SHORT_LABEL: Record<CategoryKey, string> = {
  feeding: 'Comida',
  vaccination: 'Vacunas',
  medication: 'Medicina',
  visit: 'Visitas',
};

const FULL_LABEL: Record<CategoryKey, string> = {
  feeding: 'alimentación',
  vaccination: 'vacunación',
  medication: 'medicación',
  visit: 'visitas',
};

function join(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(' · ');
}

type RecordEntry = { id: string; title: string; subtitle?: string };

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, removePet, removeFeeding, removeVaccination, removeMedication, removeVisit, updatePet } =
    useData();

  const [category, setCategory] = useState<CategoryKey>('feeding');
  const [confirmDeletePet, setConfirmDeletePet] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ kind: CategoryKey; id: string } | null>(null);
  const [photoMissing, setPhotoMissing] = useState(false);

  const pet = data.pets.find((p) => p.id === id);

  if (!pet) {
    return (
      <ScreenContainer>
        <AppHeader title="Mascota" back />
        <EmptyState
          icon="paw"
          title="No se encontró esta mascota"
          subtitle="Es posible que haya sido eliminada."
        />
      </ScreenContainer>
    );
  }

  const petId = pet.id;

  function getEntries(kind: CategoryKey): RecordEntry[] {
    switch (kind) {
      case 'feeding':
        return data.feedings
          .filter((r) => r.petId === petId)
          .sort((a, b) => b.dateTime.localeCompare(a.dateTime))
          .map((r) => ({
            id: r.id,
            title: FOOD_TYPE_LABEL[r.foodType],
            subtitle: join(formatDateTime(r.dateTime), r.amount, r.notes) || undefined,
          }));
      case 'vaccination':
        return data.vaccinations
          .filter((r) => r.petId === petId)
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((r) => ({
            id: r.id,
            title: r.vaccineName,
            subtitle:
              join(
                formatDate(r.date),
                r.vet ? `Vet: ${r.vet}` : undefined,
                r.nextDueDate ? `Próxima: ${formatDate(r.nextDueDate)}` : undefined,
                r.notes,
              ) || undefined,
          }));
      case 'medication':
        return data.medications
          .filter((r) => r.petId === petId)
          .sort((a, b) => b.dateTime.localeCompare(a.dateTime))
          .map((r) => ({
            id: r.id,
            title: r.name,
            subtitle: join(formatDateTime(r.dateTime), r.dosage, r.frequency, r.notes) || undefined,
          }));
      case 'visit':
        return data.visits
          .filter((r) => r.petId === petId)
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((r) => ({
            id: r.id,
            title: r.reason || 'Visita al veterinario',
            subtitle:
              join(
                formatDate(r.date),
                r.vet ? `Vet: ${r.vet}` : undefined,
                r.weightKg != null ? `${r.weightKg} kg` : undefined,
                r.notes,
              ) || undefined,
          }));
    }
  }

  function goAdd() {
    const params = { petId };
    switch (category) {
      case 'feeding':
        router.push({ pathname: '/record/feeding', params });
        break;
      case 'vaccination':
        router.push({ pathname: '/record/vaccination', params });
        break;
      case 'medication':
        router.push({ pathname: '/record/medication', params });
        break;
      case 'visit':
        router.push({ pathname: '/record/visit', params });
        break;
    }
  }

  function confirmRecordDelete() {
    if (!deleteTarget) return;
    const { kind, id: recordId } = deleteTarget;
    if (kind === 'feeding') removeFeeding(recordId);
    else if (kind === 'vaccination') removeVaccination(recordId);
    else if (kind === 'medication') removeMedication(recordId);
    else removeVisit(recordId);
    setDeleteTarget(null);
  }

  const entries = getEntries(category);
  const safePhotoUri = pet.photoUri && !photoMissing ? pet.photoUri : undefined;

  return (
    <View style={styles.root}>
      <ScreenContainer backgroundColor="#FDFBF7">
        <AppHeader
          title={pet.name}
          subtitle={FULL_LABEL[category]}
          back
          actions={
            <>
              <IconButton
                icon="pencil-outline"
                iconColor="#5B9B75"
                onPress={() => router.push({ pathname: '/pet/[id]/edit', params: { id: pet.id } })}
                accessibilityLabel="Editar"
              />
              <IconButton
                icon="trash-can-outline"
                iconColor="#C53030"
                onPress={() => setConfirmDeletePet(true)}
                accessibilityLabel="Eliminar"
              />
            </>
          }
        />

        <View style={styles.summary}>
          {safePhotoUri ? (
            <Image
              source={{ uri: safePhotoUri }}
              style={styles.petPhoto}
              onError={() => {
                setPhotoMissing(true);
                updatePet(pet.id, { photoUri: undefined });
              }}
            />
          ) : (
            <SpeciesAvatar species={pet.species} size={64} />
          )}
          <View style={styles.summaryInfo}>
            <Text variant="titleMedium" style={styles.petName}>
              {pet.name}
            </Text>
            <View style={styles.chips}>
              {pet.breed ? (
                <View style={styles.chipPill}>
                  <Text style={styles.chipText}>{pet.breed}</Text>
                </View>
              ) : null}
              {pet.sex ? (
                <View style={styles.chipPill}>
                  <Text style={styles.chipText}>{SEX_LABEL[pet.sex]}</Text>
                </View>
              ) : null}
              {ageLabel(pet.birthDate) ? (
                <View style={styles.chipPillHighlight}>
                  <Text style={styles.chipTextHighlight}>{ageLabel(pet.birthDate)}</Text>
                </View>
              ) : null}
              {pet.weightKg != null ? (
                <View style={styles.chipPill}>
                  <Text style={styles.chipText}>{pet.weightKg} kg</Text>
                </View>
              ) : null}
              {pet.color ? (
                <View style={styles.chipPill}>
                  <Text style={styles.chipText}>{pet.color}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <SegmentedButtons
          style={styles.segmented}
          value={category}
          onValueChange={(v) => setCategory(v as CategoryKey)}
          buttons={CATEGORIES.map((c) => ({ value: c, label: SHORT_LABEL[c] }))}
        />

        {entries.length === 0 ? (
          <EmptyState
            icon={categoryIcon[category]}
            title={`Sin registros de ${FULL_LABEL[category]}`}
            subtitle="Pulsa el botón para añadir el primero."
          />
        ) : (
          <View style={styles.list}>
            {entries.map((entry) => (
              <RecordItem
                key={entry.id}
                category={category}
                title={entry.title}
                subtitle={entry.subtitle}
                onDelete={() => setDeleteTarget({ kind: category, id: entry.id })}
              />
            ))}
          </View>
        )}
      </ScreenContainer>

      <FAB
        icon="plus"
        label="Añadir"
        onPress={goAdd}
        style={styles.fab}
        color="#FFFFFF"
      />

      <ConfirmDialog
        visible={confirmDeletePet}
        title={`¿Eliminar a ${pet.name}?`}
        message="Se eliminará la mascota y todos sus registros. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        destructive
        onConfirm={() => {
          removePet(pet.id);
          setConfirmDeletePet(false);
          router.replace('/');
        }}
        onDismiss={() => setConfirmDeletePet(false)}
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        title="¿Eliminar este registro?"
        message="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        destructive
        onConfirm={confirmRecordDelete}
        onDismiss={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  petPhoto: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAE7E1',
    backgroundColor: '#FFFFFF',
    padding: spacing.lg,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  summaryInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  petName: {
    fontWeight: '700',
    fontSize: 20,
    color: '#2D3748',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: 2,
  },
  chipPill: {
    backgroundColor: '#F5F2EB',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },
  chipPillHighlight: {
    backgroundColor: '#E8F3ED',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipTextHighlight: {
    fontSize: 12,
    color: '#5B9B75',
    fontWeight: '600',
  },
  segmented: {
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    borderRadius: 28,
    backgroundColor: '#5B9B75',
  },
});
