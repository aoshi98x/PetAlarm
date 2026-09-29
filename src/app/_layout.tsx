import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { DataProvider } from '@/data/DataContext';
import { paperDarkTheme, paperLightTheme } from '@/theme/theme';
import { configureNotifications } from '@/utils/notifications';

export default function RootLayout() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? paperDarkTheme : paperLightTheme;

  useEffect(() => {
    void configureNotifications();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <DataProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </DataProvider>
    </PaperProvider>
  );
}
