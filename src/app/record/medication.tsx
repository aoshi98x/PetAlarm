import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { PickerField } from '@/components/PickerField';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useData } from '@/data/DataContext';
import { spacing } from '@/theme/theme';
import { combineDateTimeIso } from '@/utils/dates';
import { scheduleReminder } from '@/utils/notifications';

export default function MedicationRecordScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { data, addMedication } = useData();
  const pet = data.pets.find((p) => p.id === petId);

  const [name, setName] = useState('');
  const [date, setDate] = useState<Date | null>(() => new Date());
  const [time, setTime] = useState<Date | null>(() => new Date());
  const [reminderDate, setReminderDate] = useState<Date | null>(
    () => new Date(Date.now() + 60 * 60 * 1000),
  );
  const [reminderTime, setReminderTime] = useState<Date | null>(
    () => new Date(Date.now() + 60 * 60 * 1000),
  );
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Escribe el nombre del medicamento.');
      return;
    }

    const reminderAt =
      reminderDate && reminderTime ? combineDateTimeIso(reminderDate, reminderTime) : undefined;

    const input = {
      petId: petId ?? '',
      name: trimmed,
      dateTime: combineDateTimeIso(date ?? new Date(), time ?? new Date()),
      dosage: dosage.trim() || undefined,
      frequency: frequency.trim() || undefined,
      notes: notes.trim() || undefined,
      reminderAt,
    };

    addMedication(input);
    if (reminderAt) {
      await scheduleReminder({
        id: `medication-${petId ?? 'pet'}`,
        title: `Medicamento: ${trimmed}`,
        body: `${pet?.name ? `Para ${pet.name}` : 'Recuerda administrar'}${dosage ? ` · ${dosage}` : ''}`,
        dateTime: reminderAt,
      });
    }
    router.back();
  }

  return (
    <ScreenContainer backgroundColor="#FDFBF7">
      <AppHeader title="Registrar medicamento" subtitle={pet?.name} back />
      <View style={styles.form}>
        <TextInput
          mode="outlined"
          label="Medicamento *"
          value={name}
          onChangeText={setName}
          placeholder="Ej. Amoxicilina"
          outlineColor="#EAE7E1"
          activeOutlineColor="#5B9B75"
          style={styles.input}
        />
        <PickerField label="Fecha" mode="date" value={date} onChange={setDate} />
        <PickerField label="Hora" mode="time" value={time} onChange={setTime} />
        <PickerField label="Recordatorio" mode="date" value={reminderDate} onChange={setReminderDate} />
        <PickerField
          label="Hora del recordatorio"
          mode="time"
          value={reminderTime}
          onChange={setReminderTime}
        />
        <TextInput
          mode="outlined"
          label="Dosis"
          value={dosage}
          onChangeText={setDosage}
          placeholder="Ej. 5 ml, 1 comprimido"
          outlineColor="#EAE7E1"
          activeOutlineColor="#5B9B75"
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Frecuencia"
          value={frequency}
          onChangeText={setFrequency}
          placeholder="Ej. Cada 12 horas"
          outlineColor="#EAE7E1"
          activeOutlineColor="#5B9B75"
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Notas"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
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
          Guardar
        </Button>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  submit: {
    marginTop: spacing.sm,
    borderRadius: 14,
    paddingVertical: 4,
  },
});
