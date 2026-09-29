import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing } from '@/theme/theme';

export default function ProfileScreen() {

  return (
    <ScreenContainer backgroundColor="#FDFBF7">
      {/* ─── Header ─── */}
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <MaterialCommunityIcons name="account" size={48} color="#5B9B75" />
        </View>
        <Text variant="headlineSmall" style={styles.name}>
          María
        </Text>
        <Text variant="bodyMedium" style={styles.email}>
          Dueña de mascotas 🐾
        </Text>
      </View>

      {/* ─── Menu Items ─── */}
      <View style={styles.menu}>
        <MenuItem icon="account-edit-outline" label="Editar perfil" />
        <MenuItem icon="bell-outline" label="Notificaciones" />
        <MenuItem icon="shield-check-outline" label="Privacidad" />
        <MenuItem icon="help-circle-outline" label="Ayuda y soporte" />
        <MenuItem icon="information-outline" label="Acerca de PetCare" />
      </View>

      {/* ─── Back link ─── */}
      <View style={styles.backWrapper}>
        <Text
          style={styles.backLink}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)');
            }
          }}>
          ← Volver al inicio
        </Text>
      </View>
    </ScreenContainer>
  );
}

function MenuItem({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.menuItem}>
      <View style={styles.menuIconCircle}>
        <MaterialCommunityIcons name={icon as any} size={20} color="#5B9B75" />
      </View>
      <Text variant="bodyLarge" style={styles.menuLabel}>
        {label}
      </Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#C0BDB8" />
    </View>
  );
}

const styles = StyleSheet.create({
  /* ─── Header ─── */
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.xs,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontWeight: '700',
    color: '#202325',
  },
  email: {
    color: '#8E959E',
  },
  /* ─── Menu ─── */
  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: spacing.xs,
    marginTop: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    gap: spacing.md,
  },
  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3FAF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    color: '#3A3D40',
    fontWeight: '500',
  },
  /* ─── Back ─── */
  backWrapper: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  backLink: {
    color: '#5B9B75',
    fontWeight: '600',
    fontSize: 14,
  },
});
