import { TextInput } from 'react-native-paper';

import { formatDateObj, formatTimeObj } from '@/utils/dates';

interface PickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  mode: 'date' | 'time';
  placeholder?: string;
}

function parseInput(text: string, mode: 'date' | 'time'): Date | null {
  if (mode === 'date') {
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  } else {
    const match = text.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      const [, hours, minutes] = match;
      const now = new Date();
      now.setHours(Number(hours), Number(minutes), 0, 0);
      return now;
    }
  }
  return null;
}

/** Web fallback: native date picker is unavailable, so use a simple text field. */
export function PickerField({ label, value, onChange, mode, placeholder }: PickerFieldProps) {
  const text = value ? (mode === 'time' ? formatTimeObj(value) : formatDateObj(value)) : '';

  return (
    <TextInput
      mode="outlined"
      label={label}
      value={text}
      onChangeText={(input) => {
        const parsed = parseInput(input.trim(), mode);
        if (parsed) onChange(parsed);
      }}
      placeholder={placeholder ?? (mode === 'time' ? 'HH:mm' : 'AAAA-MM-DD')}
      right={<TextInput.Icon icon={mode === 'time' ? 'clock-outline' : 'calendar'} />}
    />
  );
}
