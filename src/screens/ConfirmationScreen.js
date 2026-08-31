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
  const bookingRef = useMemo(() => `GGB-${Math.random().toString(36).substr(2, 8).toUpperCase()}`, []);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 8 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
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
          <Ionicons name="checkmark" size={48} color={Colors.bg} />
        </View>
      </Animated.View>

      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.subtitle}>
        Your session has been booked. You'll receive a confirmation email shortly.
      </Text>

      {/* Booking Card */}
      <View style={[styles.bookingCard, { borderColor: Colors.green + '55' }]}>
        <Text style={styles.bookingCardTitle}>Booking Details</Text>

        <View style={styles.proRow}>
          <View style={styles.proAvatar}>
            <Text style={styles.proAvatarEmoji}>{booking?.proEmoji || '👨‍⚕️'}</Text>
          </View>
          <View>
            <Text style={styles.proName}>{booking?.proName}</Text>
            <Text style={styles.proSpecialty}>{booking?.proSpecialty}</Text>
          </View>
        </View>

        <View style={styles.detailsGrid}>
          {[
            {
              icon: 'calendar',
              label: 'Date',
              value: new Date(Date.now() + 86400000).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              }),
            },
            { icon: 'time', label: 'Time', value: booking?.slot || 'TBD' },
            { icon: 'videocam', label: 'Format', value: 'Video Call (Zoom)' },
            { icon: 'card', label: 'Price', value: booking?.price || '₹0' },
          ].map((d) => (
            <View key={d.label} style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name={d.icon} size={16} color={Colors.accent} />
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
          <Text style={styles.bookingIdLabel}>Booking Ref</Text>
          <Text style={styles.bookingIdValue}>{bookingRef}</Text>
        </View>
      </View>

      {/* Next Steps */}
      <View style={styles.nextStepsCard}>
        <Text style={styles.nextStepsTitle}>What's Next?</Text>
        {[
          { icon: '📧', text: 'Check your email for the Zoom link' },
          { icon: '📅', text: 'Add the session to your calendar' },
          { icon: '📝', text: 'Prepare your fitness goals to share with your pro' },
          { icon: '💪', text: 'Stay hydrated and get a good night\'s sleep!' },
        ].map((step, i) => (
          <View key={i} style={styles.nextStep}>
            <Text style={styles.nextStepIcon}>{step.icon}</Text>
            <Text style={styles.nextStepText}>{step.text}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate('HomeTab')}
      >
        <Ionicons name="home" size={20} color={Colors.bg} />
        <Text style={styles.homeBtnText}>Go to Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.prosBtn}
        onPress={() => navigation.navigate('ProsTab')}
      >
        <Text style={styles.prosBtnText}>Browse More Professionals</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingTop: 60, paddingBottom: 40, alignItems: 'center' },

  successIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.green + '20', alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.lg, borderWidth: 2, borderColor: Colors.green,
    ...Shadows.green,
  },
  successIconInner: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center',
  },

  title: {
    fontSize: FontSizes.xxxl, fontWeight: '900',
    color: Colors.textPrimary, textAlign: 'center', marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSizes.md, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl,
    paddingHorizontal: 10,
  },

  bookingCard: {
    width: '100%', backgroundColor: Colors.bgCard,
    borderRadius: Radii.xl, padding: Spacing.lg,
    borderWidth: 1.5, marginBottom: Spacing.md, ...Shadows.card,
  },
  bookingCardTitle: {
    fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14,
  },
  proRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.border,
    marginBottom: 14,
  },
  proAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.borderAccent,
  },
  proAvatarEmoji: { fontSize: 22 },
  proName: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.textPrimary },
  proSpecialty: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: '600' },

  detailsGrid: { gap: 12, marginBottom: 14 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailIcon: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: Colors.accentGlow, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.borderAccent,
  },
  detailLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: FontSizes.sm, color: Colors.textPrimary, fontWeight: '600', marginTop: 1 },

  bookingIdRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  bookingIdLabel: { fontSize: FontSizes.xs, color: Colors.textMuted },
  bookingIdValue: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.green, fontFamily: 'monospace' },

  nextStepsCard: {
    width: '100%', backgroundColor: Colors.bgCard,
    borderRadius: Radii.xl, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  nextStepsTitle: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
  nextStep: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  nextStepIcon: { fontSize: 20 },
  nextStepText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textSecondary },

  homeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, paddingVertical: 16,
    borderRadius: Radii.full, gap: 10,
    width: '100%', marginBottom: 12, ...Shadows.accent,
  },
  homeBtnText: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.bg },
  prosBtn: {
    paddingVertical: 12, alignItems: 'center',
  },
  prosBtnText: { fontSize: FontSizes.md, color: Colors.textSecondary, fontWeight: '600' },
});
