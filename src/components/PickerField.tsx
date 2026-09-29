import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';

import { radius, spacing } from '@/theme/theme';
import { formatDateObj, formatTimeObj } from '@/utils/dates';

interface PickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  mode: 'date' | 'time';
  placeholder?: string;
}

export function PickerField({ label, value, onChange, mode, placeholder }: PickerFieldProps) {
  const [show, setShow] = useState(false);
  const theme = useTheme();

  const display = value ? (mode === 'time' ? formatTimeObj(value) : formatDateObj(value)) : '';

  function handleChange(event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'set' && selected) {
      onChange(selected);
    }
  }

  return (
    <View>
      <Pressable onPress={() => setShow((s) => !s)}>
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            label={label}
            value={display}
            placeholder={placeholder}
            editable={false}
            right={<TextInput.Icon icon={mode === 'time' ? 'clock-outline' : 'calendar'} />}
          />
        </View>
      </Pressable>

      {show && (
        <View
          style={[
            styles.pickerWrap,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
          ]}>
          <DateTimePicker
            value={value ?? new Date()}
            mode={mode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
          />
          {Platform.OS === 'ios' && (
            <Button mode="text" onPress={() => setShow(false)}>
              Listo
            </Button>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pickerWrap: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.sm,
  },
});
