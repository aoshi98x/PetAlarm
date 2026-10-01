import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

import { maxContentWidth, spacing } from '@/theme/theme';

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  actions?: ReactNode;
}

export function AppHeader({ title, subtitle, back = false, actions }: AppHeaderProps) {

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {back && (
          <View style={styles.backButtonContainer}>
            <IconButton
              icon="arrow-left"
              size={20}
              iconColor="#2D3748"
              onPress={goBack}
              accessibilityLabel="Volver"
            />
          </View>
        )}
        <View style={styles.text}>
          <Text variant="headlineSmall" style={styles.title}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="bodySmall" style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {actions}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginRight: spacing.xs,
  },
  text: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    color: '#1F2937',
    fontSize: 22,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 2,
  },
});
