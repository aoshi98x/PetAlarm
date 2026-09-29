import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import type { Pet } from '@/data/types';
import { spacing } from '@/theme/theme';
import { ageLabel } from '@/utils/dates';
import { SpeciesAvatar } from './icons';

export function PetCard({ pet }: { pet: Pet }) {
  const theme = useTheme();
  const age = ageLabel(pet.birthDate);

  return (
    <Card
      mode="elevated"
      onPress={() => router.push({ pathname: '/pet/[id]', params: { id: pet.id } })}
      style={styles.card}>
      <View style={styles.accentBorder} />
      <Card.Content style={styles.content}>
        {pet.photoUri ? (
          <Image source={{ uri: pet.photoUri }} style={styles.photo} />
        ) : (
          <SpeciesAvatar species={pet.species} size={72} />
        )}
        <View style={styles.info}>
          <Text variant="titleMedium" style={styles.name}>
            {pet.name}
          </Text>
          {pet.breed ? (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
              numberOfLines={1}>
              {pet.breed}
            </Text>
          ) : null}
          {age ? (
            <View style={styles.ageBadge}>
              <Text style={styles.ageBadgeText}>{age}</Text>
            </View>
          ) : null}
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={theme.colors.onSurfaceVariant}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderColor: '#EAE7E1',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  accentBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#5B9B75',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
  },
  photo: {
    width: 68,
    height: 68,
    borderRadius: 18,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontWeight: '700',
    fontSize: 18,
    color: '#2D3748',
  },
  ageBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F3ED',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 3,
  },
  ageBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B9B75',
  },
});
