import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Snackbar, Text } from 'react-native-paper';

import { AppHeader } from '@/components/AppHeader';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useData } from '@/data/DataContext';
import { exportBackup, importBackup } from '@/data/backup';
import type { AppData } from '@/data/types';
import { spacing } from '@/theme/theme';

export default function SettingsScreen() {
  const { data, replaceAll, resetAll } = useData();

  const [busy, setBusy] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [pendingImport, setPendingImport] = useState<AppData | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  async function handleExport() {
    setBusy(true);
    const result = await exportBackup(data);
    setBusy(false);
    if (!result.ok) {
      setSnackbar(result.message ?? 'No se pudo exportar el archivo.');
    }
  }

  async function handleImport() {
    setBusy(true);
    const result = await importBackup();
    setBusy(false);
    if (result.ok) {
      setPendingImport(result.data);
    } else if (result.message !== 'canceled') {
      setSnackbar(result.message);
    }
  }

  function confirmImport() {
    if (!pendingImport) return;
    replaceAll(pendingImport);
    setPendingImport(null);
    setSnackbar('Datos importados correctamente.');
  }

  function handleConfirmReset() {
    resetAll();
    setConfirmReset(false);
    setSnackbar('Todos los datos fueron eliminados.');
  }

  const importedRecordCount = pendingImport
    ? pendingImport.feedings.length +
      pendingImport.vaccinations.length +
      pendingImport.medications.length +
      pendingImport.visits.length
    : 0;

  return (
    <View style={styles.root}>
      <ScreenContainer backgroundColor="#FAF9F6">
        <AppHeader
          title="Ajustes y Datos"
          subtitle="Tus datos se guardan únicamente en este dispositivo"
        />

        <View style={styles.cardSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Copia de seguridad
          </Text>
          <Text variant="bodyMedium" style={styles.sectionDescription}>
            Exporta tus datos a un archivo JSON para guardarlos en Google Drive o transferirlos a
            otro dispositivo.
          </Text>
          <View style={styles.buttonGroup}>
            <Button
              mode="contained"
              icon="export-variant"
              buttonColor="#56936E"
              textColor="#FFFFFF"
              style={styles.actionButton}
              contentStyle={{ height: 50 }}
              onPress={handleExport}
              loading={busy}
              disabled={busy}>
              Exportar datos (JSON)
            </Button>
            <Button
              mode="outlined"
              icon="import"
              textColor="#5B9B75"
              style={[styles.actionButton, styles.outlinedButton]}
              onPress={handleImport}
              disabled={busy}>
              Importar datos
            </Button>
          </View>
        </View>

        <View style={[styles.cardSection, styles.dangerSection]}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { color: '#C53030' }]}>
            Zona de peligro
          </Text>
          <Text variant="bodySmall" style={styles.dangerDescription}>
            Si eliminas los datos, perderás todas las mascotas y sus historiales permanentemente.
          </Text>
          <Button
            mode="outlined"
            icon="trash-can-outline"
            textColor="#C53030"
            style={styles.dangerButton}
            onPress={() => setConfirmReset(true)}>
            Borrar todos los datos
          </Button>
        </View>
      </ScreenContainer>

      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar(null)}
        duration={3000}
        action={{ label: 'Cerrar', onPress: () => setSnackbar(null) }}>
        {snackbar}
      </Snackbar>

      <ConfirmDialog
        visible={!!pendingImport}
        title="¿Importar estos datos?"
        message={`El archivo contiene ${pendingImport?.pets.length ?? 0} mascotas y ${importedRecordCount} registros. Esto reemplazará los datos actuales.`}
        confirmLabel="Importar"
        destructive
        onConfirm={confirmImport}
        onDismiss={() => setPendingImport(null)}
      />

      <ConfirmDialog
        visible={confirmReset}
        title="¿Borrar todos los datos?"
        message="Se eliminarán todas las mascotas y registros de este dispositivo. Esta acción no se puede deshacer."
        confirmLabel="Borrar todo"
        destructive
        onConfirm={handleConfirmReset}
        onDismiss={() => setConfirmReset(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  cardSection: {
    gap: spacing.md,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderColor: '#EFEFEF',
    borderWidth: 1,
    padding: spacing.lg,
    marginTop: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  dangerSection: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FFF5F5',
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1F2937',
    fontSize: 18,
  },
  sectionDescription: {
    color: '#6B7280',
    lineHeight: 20,
    fontSize: 14,
  },
  dangerDescription: {
    color: '#991B1B',
    lineHeight: 18,
    fontSize: 14,
  },
  buttonGroup: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionButton: {
    borderRadius: 25,
  },
  outlinedButton: {
    borderColor: '#56936E',
  },
  dangerButton: {
    borderRadius: 25,
    borderColor: '#FEB2B2',
  },
});
