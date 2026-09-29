import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Species } from '@/data/types';
import { categoryColor, palette, type CategoryKey } from '@/theme/theme';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const speciesIcon: Record<Species, IconName> = {
  dog: 'dog',
  cat: 'cat',
};

export const categoryIcon: Record<CategoryKey, IconName> = {
  feeding: 'bowl-mix',
  vaccination: 'needle',
  medication: 'pill',
  visit: 'stethoscope',
};

interface AvatarProps {
  size?: number;
}

export function SpeciesAvatar({ species, size = 44 }: { species: Species } & AvatarProps) {
  const main = species === 'dog' ? palette.dog : palette.cat;
  const container = species === 'dog' ? palette.dogContainer : palette.catContainer;
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: container },
      ]}>
      <MaterialCommunityIcons name={speciesIcon[species]} size={size * 0.55} color={main} />
    </View>
  );
}

export function CategoryAvatar({ category, size = 40 }: { category: CategoryKey } & AvatarProps) {
  const c = categoryColor[category];
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: c.container },
      ]}>
      <MaterialCommunityIcons name={categoryIcon[category]} size={size * 0.55} color={c.main} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
