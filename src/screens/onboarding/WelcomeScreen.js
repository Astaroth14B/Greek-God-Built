import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, StatusBar, Image,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Project Zeus Logo */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoBorder}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Minimalist Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PERFORMANCE SYSTEM</Text>
        </View>

        <Text style={styles.appName}>PROJECT ZEUS</Text>
        <Text style={styles.appSubtitle}>AI TRAINING & NUTRITION</Text>

        <View style={styles.goldDivider}>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.tagline}>
          Precision computer vision form tracking, automated calorie analysis, and personalized nutrition architecture.
        </Text>

        {/* Features list */}
        <View style={styles.features}>
          {[
            { icon: 'camera-outline', label: 'Computer Vision Calorie & Portion Scanner' },
            { icon: 'body-outline', label: 'Real-Time Biomechanical Form Analysis' },
            { icon: 'restaurant-outline', label: 'Personalized Macro & Calorie Periodization' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIconBg}>
                <Ionicons name={f.icon} size={16} color={Colors.gold} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('PersonalInfo')}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaText}>START ASSESSMENT</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.bg} />
        </TouchableOpacity>

        <Text style={styles.disclaimer}>Scientific Calibration · No Account Required</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    width: '100%',
  },
  logoWrapper: {
    marginBottom: Spacing.md,
  },
  logoBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#000',
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoImage: {
    width: 114,
    height: 114,
    borderRadius: 57,
  },
  badge: {
    backgroundColor: Colors.goldGlow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 1.5,
  },
  appName: {
    fontSize: FontSizes.display,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 4,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.gold,
    letterSpacing: 6,
    marginTop: -2,
  },
  goldDivider: {
    marginVertical: Spacing.md,
    alignItems: 'center',
  },
  dividerLine: {
    width: 40,
    height: 1.5,
    backgroundColor: Colors.borderGold,
    borderRadius: 1,
  },
  tagline: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  features: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: Colors.bgCard,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.goldGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  featureLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: Radii.full,
    gap: 8,
    width: '100%',
    marginBottom: Spacing.sm,
    ...Shadows.gold,
  },
  ctaText: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: Colors.bg,
    letterSpacing: 1,
  },
  disclaimer: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
