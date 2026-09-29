import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing } from '@/theme/theme';

const WELCOME_KEY = '@catalarm/seenWelcome';
const HERO_IMAGE = require('../../assets/images/welcome-hero.png');

export default function WelcomeScreen() {
  const [ready, setReady] = useState(false);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const seen = await AsyncStorage.getItem(WELCOME_KEY);
        if (active && seen === 'true') {
          router.replace('/(tabs)');
        }
      } finally {
        if (active) setReady(true);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleContinue = async () => {
    await AsyncStorage.setItem(WELCOME_KEY, 'true');
    router.replace('/(tabs)');
  };

  if (!ready) {
    return null;
  }

  // Responsive calculations: ensure image scales gracefully on small phones and tablets
  const isCompactHeight = height < 700;
  const imageSize = Math.min(width - 56, 330, isCompactHeight ? height * 0.32 : height * 0.4);

  return (
    <ScreenContainer
      scroll
      padded={false}
      backgroundColor="#FDFBF7"
      edges={['top', 'bottom', 'left', 'right']}
      contentStyle={styles.scrollContent}>
      <View style={styles.mainContainer}>
        {/* Top Hero Section */}
        <View style={[styles.heroWrapper, { marginTop: isCompactHeight ? spacing.sm : spacing.lg }]}>
          <Image
            source={HERO_IMAGE}
            style={[
              styles.heroImage,
              {
                width: imageSize,
                height: imageSize,
              },
            ]}
            resizeMode="cover"
            accessibilityLabel="Ilustración de perro y gato"
          />
        </View>

        {/* Brand & Copy Section */}
        <View style={styles.textSection}>
          <View style={styles.brandRow}>
            <View style={styles.pawIconCircle}>
              <MaterialCommunityIcons name="paw" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.brandTitle}>PetCare</Text>
          </View>

          <Text style={styles.heading}>El mejor cuidado para tu mascota</Text>

          <Text style={styles.description}>
            Gestiona vacunas, comidas, recordatorios médicos y mantén el registro diario de tus compañeros peludos de forma sencilla.
          </Text>
        </View>

        {/* Bottom Action Section */}
        <View style={styles.bottomSection}>
          <Button
            mode="contained"
            onPress={handleContinue}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}>
            Comenzar
          </Button>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
  },
  heroWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  heroImage: {
    borderRadius: 36,
  },
  textSection: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    marginVertical: spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: spacing.md,
  },
  pawIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#5B9B75',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#202325',
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4E555C',
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14.5,
    lineHeight: 22,
    color: '#8E959E',
    textAlign: 'center',
    fontWeight: '400',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
  button: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 28,
    backgroundColor: '#5B9B75',
    elevation: 0,
    shadowColor: 'transparent',
  },
  buttonContent: {
    height: 56,
    justifyContent: 'center',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});