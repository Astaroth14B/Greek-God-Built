import React, { useRef, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export default function ConfirmationScreen({ navigation, route }) {
  const { booking, pro } = route.params || {};
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bookingRef = useMemo(() => `ZEUS-${Math.random().toString(36).substr(2, 8).toUpperCase()}`, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Animated check */}
      <Animated.View style={[styles.successIcon, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.successIconInner}>
          <Ionicons name="checkmark" size={36} color={Colors.bg} />
        </View>
      </Animated.View>

      <Text style={styles.title}>Consultation Confirmed</Text>
      <Text style={styles.subtitle}>
        Your 1-on-1 session has been locked into the schedule. A calendar invite has been sent.
      </Text>

      {/* Booking Card */}
      <View style={styles.bookingCard}>
        <Text style={styles.bookingCardTitle}>RESERVATION DETAILS</Text>

        <View style={styles.proRow}>
          <View style={styles.proAvatar}>
            <Text style={styles.proInitials}>{booking?.initials || booking?.proName?.slice(0, 2).toUpperCase() || 'SP'}</Text>
          </View>
          <View>
            <Text style={styles.proName}>{booking?.proName}</Text>
            <Text style={styles.proSpecialty}>{booking?.proSpecialty}</Text>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          {[
            {
              icon: 'calendar-outline',
              label: 'Scheduled Date',
              value: new Date(Date.now() + 86400000).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              }),
            },
            { icon: 'time-outline', label: 'Time Window', value: booking?.slot || 'TBD' },
            { icon: 'videocam-outline', label: 'Format', value: 'Direct HD Video Call' },
            { icon: 'card-outline', label: 'Session Fee', value: booking?.price || '₹0' },
          ].map((d) => (
            <View key={d.label} style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name={d.icon} size={15} color={Colors.gold} />
              </View>
              <View>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Booking ID */}
        <View style={styles.bookingIdRow}>
          <Text style={styles.bookingIdLabel}>Reference Code</Text>
          <Text style={styles.bookingIdValue}>{bookingRef}</Text>
        </View>
      </View>

      {/* Next Steps */}
      <View style={styles.nextStepsCard}>
        <Text style={styles.nextStepsTitle}>PREPARATION PROTOCOL</Text>
        {[
          { icon: 'mail-outline', text: 'Check your inbox for the secure consultation room link' },
          { icon: 'calendar-outline', text: 'Calendar invitation auto-synced to your device schedule' },
          { icon: 'document-text-outline', text: 'Review your logged meals and workout history beforehand' },
          { icon: 'fitness-outline', text: 'Formulate specific technique or dietary questions for your coach' },
        ].map((step, i) => (
          <View key={i} style={styles.nextStep}>
            <View style={styles.nextStepIconContainer}>
              <Ionicons name={step.icon} size={14} color={Colors.gold} />
            </View>
            <Text style={styles.nextStepText}>{step.text}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate('HomeTab')}
        activeOpacity={0.85}
      >
        <Ionicons name="home-outline" size={18} color={Colors.bg} />
        <Text style={styles.homeBtnText}>Return to Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.prosBtn}
        onPress={() => navigation.navigate('ProsTab')}
        activeOpacity={0.8}
      >
        <Text style={styles.prosBtnText}>Browse Other Coaches</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingTop: 60, paddingBottom: 40, alignItems: 'center' },

  successIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.goldGlow, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md, borderWidth: 1.5, borderColor: Colors.borderGold,
    ...Shadows.gold,
  },
  successIconInner: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center',
  },

  title: {
    fontSize: FontSizes.xxl, fontWeight: '800',
    color: Colors.textPrimary, textAlign: 'center', marginBottom: 6,
  },
  subtitle: {
    fontSize: FontSizes.sm, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 20, marginBottom: Spacing.lg,
    paddingHorizontal: 10,
  },

  bookingCard: {
    width: '100%', backgroundColor: Colors.bgCard,
    borderRadius: Radii.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderGold,
    marginBottom: Spacing.md, ...Shadows.card,
  },
  bookingCardTitle: {
    fontSize: 10, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
  },
  proRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
    marginBottom: 12,
  },
  proAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  proInitials: { fontSize: FontSizes.xs, fontWeight: '800', color: Colors.gold },
  proName: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.textPrimary },
  proSpecialty: { fontSize: FontSizes.xs, color: Colors.gold, fontWeight: '600', marginTop: 1 },

  detailsGrid: { gap: 10, marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailIcon: {
    width: 28, height: 28, borderRadius: 6,
    backgroundColor: Colors.goldGlow, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  detailLabel: { fontSize: 9, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: FontSizes.xs, color: Colors.textPrimary, fontWeight: '600', marginTop: 1 },

  bookingIdRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  bookingIdLabel: { fontSize: 10, color: Colors.textMuted },
  bookingIdValue: { fontSize: FontSizes.xs, fontWeight: '800', color: Colors.gold, letterSpacing: 1 },

  nextStepsCard: {
    width: '100%', backgroundColor: Colors.bgCard,
    borderRadius: Radii.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  nextStepsTitle: { fontSize: 10, fontWeight: '800', color: Colors.textSecondary, letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  nextStep: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  nextStepIconContainer: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  nextStepText: { flex: 1, fontSize: FontSizes.xs, color: Colors.textSecondary, lineHeight: 18 },

  homeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.gold, paddingVertical: 16,
    borderRadius: Radii.full, gap: 8,
    width: '100%', marginBottom: 10, ...Shadows.gold,
  },
  homeBtnText: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.bg, letterSpacing: 0.5 },
  prosBtn: {
    paddingVertical: 10, alignItems: 'center',
  },
  prosBtnText: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600' },
});
