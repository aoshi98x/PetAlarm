import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, Text, TextInput, useTheme } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { PetCard } from '@/components/PetCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useData } from '@/data/DataContext';
import { radius, spacing } from '@/theme/theme';

export default function PetsScreen() {
  const { data, ready } = useData();
  const theme = useTheme();
  const pets = data.pets;

  return (
    <View style={styles.root}>
      <ScreenContainer backgroundColor="#FDFBF7">
        {/* ─── Greeting Header ─── */}
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text variant="bodySmall" style={styles.greeting}>
              ¡Bienvenido de vuelta!
            </Text>
            <Text variant="headlineSmall" style={styles.headerName}>
              Hola, María 👋
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/profile')}
            style={styles.avatarBtn}
            accessibilityLabel="Ir al perfil">
            <MaterialCommunityIcons name="account" size={24} color="#5B9B75" />
          </Pressable>
        </View>

        {/* ─── Search Bar ─── */}
        <View style={styles.searchWrapper}>
          <MaterialCommunityIcons
            name="magnify"
            size={22}
            color={theme.colors.onSurfaceVariant}
            style={styles.searchIcon}
          />
          <TextInput
            mode="flat"
            placeholder="Buscar mascotas, vacunas, clínicas..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            style={styles.searchInput}
            contentStyle={styles.searchContent}
            editable={false}
          />
        </View>

        {/* ─── Section Header ─── */}
        <View style={styles.sectionRow}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Mis Mascotas
          </Text>
          {pets.length > 0 && (
            <Text style={styles.sectionLink}>
              Ver todas ({pets.length})
            </Text>
          )}
        </View>

        {/* ─── Content ─── */}
        {!ready ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        ) : pets.length === 0 ? (
          <EmptyState
            icon="paw"
            title="Aún no hay mascotas"
            subtitle="Añade tu primer perro o gato para registrar su alimentación, vacunas, medicación y visitas al veterinario."
          />
        ) : (
          <View style={styles.list}>
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </View>
        )}
      </ScreenContainer>

      <FAB
        icon="plus"
        onPress={() => router.push('/pet/new')}
        style={[styles.fab, { backgroundColor: '#5B9B75' }]}
        color="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  /* ─── Header ─── */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    color: '#8E959E',
    fontSize: 13,
    marginBottom: 2,
  },
  headerName: {
    fontWeight: '700',
    fontSize: 22,
    color: '#202325',
  },
  avatarBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  /* ─── Search ─── */
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#E8E3DD',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: spacing.xs,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 14,
    height: 48,
  },
  searchContent: {
    paddingLeft: 0,
  },
  /* ─── Section ─── */
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#202325',
    fontSize: 17,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5B9B75',
  },
  /* ─── Content ─── */
  loading: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  list: {
    gap: spacing.md,
  },
  /* ─── FAB ─── */
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    borderRadius: 28,
    elevation: 4,
  },
});
