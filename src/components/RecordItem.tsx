import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

import { spacing, type CategoryKey } from '@/theme/theme';
import { CategoryAvatar } from './icons';

interface RecordItemProps {
  category: CategoryKey;
  title: string;
  subtitle?: string;
  onDelete?: () => void;
}

export function RecordItem({ category, title, subtitle, onDelete }: RecordItemProps) {

  return (
    <View style={styles.card}>
      <CategoryAvatar category={category} />
      <View style={styles.info}>
        <Text variant="bodyLarge" style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            variant="bodySmall"
            style={styles.subtitle}
            numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {onDelete ? (
        <IconButton
          icon="trash-can-outline"
          size={20}
          iconColor="#A0988E"
          onPress={onDelete}
          accessibilityLabel="Eliminar registro"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAE7E1',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    color: '#2D3748',
    fontSize: 15,
  },
  subtitle: {
    color: '#718096',
    fontSize: 13,
    marginTop: 2,
  },
});
