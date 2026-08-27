import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const SCORE_COLORS = (score) => {
  if (score >= 90) return Colors.green;
  if (score >= 75) return Colors.accent;
  if (score >= 60) return Colors.orange;
  return Colors.danger;
};

const SCORE_LABELS = (score) => {
  if (score >= 90) return 'Excellent! 🏆';
  if (score >= 75) return 'Great Form! ✅';
  if (score >= 60) return 'Room to Improve 📈';
  return 'Needs Work 🔧';
};

export default function WorkoutSummaryScreen({ navigation, route }) {
  const { session } = route.params || {};
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  const score = session?.formScore || 82;
  const scoreColor = SCORE_COLORS(score);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(scoreAnim, { toValue: score / 100, duration: 1200, useNativeDriver: false }),
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
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Session Complete!</Text>
        <Text style={styles.exerciseName}>{session?.exercise || 'Workout'}</Text>
      </View>

      {/* Form Score Ring */}
      <View style={[styles.scoreCard, { borderColor: scoreColor + '55' }]}>
        <Text style={styles.scoreLabel}>Form Score</Text>
        <Text style={[styles.scoreValue, { color: scoreColor }]}>{score}</Text>
        <Text style={styles.scoreMax}>/100</Text>
        <Text style={[styles.scoreVerdict, { color: scoreColor }]}>{SCORE_LABELS(score)}</Text>

        {/* Score bar */}
        <View style={styles.scoreTrack}>
          <Animated.View
            style={[
              styles.scoreFill,
              {
                width: scoreAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                backgroundColor: scoreColor,
              },
            ]}
          />
        </View>
        <Text style={styles.mockBadge}>MOCK • AI Form Analysis Simulated</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Total Reps', value: session?.reps || 0, icon: '🔁', color: Colors.accent },
          { label: 'Sets', value: session?.sets || 0, icon: '💪', color: Colors.green },
          { label: 'Duration', value: formatDuration(session?.duration), icon: '⏱️', color: Colors.purple },
          { label: 'Calories', value: session?.caloriesBurned || 0, icon: '🔥', color: Colors.orange, unit: 'kcal' },
        ].map((stat) => (
          <View key={stat.label} style={[styles.statCard, { borderColor: stat.color + '44' }]}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={[styles.statValue, { color: stat.color }]}>
              {stat.value}{stat.unit ? '' : ''}
            </Text>
            {stat.unit && <Text style={styles.statUnit}>{stat.unit}</Text>}
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Form Tips from Session */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Focus Points for Next Session</Text>
        {[
          'Keep your core braced throughout the movement',
          'Work on your range of motion — aim to go deeper',
          'Control the eccentric (lowering) phase more deliberately',
        ].map((tip, i) => (
          <View key={i} style={styles.tipRow}>
            <View style={styles.tipBullet} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* Streak boost */}
      <View style={styles.streakBoost}>
        <Text style={styles.streakBoostEmoji}>🔥</Text>
        <View>
          <Text style={styles.streakBoostTitle}>Streak Extended!</Text>
          <Text style={styles.streakBoostSub}>Your gym streak grows stronger every session.</Text>
        </View>
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={styles.doneBtn}
        onPress={() => navigation.navigate('WorkoutTab')}
      >
        <Text style={styles.doneBtnText}>Back to Workouts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate('HomeTab')}
      >
        <Ionicons name="home" size={18} color={Colors.textSecondary} />
        <Text style={styles.homeBtnText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingTop: 60, paddingBottom: 40 },

  header: { alignItems: 'center', marginBottom: Spacing.lg },
  emoji: { fontSize: 56, marginBottom: 8 },
  title: { fontSize: FontSizes.xxxl, fontWeight: '900', color: Colors.textPrimary, marginBottom: 4 },
  exerciseName: { fontSize: FontSizes.lg, color: Colors.accent, fontWeight: '600' },

  scoreCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radii.xl,
    padding: Spacing.xl, alignItems: 'center', borderWidth: 1.5,
    marginBottom: Spacing.md, ...Shadows.card,
  },
  scoreLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  scoreValue: { fontSize: 80, fontWeight: '900', lineHeight: 88 },
  scoreMax: { fontSize: FontSizes.xl, color: Colors.textMuted, marginTop: -4 },
  scoreVerdict: { fontSize: FontSizes.xl, fontWeight: '800', marginTop: 6 },
  scoreTrack: {
    width: '100%', height: 8, backgroundColor: Colors.bgElevated,
    borderRadius: Radii.full, marginTop: 16, overflow: 'hidden',
  },
  scoreFill: { height: '100%', borderRadius: Radii.full },
  mockBadge: {
    fontSize: 8, color: Colors.textMuted, letterSpacing: 1,
    textTransform: 'uppercase', marginTop: 8,
  },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.md },
  statCard: {
    width: '47%', backgroundColor: Colors.bgCard,
    borderRadius: Radii.lg, padding: Spacing.md, alignItems: 'center',
    borderWidth: 1.5, ...Shadows.card,
  },
  statIcon: { fontSize: 24, marginBottom: 6 },
  statValue: { fontSize: FontSizes.xxl, fontWeight: '900' },
  statUnit: { fontSize: FontSizes.xs, color: Colors.textMuted },
  statLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },

  tipsCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radii.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.borderAccent,
  },
  tipsTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.accent, marginBottom: 12 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 10 },
  tipBullet: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.accent, marginTop: 7,
  },
  tipText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },

  streakBoost: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.orange + '15', borderRadius: Radii.lg,
    padding: Spacing.md, marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.orange + '44',
  },
  streakBoostEmoji: { fontSize: 32 },
  streakBoostTitle: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.orange },
  streakBoostSub: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginTop: 2 },

  doneBtn: {
    backgroundColor: Colors.green, paddingVertical: 16,
    borderRadius: Radii.full, alignItems: 'center',
    marginBottom: 12, ...Shadows.green,
  },
  doneBtnText: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.bg },
  homeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12,
  },
  homeBtnText: { fontSize: FontSizes.md, color: Colors.textSecondary },
});
