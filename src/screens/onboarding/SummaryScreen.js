import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../../theme';
import useAppStore from '../../store/useAppStore';
import { calcNutritionProfile } from '../../utils/nutrition';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/Card';

const StatCard = ({ label, value, unit, icon }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconContainer}>
      <Ionicons name={icon} size={15} color={Colors.gold} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statUnit}>{unit}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function SummaryScreen({ navigation }) {
  const { profile, setNutrition, completeOnboarding } = useAppStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const result = useRef(calcNutritionProfile(profile)).current;

  useEffect(() => {
    setNutrition(result);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const handleStart = () => {
    completeOnboarding();
  };

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
        <Text style={styles.stepLabel}>STEP 3 OF 3 · COMPLETE</Text>
        <Text style={styles.greeting}>Calibrated Protocol For</Text>
        <Text style={styles.name}>{profile.name || 'Athlete'}</Text>
      </View>

      {/* BMI Card */}
      <Card style={styles.bmiCard} highlighted>
        <View>
          <Text style={styles.bmiLabel}>BODY MASS INDEX</Text>
          <Text style={styles.bmiValue}>{result.bmi}</Text>
          <Text style={styles.bmiCategory}>{result.bmiCategory}</Text>
        </View>
        <View style={styles.bmiStats}>
          <Text style={styles.bmiSmall}>Height: {profile.heightCm} cm</Text>
          <Text style={styles.bmiSmall}>Weight: {profile.weightKg} kg</Text>
        </View>
      </Card>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <StatCard label="Basal Rate (BMR)" value={result.bmr} unit="kcal / day" icon="flame-outline" />
        <StatCard label="Daily Burn (TDEE)" value={result.tdee} unit="kcal / day" icon="flash-outline" />
      </View>

      {/* Calorie target */}
      <Card style={styles.targetCard} highlighted>
        <View style={styles.targetHeader}>
          <Text style={styles.targetLabel}>TARGET DAILY ENERGY</Text>
          <View style={styles.goalBadge}>
            <Text style={styles.goalBadgeText}>
              {profile.goal?.toUpperCase() || 'BALANCED'}
            </Text>
          </View>
        </View>
        <Text style={styles.targetValue}>
          {result.targetCalories}
          <Text style={styles.targetUnit}> kcal</Text>
        </Text>
        {profile.goal !== 'maintain' && (
          <Text style={styles.offsetNote}>
            {profile.goal === 'bulk' ? '+400 kcal surplus for hypertrophy' : '-400 kcal deficit for fat reduction'}
          </Text>
        )}
      </Card>

      {/* Macro breakdown */}
      <Text style={styles.sectionTitle}>MACRONUTRIENT TARGETS</Text>
      <View style={styles.macroRow}>
        {[
          { label: 'Protein', value: result.macros.protein, color: Colors.gold, icon: 'fitness-outline' },
          { label: 'Carbs', value: result.macros.carbs, color: Colors.textPrimary, icon: 'nutrition-outline' },
          { label: 'Fat', value: result.macros.fat, color: Colors.textSecondary, icon: 'shield-checkmark-outline' },
        ].map((m) => (
          <View key={m.label} style={styles.macroCard}>
            <View style={styles.macroIconContainer}>
              <Ionicons name={m.icon} size={14} color={m.color} />
            </View>
            <Text style={[styles.macroValue, { color: m.color }]}>{m.value}g</Text>
            <Text style={styles.macroLabel}>{m.label}</Text>
            <Text style={styles.macroPct}>
              {Math.round((m.value * (m.label === 'Fat' ? 9 : 4) / macroTotal) * 100)}%
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.ctaBtn} onPress={handleStart} activeOpacity={0.85}>
        <Text style={styles.ctaBtnText}>Enter Dashboard</Text>
        <Ionicons name="arrow-forward" size={18} color={Colors.bg} />
      </TouchableOpacity>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingTop: 60, paddingBottom: 40 },

  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.bgElevated },
  progressDone: { backgroundColor: Colors.gold },
  progressLine: { flex: 1, height: 1.5, backgroundColor: Colors.border, marginHorizontal: 6 },
  progressLineDone: { backgroundColor: Colors.gold },

  stepLabel: {
    fontSize: 10, color: Colors.gold, fontWeight: '800',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6,
  },
  header: { marginBottom: Spacing.md },
  greeting: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.8 },
  name: { fontSize: FontSizes.xxl, fontWeight: '900', color: Colors.textPrimary },

  bmiCard: {
    marginBottom: Spacing.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  bmiLabel: { fontSize: 10, color: Colors.textSecondary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  bmiValue: { fontSize: 44, fontWeight: '900', color: Colors.gold, lineHeight: 48 },
  bmiCategory: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600', marginTop: 2 },
  bmiStats: { alignItems: 'flex-end' },
  bmiSmall: { fontSize: FontSizes.xs, color: Colors.textMuted, marginBottom: 2 },

  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  statCard: {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  statIconContainer: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.goldGlow, alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.textPrimary },
  statUnit: { fontSize: 10, color: Colors.textMuted },
  statLabel: { fontSize: 9, color: Colors.textSecondary, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },

  targetCard: {
    marginBottom: Spacing.md,
  },
  targetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  targetLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  goalBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.borderGold,
    backgroundColor: Colors.goldGlow,
  },
  goalBadgeText: { fontSize: 9, fontWeight: '800', color: Colors.gold, letterSpacing: 0.8 },
  targetValue: { fontSize: 48, fontWeight: '900', color: Colors.gold, lineHeight: 54 },
  targetUnit: { fontSize: FontSizes.lg, fontWeight: '400', color: Colors.textSecondary },
  offsetNote: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 4 },

  sectionTitle: {
    fontSize: 10, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10,
  },
  macroRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.xl },
  macroCard: {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  macroIconContainer: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  macroValue: { fontSize: FontSizes.md, fontWeight: '800' },
  macroLabel: { fontSize: 9, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  macroPct: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.gold, paddingVertical: 16,
    borderRadius: Radii.full, gap: 8, ...Shadows.gold,
  },
  ctaBtnText: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.bg, letterSpacing: 0.5 },
});
