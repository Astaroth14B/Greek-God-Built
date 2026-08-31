import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';

const SCORE_LABELS = (score) => {
  if (score >= 90) return 'Optimal Biomechanics';
  if (score >= 75) return 'Consistent Form';
  if (score >= 60) return 'Technique Needs Adjustment';
  return 'Review Motion Path';
};

export default function WorkoutSummaryScreen({ navigation, route }) {
  const { session } = route.params || {};
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  const score = session?.formScore || 82;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(scoreAnim, { toValue: score / 100, duration: 1000, useNativeDriver: false }),
    ]).start();
  }, []);

  const formatDuration = (secs) => {
    if (!secs) return '0:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <Ionicons name="checkmark-circle-outline" size={16} color={Colors.gold} />
          <Text style={styles.badgeText}>SESSION COMPLETE</Text>
        </View>
        <Text style={styles.title}>{session?.exercise || 'Workout Session'}</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
      </View>

      {/* Form Score Card */}
      <Card style={styles.scoreCard} highlighted>
        <Text style={styles.scoreLabel}>BIOMECHANICAL ACCURACY SCORE</Text>
        <Text style={styles.scoreValue}>{score}</Text>
        <Text style={styles.scoreMax}>out of 100</Text>
        <Text style={styles.scoreVerdict}>{SCORE_LABELS(score)}</Text>

        {/* Score track */}
        <View style={styles.scoreTrack}>
          <Animated.View
            style={[
              styles.scoreFill,
              {
                width: scoreAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                backgroundColor: Colors.gold,
              },
            ]}
          />
        </View>
        <Text style={styles.mockBadge}>COMPUTER VISION ESTIMATION</Text>
      </Card>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Total Reps', value: session?.reps || 0, icon: 'repeat-outline' },
          { label: 'Completed Sets', value: session?.sets || 0, icon: 'layers-outline' },
          { label: 'Time Under Tension', value: formatDuration(session?.duration), icon: 'time-outline' },
          { label: 'Energy Expended', value: session?.caloriesBurned || 0, icon: 'flame-outline', unit: 'kcal' },
        ].map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name={stat.icon} size={16} color={Colors.gold} />
            </View>
            <Text style={styles.statValue}>
              {stat.value}
            </Text>
            {stat.unit && <Text style={styles.statUnit}>{stat.unit}</Text>}
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Form Analysis Focus Points */}
      <Card style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>TECHNIQUE REFINEMENT TARGETS</Text>
        {[
          'Maintain intra-abdominal brace through the bottom transition',
          'Ensure continuous knee-toe tracking alignment under load',
          'Eliminate momentum during initial ascent to maximize muscle tension',
        ].map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <View style={styles.tipBullet} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </Card>

      {/* Actions */}
      <TouchableOpacity
        style={styles.doneBtn}
        onPress={() => navigation.navigate('WorkoutTab')}
        activeOpacity={0.85}
      >
        <Text style={styles.doneBtnText}>Return to Workouts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate('HomeTab')}
        activeOpacity={0.8}
      >
        <Ionicons name="home-outline" size={16} color={Colors.textSecondary} />
        <Text style={styles.homeBtnText}>Go to Overview</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingTop: 60, paddingBottom: 40 },

  header: { alignItems: 'center', marginBottom: Spacing.lg },
  badgeContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.goldGlow, borderRadius: Radii.full,
    paddingHorizontal: 12, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.borderGold, marginBottom: 8,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: Colors.gold, letterSpacing: 1 },
  title: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  date: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginTop: 4 },

  scoreCard: {
    alignItems: 'center', marginBottom: Spacing.md,
  },
  scoreLabel: { fontSize: 9, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 },
  scoreValue: { fontSize: 64, fontWeight: '900', color: Colors.gold, lineHeight: 72 },
  scoreMax: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: -4 },
  scoreVerdict: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textPrimary, marginTop: 6 },
  scoreTrack: {
    width: '100%', height: 4, backgroundColor: Colors.bgElevated,
    borderRadius: Radii.full, marginTop: 16, overflow: 'hidden',
  },
  scoreFill: { height: '100%', borderRadius: Radii.full },
  mockBadge: {
    fontSize: 8, color: Colors.textMuted, letterSpacing: 1,
    textTransform: 'uppercase', marginTop: 8,
  },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.md },
  statCard: {
    width: '48%', backgroundColor: Colors.bgCard,
    borderRadius: Radii.md, padding: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  statIconContainer: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.goldGlow, alignItems: 'center', justifyContent: 'center',
    marginBottom: 8, borderWidth: 1, borderColor: Colors.borderGold,
  },
  statValue: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.textPrimary },
  statUnit: { fontSize: 10, color: Colors.textMuted },
  statLabel: { fontSize: 9, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },

  tipsCard: { marginBottom: Spacing.lg },
  tipsTitle: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10 },
  tipBullet: {
    width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: Colors.gold, marginTop: 6,
  },
  tipText: { flex: 1, fontSize: FontSizes.xs, color: Colors.textSecondary, lineHeight: 18 },

  doneBtn: {
    backgroundColor: Colors.gold, paddingVertical: 16,
    borderRadius: Radii.full, alignItems: 'center',
    marginBottom: 10, ...Shadows.gold,
  },
  doneBtnText: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.bg, letterSpacing: 0.5 },
  homeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10,
  },
  homeBtnText: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600' },
});
