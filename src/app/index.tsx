import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/ScreenContainer';
import { spacing } from '@/theme/theme';

const WELCOME_KEY = '@petalarm/seenWelcome';
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
    router.replace('/caregiver');
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
      backgroundColor="#FAF9F6"
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
    backgroundColor: '#56936E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 14.5,
    lineHeight: 22,
    color: '#6B7280',
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
    borderRadius: 30,
    backgroundColor: '#56936E',
    shadowColor: '#56936E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
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