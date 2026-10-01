import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/ScreenContainer';
import { useData } from '@/data/DataContext';
import { spacing } from '@/theme/theme';

export default function ProfileScreen() {
  const { data } = useData();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <ScreenContainer backgroundColor="#FAF9F6">
      {/* ─── Header Navigation ─── */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          accessibilityLabel="Volver"
          activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Mi Perfil</Text>
      </View>

      {/* ─── Profile Header ─── */}
      <View style={styles.header}>
        {data.caregiver?.photoUri ? (
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: data.caregiver.photoUri }} style={styles.avatarImage} />
          </View>
        ) : (
          <View style={styles.avatarLarge}>
            <MaterialCommunityIcons name="account" size={54} color="#56936E" />
          </View>
        )}
        <Text style={styles.name}>
          {data.caregiver?.name || 'Cuidador'}
        </Text>
        <Text style={styles.email}>
          Dueño de {data.caregiver?.numberOfPets || '0'} peludito{data.caregiver?.numberOfPets === '1' ? '' : 's'} 🐾
        </Text>
      </View>

      {/* ─── Menu Items ─── */}
      <View style={styles.menu}>
        <MenuItem
          icon="account-edit-outline"
          label="Editar perfil"
          onPress={() => router.push('/caregiver')}
        />
        <View style={styles.divider} />
        <MenuItem icon="bell-outline" label="Notificaciones" />
        <View style={styles.divider} />
        <MenuItem icon="shield-check-outline" label="Privacidad" />
        <View style={styles.divider} />
        <MenuItem icon="help-circle-outline" label="Ayuda y soporte" />
        <View style={styles.divider} />
        <MenuItem icon="information-outline" label="Acerca de PetCare" />
      </View>
    </ScreenContainer>
  );
}

function MenuItem({ icon, label, onPress }: { icon: string; label: string; onPress?: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
      onPress={onPress}>
      <View style={styles.menuIconCircle}>
        <MaterialCommunityIcons name={icon as any} size={20} color="#56936E" />
      </View>
      <Text style={styles.menuLabel}>
        {label}
      </Text>
      <MaterialCommunityIcons name="chevron-right" size={22} color="#A0AEC0" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /* ─── Top Nav ─── */
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  navTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  /* ─── Header ─── */
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  avatarWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: '#E7EAE6',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarLarge: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#E8F5EC',
    borderWidth: 2,
    borderColor: '#E7EAE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontWeight: '700',
    fontSize: 22,
    color: '#1F2937',
  },
  email: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  /* ─── Menu ─── */
  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 15,
    gap: spacing.md,
  },
  menuItemPressed: {
    backgroundColor: '#F9FAFB',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 68,
  },
  menuIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8F5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    color: '#1F2937',
    fontWeight: '600',
    fontSize: 15,
  },
});
