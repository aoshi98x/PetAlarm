import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  Button,
  Chip,
  HelperText,
  IconButton,
  SegmentedButtons,
  Text,
  TextInput,
} from 'react-native-paper';

import type { Pet, PetInput, Sex, Species } from '@/data/types';
import { spacing } from '@/theme/theme';
import { toDateIso } from '@/utils/dates';
import { PickerField } from './PickerField';

interface PetFormProps {
  initial?: Pet;
  onSubmit: (input: PetInput) => void;
  submitLabel?: string;
}

export function PetForm({ initial, onSubmit, submitLabel = 'Guardar' }: PetFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [species, setSpecies] = useState<Species>(initial?.species ?? 'dog');
  const [breed, setBreed] = useState(initial?.breed ?? '');
  const [sex, setSex] = useState<Sex | undefined>(initial?.sex);
  const [birthDate, setBirthDate] = useState<Date | null>(
    initial?.birthDate ? new Date(initial.birthDate) : null,
  );
  const [color, setColor] = useState(initial?.color ?? '');
  const [weight, setWeight] = useState(
    initial?.weightKg != null ? String(initial.weightKg) : '',
  );
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [photoUri, setPhotoUri] = useState(initial?.photoUri ?? '');
  const [error, setError] = useState<string | null>(null);

  async function handlePickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Necesitas permitir acceso a tus fotos para añadir una imagen.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
      setError(null);
    }
  }

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Escribe el nombre de tu mascota.');
      return;
    }

    const rawWeight = weight.trim().replace(',', '.');
    const weightNum = rawWeight ? Number(rawWeight) : undefined;

    const nextPhotoUri = photoUri && photoUri.trim() ? photoUri.trim() : undefined;

    onSubmit({
      name: trimmed,
      species,
      breed: breed.trim() || undefined,
      sex,
      birthDate: birthDate ? toDateIso(birthDate) : undefined,
      color: color.trim() || undefined,
      weightKg: weightNum != null && Number.isFinite(weightNum) ? weightNum : undefined,
      notes: notes.trim() || undefined,
      photoUri: nextPhotoUri,
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        mode="outlined"
        label="Nombre *"
        value={name}
        onChangeText={setName}
        placeholder="Ej. Luna"
        outlineColor="#EAE7E1"
        activeOutlineColor="#5B9B75"
        style={styles.input}
      />

      <View style={styles.fieldGroup}>
        <Text variant="labelLarge" style={styles.fieldLabel}>Especie</Text>
        <SegmentedButtons
          value={species}
          onValueChange={(v) => setSpecies(v as Species)}
          buttons={[
            { value: 'dog', label: 'Perro', icon: 'dog' },
            { value: 'cat', label: 'Gato', icon: 'cat' },
          ]}
        />
      </View>

      <TextInput
        mode="outlined"
        label="Raza"
        value={breed}
        onChangeText={setBreed}
        placeholder="Ej. Criollo, Siamés"
        outlineColor="#EAE7E1"
        activeOutlineColor="#5B9B75"
        style={styles.input}
      />

      <View style={styles.fieldGroup}>
        <Text variant="labelLarge" style={styles.fieldLabel}>Sexo</Text>
        <View style={styles.chipRow}>
          <Chip
            icon="gender-male"
            selected={sex === 'male'}
            selectedColor="#5B9B75"
            onPress={() => setSex(sex === 'male' ? undefined : 'male')}>
            Macho
          </Chip>
          <Chip
            icon="gender-female"
            selected={sex === 'female'}
            selectedColor="#5B9B75"
            onPress={() => setSex(sex === 'female' ? undefined : 'female')}>
            Hembra
          </Chip>
        </View>
      </View>

      <PickerField
        label="Fecha de nacimiento"
        mode="date"
        value={birthDate}
        onChange={setBirthDate}
      />

      <TextInput
        mode="outlined"
        label="Color"
        value={color}
        onChangeText={setColor}
        placeholder="Ej. Gris atigrado"
        outlineColor="#EAE7E1"
        activeOutlineColor="#5B9B75"
        style={styles.input}
      />

      <TextInput
        mode="outlined"
        label="Peso (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        placeholder="Ej. 4.5"
        outlineColor="#EAE7E1"
        activeOutlineColor="#5B9B75"
        style={styles.input}
      />

      <View style={styles.photoSection}>
        <Text variant="labelLarge" style={styles.fieldLabel}>Foto</Text>
        <View style={styles.photoRow}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          ) : (
            <View style={styles.photoPlaceholder} />
          )}
          <IconButton icon="image-plus" mode="contained-tonal" iconColor="#5B9B75" onPress={handlePickPhoto} />
          {photoUri ? (
            <IconButton
              icon="delete-outline"
              iconColor="#C53030"
              onPress={() => {
                setPhotoUri('');
                setError(null);
              }}
            />
          ) : null}
        </View>
      </View>

      <TextInput
        mode="outlined"
        label="Notas"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        placeholder="Alergias, cuidados especiales…"
        outlineColor="#EAE7E1"
        activeOutlineColor="#5B9B75"
        style={styles.input}
      />

      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button
        mode="contained"
        icon="check"
        buttonColor="#5B9B75"
        textColor="#FFFFFF"
        onPress={handleSubmit}
        style={styles.submit}>
        {submitLabel}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    color: '#2D3748',
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  photoSection: {
    gap: spacing.xs,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  photoPreview: {
    width: 72,
    height: 72,
    borderRadius: 18,
  },
  photoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#F5F2EB',
    borderColor: '#EAE7E1',
    borderWidth: 1,
  },
  submit: {
    marginTop: spacing.sm,
    borderRadius: 14,
    paddingVertical: 4,
  },
});
