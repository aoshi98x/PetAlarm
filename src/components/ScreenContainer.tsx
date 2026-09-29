import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { maxContentWidth, spacing } from '@/theme/theme';

interface ScreenContainerProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  edges?: readonly ('top' | 'right' | 'bottom' | 'left')[];
}

/**
 * Responsive screen shell: fills the safe area, centers content at a max
 * width (for tablets/web), and optionally scrolls.
 */
export function ScreenContainer({
  children,
  scroll = true,
  padded = true,
  contentStyle,
  style,
  backgroundColor,
  edges = ['top', 'left', 'right'],
}: ScreenContainerProps) {
  const theme = useTheme();

  const body = (
    <View
      style={[
        styles.inner,
        padded && { padding: spacing.lg },
        { maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' },
      ]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.root, { backgroundColor: backgroundColor ?? theme.colors.background }, style]}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {body}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contentStyle]}>{body}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  inner: {
    flexGrow: 1,
  },
});
