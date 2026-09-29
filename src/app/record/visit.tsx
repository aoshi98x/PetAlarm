import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { PickerField } from '@/components/PickerField';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useData } from '@/data/DataContext';
import { spacing } from '@/theme/theme';
import { combineDateTimeIso, toDateIso } from '@/utils/dates';
import { scheduleReminder } from '@/utils/notifications';

export default function VisitRecordScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { data, addVisit } = useData();
  const pet = data.pets.find((p) => p.id === petId);

  const [date, setDate] = useState<Date | null>(() => new Date());
  const [vet, setVet] = useState('');
  const [reminderDate, setReminderDate] = useState<Date | null>(
    () => new Date(Date.now() + 60 * 60 * 1000),
  );
  const [reminderTime, setReminderTime] = useState<Date | null>(
    () => new Date(Date.now() + 60 * 60 * 1000),
  );
  const [reason, setReason] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSubmit() {
    const rawWeight = weight.trim().replace(',', '.');
    const weightNum = rawWeight ? Number(rawWeight) : undefined;

    const reminderAt =
      reminderDate && reminderTime ? combineDateTimeIso(reminderDate, reminderTime) : undefined;

    const input = {
      petId: petId ?? '',
      date: toDateIso(date ?? new Date()),
      vet: vet.trim() || undefined,
      reason: reason.trim() || undefined,
      weightKg: weightNum != null && Number.isFinite(weightNum) ? weightNum : undefined,
      notes: notes.trim() || undefined,
      reminderAt,
    };

    addVisit(input);
    if (reminderAt) {
      await scheduleReminder({
        id: `visit-${petId ?? 'pet'}`,
        title: `Cita veterinaria${pet?.name ? ` · ${pet.name}` : ''}`,
        body: reason || 'Revisa la cita programada',
        dateTime: reminderAt,
      });
    }
    router.back();
  }

  return (
    <ScreenContainer backgroundColor="#FDFBF7">
      <AppHeader title="Registrar visita" subtitle={pet?.name} back />
      <View style={styles.form}>
        <PickerField label="Fecha" mode="date" value={date} onChange={setDate} />
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
          label="Motivo"
          value={reason}
          onChangeText={setReason}
          placeholder="Ej. Revisión anual"
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
