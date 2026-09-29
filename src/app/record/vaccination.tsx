import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { PickerField } from '@/components/PickerField';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useData } from '@/data/DataContext';
import { spacing } from '@/theme/theme';
import { combineDateTimeIso, toDateIso } from '@/utils/dates';
import { scheduleReminder } from '@/utils/notifications';

export default function VaccinationRecordScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { data, addVaccination } = useData();
  const pet = data.pets.find((p) => p.id === petId);

  const [vaccineName, setVaccineName] = useState('');
  const [date, setDate] = useState<Date | null>(() => new Date());
  const [nextDueDate, setNextDueDate] = useState<Date | null>(null);
  const [reminderDate, setReminderDate] = useState<Date | null>(
    () => new Date(Date.now() + 60 * 60 * 1000),
  );
  const [reminderTime, setReminderTime] = useState<Date | null>(
    () => new Date(Date.now() + 60 * 60 * 1000),
  );
  const [vet, setVet] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const name = vaccineName.trim();
    if (!name) {
      setError('Escribe el nombre de la vacuna.');
      return;
    }

    const reminderAt =
      reminderDate && reminderTime ? combineDateTimeIso(reminderDate, reminderTime) : undefined;

    const input = {
      petId: petId ?? '',
      vaccineName: name,
      date: toDateIso(date ?? new Date()),
      nextDueDate: nextDueDate ? toDateIso(nextDueDate) : undefined,
      vet: vet.trim() || undefined,
      notes: notes.trim() || undefined,
      reminderAt,
    };

    addVaccination(input);
    if (reminderAt) {
      await scheduleReminder({
        id: `vaccination-${petId ?? 'pet'}`,
        title: `Vacuna: ${name}`,
        body: `${pet?.name ? `Para ${pet.name}` : 'No olvides la vacuna'}`,
        dateTime: reminderAt,
      });
    }
    router.back();
  }

  return (
    <ScreenContainer backgroundColor="#FDFBF7">
      <AppHeader title="Registrar vacuna" subtitle={pet?.name} back />
      <View style={styles.form}>
        <TextInput
          mode="outlined"
          label="Nombre de la vacuna *"
          value={vaccineName}
          onChangeText={setVaccineName}
          placeholder="Ej. Rabia, Triple felina"
          outlineColor="#EAE7E1"
          activeOutlineColor="#5B9B75"
          style={styles.input}
        />
        <PickerField label="Fecha de aplicación" mode="date" value={date} onChange={setDate} />
        <PickerField
          label="Próxima dosis (opcional)"
          mode="date"
          value={nextDueDate}
          onChange={setNextDueDate}
        />
        <PickerField label="Recordatorio" mode="date" value={reminderDate} onChange={setReminderDate} />
        <PickerField
          label="Hora del recordatorio"
          mode="time"
          value={reminderTime}
          onChange={setReminderTime}
        />
        <TextInput
          mode="outlined"
          label="Veterinario"
          value={vet}
          onChangeText={setVet}
          placeholder="Ej. Dra. Gómez"
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
