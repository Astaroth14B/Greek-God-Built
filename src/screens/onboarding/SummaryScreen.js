import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../../theme';
import useAppStore from '../../store/useAppStore';
import { calcNutritionProfile } from '../../utils/nutrition';
import { Ionicons } from '@expo/vector-icons';

const StatCard = ({ label, value, unit, color, icon }) => (
  <View style={[styles.statCard, { borderColor: color + '55' }]}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statUnit}>{unit}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function SummaryScreen({ navigation }) {
  const { profile, setNutrition, completeOnboarding } = useAppStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const result = calcNutritionProfile(profile);

  useEffect(() => {
    setNutrition(result);
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const handleStart = () => {
    completeOnboarding();
  };

  const goalColors = { bulk: Colors.green, cut: Colors.orange, maintain: Colors.accent };
  const goalColor = goalColors[profile.goal] || Colors.accent;

  const macroTotal = result.macros.protein * 4 + result.macros.carbs * 4 + result.macros.fat * 9;

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressRow}>
          {[0,1,2].map(i => (
            <React.Fragment key={i}>
              <View style={[styles.progressDot, styles.progressDone]} />
              {i < 2 && <View style={[styles.progressLine, styles.progressLineDone]} />}
            </React.Fragment>
          ))}
        </View>
        <Text style={styles.greeting}>Here's your plan,</Text>
        <Text style={styles.name}>{profile.name || 'Champion'} 🏆</Text>
      </View>

      {/* BMI Card */}
      <View style={[styles.bmiCard, { borderColor: goalColor + '44' }]}>
        <View>
          <Text style={styles.bmiLabel}>Body Mass Index</Text>
          <Text style={[styles.bmiValue, { color: goalColor }]}>{result.bmi}</Text>
          <Text style={styles.bmiCategory}>{result.bmiCategory}</Text>
        </View>
        <View style={styles.bmiStats}>
          <Text style={styles.bmiSmall}>Height: {profile.heightCm} cm</Text>
          <Text style={styles.bmiSmall}>Weight: {profile.weightKg} kg</Text>
        </View>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <StatCard label="BMR" value={result.bmr} unit="kcal/day" color="#A855F7" icon="🔥" />
        <StatCard label="TDEE" value={result.tdee} unit="kcal/day" color={Colors.accent} icon="⚡" />
      </View>

      {/* Calorie target */}
      <View style={[styles.targetCard, { borderColor: goalColor + '55' }]}>
        <View style={styles.targetHeader}>
          <Text style={styles.targetLabel}>Daily Calorie Target</Text>
          <View style={[styles.goalBadge, { backgroundColor: goalColor + '20', borderColor: goalColor + '44' }]}>
            <Text style={[styles.goalBadgeText, { color: goalColor }]}>
              {profile.goal.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={[styles.targetValue, { color: goalColor }]}>
          {result.targetCalories}
          <Text style={styles.targetUnit}> kcal</Text>
        </Text>
        {profile.goal !== 'maintain' && (
          <Text style={styles.offsetNote}>
            {profile.goal === 'bulk' ? '↑ +400 kcal surplus' : '↓ -400 kcal deficit'} from TDEE
          </Text>
        )}
      </View>

      {/* Macro breakdown */}
      <Text style={styles.sectionTitle}>Macro Targets</Text>
      <View style={styles.macroRow}>
        {[
          { label: 'Protein', value: result.macros.protein, color: Colors.accent, icon: '🥩' },
          { label: 'Carbs', value: result.macros.carbs, color: Colors.purple, icon: '🍚' },
          { label: 'Fat', value: result.macros.fat, color: Colors.orange, icon: '🥑' },
        ].map((m) => (
          <View key={m.label} style={styles.macroCard}>
            <Text style={styles.macroIcon}>{m.icon}</Text>
            <Text style={[styles.macroValue, { color: m.color }]}>{m.value}g</Text>
            <Text style={styles.macroLabel}>{m.label}</Text>
            <Text style={styles.macroPct}>
              {Math.round((m.value * (m.label === 'Fat' ? 9 : 4) / macroTotal) * 100)}%
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: goalColor, ...Shadows.accent }]} onPress={handleStart}>
        <Text style={styles.ctaBtnText}>Let's Go! 🚀</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingTop: 60, paddingBottom: 40 },

  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.bgElevated },
  progressDone: { backgroundColor: Colors.accent },
  progressLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginHorizontal: 4 },
  progressLineDone: { backgroundColor: Colors.accent },

  header: { marginBottom: Spacing.lg },
  greeting: { fontSize: FontSizes.lg, color: Colors.textSecondary, marginBottom: 4 },
  name: { fontSize: FontSizes.xxxl, fontWeight: '900', color: Colors.textPrimary },

  bmiCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radii.lg,
    padding: Spacing.md, borderWidth: 1.5, marginBottom: Spacing.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    ...Shadows.card,
  },
  bmiLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  bmiValue: { fontSize: FontSizes.display, fontWeight: '900', lineHeight: 56 },
  bmiCategory: { fontSize: FontSizes.md, color: Colors.textSecondary, fontWeight: '600' },
  bmiStats: { alignItems: 'flex-end' },
  bmiSmall: { fontSize: FontSizes.sm, color: Colors.textMuted, marginBottom: 4 },

  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: Spacing.md },
  statCard: {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radii.lg,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1.5, ...Shadows.card,
  },
  statIcon: { fontSize: 24, marginBottom: 6 },
  statValue: { fontSize: FontSizes.xxl, fontWeight: '800' },
  statUnit: { fontSize: FontSizes.xs, color: Colors.textMuted },
  statLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.8 },

  targetCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radii.lg,
    padding: Spacing.lg, borderWidth: 1.5, marginBottom: Spacing.md, ...Shadows.card,
  },
  targetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  targetLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  goalBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: Radii.full, borderWidth: 1,
  },
  goalBadgeText: { fontSize: FontSizes.xs, fontWeight: '800', letterSpacing: 1 },
  targetValue: { fontSize: 52, fontWeight: '900', lineHeight: 60 },
  targetUnit: { fontSize: FontSizes.xxl, fontWeight: '400' },
  offsetNote: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 4 },

  sectionTitle: {
    fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },
  macroRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.xl },
  macroCard: {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  macroIcon: { fontSize: 22, marginBottom: 6 },
  macroValue: { fontSize: FontSizes.xl, fontWeight: '800' },
  macroLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  macroPct: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 4 },

  ctaBtn: {
    paddingVertical: 18, borderRadius: Radii.full,
    alignItems: 'center',
  },
  ctaBtnText: { fontSize: FontSizes.xl, fontWeight: '900', color: Colors.bg },
});
