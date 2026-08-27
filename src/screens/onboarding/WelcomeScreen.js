import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Dimensions, StatusBar, Image,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.8, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bg} />

      {/* Atmospheric divine background glow */}
      <Animated.View style={[styles.haloGlow, { opacity: glowAnim }]} />
      <View style={styles.blobCyan} />
      <View style={styles.blobGold} />

      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Greek God Logo Emblem */}
        <Animated.View style={[styles.logoWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.logoBorder}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* Title & Divine Badge */}
        <View style={styles.mythicBadge}>
          <Text style={styles.mythicBadgeText}>⚡ FORGE YOUR OLYMPIAN PHYSIQUE ⚡</Text>
        </View>

        <Text style={styles.appName}>GREEK GOD</Text>
        <Text style={styles.appSubtitle}>BUILD PROTOCOL</Text>

        <View style={styles.goldDivider}>
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
        </View>

        <Text style={styles.tagline}>
          AI-Powered Vision & Form Tracking.{'\n'}Sculpt your body to legendary proportions.
        </Text>

        {/* Pillars / Features */}
        <View style={styles.features}>
          {[
            { icon: 'camera', label: 'Ambrosia AI Calorie Scanner', color: Colors.accent },
            { icon: 'body', label: 'Titan AI Real-Time Form Coach', color: Colors.gold },
            { icon: 'nutrition', label: 'God-Tier Custom Diet & Macros', color: Colors.green },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={[styles.featureIconBg, { borderColor: f.color + '66' }]}>
                <Ionicons name={f.icon} size={16} color={f.color} />
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
          <Text style={styles.ctaText}>ENTER MOUNT OLYMPUS</Text>
          <Ionicons name="flash" size={20} color={Colors.bg} />
        </TouchableOpacity>

        <Text style={styles.disclaimer}>Offline Demo Ready • No Sign-up Required</Text>
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
  haloGlow: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    top: height * 0.12,
  },
  blobCyan: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    top: 40,
    left: -60,
  },
  blobGold: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 215, 0, 0.04)',
    bottom: 80,
    right: -50,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    width: '100%',
  },
  logoWrapper: {
    marginBottom: Spacing.md,
    ...Shadows.gold,
  },
  logoBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#000',
    borderWidth: 2.5,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 12,
  },
  logoImage: {
    width: 132,
    height: 132,
    borderRadius: 66,
  },
  mythicBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.35)',
    marginBottom: 10,
  },
  mythicBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 1.5,
  },
  appName: {
    fontSize: FontSizes.display,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 6,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: FontSizes.lg,
    fontWeight: '400',
    color: Colors.accent,
    letterSpacing: 8,
    marginTop: -2,
  },
  goldDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: Spacing.md,
  },
  dividerLine: {
    width: 50,
    height: 2,
    backgroundColor: Colors.gold,
    borderRadius: 1,
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gold,
  },
  tagline: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
  },
  featureLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: Radii.full,
    gap: 10,
    width: '100%',
    marginBottom: Spacing.sm,
    ...Shadows.gold,
  },
  ctaText: {
    fontSize: FontSizes.md,
    fontWeight: '900',
    color: Colors.bg,
    letterSpacing: 1.2,
  },
  disclaimer: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
