import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { type AppData } from './types';
import { parseBackupJson } from './validate';

export interface BackupResult {
  ok: boolean;
  message?: string;
}

function fileStamp(): string {
  const d = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : String(n));
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function readFileText(uri: string): Promise<string> {
  if (Platform.OS === 'web') {
    return fetch(uri).then((res) => res.text());
  }
  return new File(uri).text();
}

function triggerWebDownload(json: string, filename: string) {
  if (typeof document === 'undefined') return;
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/** Serializes the dataset and opens the share sheet (or downloads on web). */
export async function exportBackup(data: AppData): Promise<BackupResult> {
  const payload = { ...data, exportedAt: new Date().toISOString() };
  const json = JSON.stringify(payload, null, 2);
  const filename = `catalarm-${fileStamp()}.json`;

  try {
    if (Platform.OS === 'web') {
      triggerWebDownload(json, filename);
      return { ok: true };
    }

    const file = new File(Paths.cache, filename);
    file.create({ overwrite: true, intermediates: true });
    file.write(json);

    if (!(await Sharing.isAvailableAsync())) {
      return { ok: false, message: 'Compartir archivos no está disponible en este dispositivo.' };
    }
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Exportar datos de CatAlarm',
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'No se pudo exportar el archivo.',
    };
  }
}

/** Opens the document picker, reads the selected JSON, and returns the parsed dataset. */
export async function importBackup(): Promise<{ ok: true; data: AppData } | { ok: false; message: string }> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/plain', '*/*'],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) {
      return { ok: false, message: 'canceled' };
    }

    const asset = result.assets[0];
    if (!asset) {
      return { ok: false, message: 'No se seleccionó ningún archivo.' };
    }

    const text = await readFileText(asset.uri);
    const data = parseBackupJson(text);
    return { ok: true, data };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'No se pudo importar el archivo.',
    };
  }
}
