import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, StatusBar,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Background glow blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Logo / Icon */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.logoInner}>
            <Text style={styles.logoEmoji}>⚡</Text>
          </View>
        </Animated.View>

        <Text style={styles.appName}>GREEK GOD</Text>
        <Text style={styles.appSubtitle}>BUILD</Text>

        <View style={styles.divider} />

        <Text style={styles.tagline}>
          AI-Powered Fitness.{'\n'}Built for Champions.
        </Text>

        <View style={styles.features}>
          {[
            { icon: 'camera', label: 'AI Calorie Tracking' },
            { icon: 'body', label: 'Form Analysis' },
            { icon: 'nutrition', label: 'Personalized Diet' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIconBg}>
                <Ionicons name={f.icon} size={16} color={Colors.accent} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('PersonalInfo')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Start Your Journey</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.bg} />
        </TouchableOpacity>

        <Text style={styles.disclaimer}>Free forever. No account needed.</Text>
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
  blob1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 212, 255, 0.06)',
    top: height * 0.1,
    left: -80,
  },
  blob2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(57, 255, 20, 0.04)',
    bottom: height * 0.15,
    right: -60,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    width: '100%',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderAccent,
    ...Shadows.accent,
  },
  logoInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    fontSize: FontSizes.display,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 8,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '300',
    color: Colors.accent,
    letterSpacing: 12,
    marginTop: -4,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: Colors.accent,
    marginVertical: Spacing.lg,
    borderRadius: Radii.full,
  },
  tagline: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: Spacing.xl,
  },
  features: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  featureIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
  },
  featureLabel: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: Radii.full,
    gap: 10,
    marginBottom: Spacing.md,
    ...Shadows.accent,
  },
  ctaText: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
    color: Colors.bg,
    letterSpacing: 0.5,
  },
  disclaimer: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
