import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, TextInput } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { PickerField } from '@/components/PickerField';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useData } from '@/data/DataContext';
import type { FoodType } from '@/data/types';
import { spacing } from '@/theme/theme';
import { combineDateTimeIso } from '@/utils/dates';
import { FOOD_TYPE_LABEL } from '@/utils/labels';
import { scheduleReminder } from '@/utils/notifications';

export default function FeedingRecordScreen() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const { data, addFeeding } = useData();
  const pet = data.pets.find((p) => p.id === petId);

  const [foodType, setFoodType] = useState<FoodType>('dry');
  const [date, setDate] = useState<Date | null>(() => new Date());
  const [time, setTime] = useState<Date | null>(() => new Date());
  const [reminderDate, setReminderDate] = useState<Date | null>(
    () => new Date(Date.now() + 60 * 60 * 1000),
  );
  const [reminderTime, setReminderTime] = useState<Date | null>(
    () => new Date(Date.now() + 60 * 60 * 1000),
  );
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  async function handleSubmit() {
    if (!petId) return;

    const reminderAt =
      reminderDate && reminderTime ? combineDateTimeIso(reminderDate, reminderTime) : undefined;

    const input = {
      petId,
      dateTime: combineDateTimeIso(date ?? new Date(), time ?? new Date()),
      foodType,
      amount: amount.trim() || undefined,
      notes: notes.trim() || undefined,
      reminderAt,
    };

    addFeeding(input);
    if (reminderAt) {
      await scheduleReminder({
        id: `feeding-${petId}`,
        title: `Hora de comida${pet?.name ? ` para ${pet.name}` : ''}`,
        body: `${FOOD_TYPE_LABEL[foodType] ?? 'Comida'}${amount ? ` · ${amount}` : ''}`,
        dateTime: reminderAt,
      });
    }
    router.back();
  }

  return (
    <ScreenContainer backgroundColor="#FDFBF7">
      <AppHeader title="Registrar comida" subtitle={pet?.name} back />
      <View style={styles.form}>
        <SegmentedButtons
          value={foodType}
          onValueChange={(v) => setFoodType(v as FoodType)}
          buttons={[
            { value: 'dry', label: 'Seco' },
            { value: 'wet', label: 'Húmeda' },
            { value: 'homemade', label: 'Casera' },
            { value: 'other', label: 'Otra' },
          ]}
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
          label="Cantidad"
          value={amount}
          onChangeText={setAmount}
          placeholder="Ej. 50 g, 1 lata"
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
          placeholder="Ej. Comió con apetito"
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
