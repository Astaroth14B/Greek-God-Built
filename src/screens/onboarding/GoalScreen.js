import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../../theme';
import useAppStore from '../../store/useAppStore';
import { ACTIVITY_LABELS } from '../../utils/nutrition';
import { Ionicons } from '@expo/vector-icons';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', icon: 'bed-outline' },
  { value: 'light', icon: 'walk-outline' },
  { value: 'moderate', icon: 'barbell-outline' },
  { value: 'active', icon: 'fitness-outline' },
  { value: 'veryActive', icon: 'trophy-outline' },
];

const GOALS = [
  {
    value: 'bulk',
    label: 'Hypertrophy Surplus',
    desc: 'Lean mass accrual with controlled caloric surplus',
    icon: 'trending-up-outline',
  },
  {
    value: 'cut',
    label: 'Fat Loss & Definition',
    desc: 'Metabolic fat reduction while preserving lean mass',
    icon: 'flame-outline',
  },
  {
    value: 'maintain',
    label: 'Performance Maintenance',
    desc: 'Body recomposition and athletic work capacity',
    icon: 'shield-outline',
  },
];

const DIET_PREFS = [
  { value: 'nonveg', label: 'Standard', icon: 'restaurant-outline' },
  { value: 'veg', label: 'Vegetarian', icon: 'leaf-outline' },
  { value: 'vegan', label: 'Vegan', icon: 'flower-outline' },
  { value: 'keto', label: 'Keto', icon: 'flame-outline' },
];

export default function GoalScreen({ navigation }) {
  const { profile, setProfile } = useAppStore();
  const [activityLevel, setActivityLevel] = useState(profile.activityLevel || 'moderate');
  const [goal, setGoal] = useState(profile.goal || 'maintain');
  const [dietPref, setDietPref] = useState(profile.dietPref || 'nonveg');

  const handleContinue = () => {
    setProfile({ ...profile, activityLevel, goal, dietPref });
    navigation.navigate('Summary');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={[styles.progressDot, styles.progressDone]} />
        <View style={[styles.progressLine, styles.progressLineDone]} />
        <View style={[styles.progressDot, styles.progressActive]} />
        <View style={styles.progressLine} />
        <View style={styles.progressDot} />
      </View>

      <Text style={styles.stepLabel}>STEP 2 OF 3</Text>
      <Text style={styles.title}>Objective Calibration</Text>
      <Text style={styles.subtitle}>Select your physical activity level and primary training goal.</Text>

      {/* Activity Level */}
      <Text style={styles.sectionTitle}>DAILY EXPENDITURE / ACTIVITY</Text>
      {ACTIVITY_LEVELS.map((item) => {
        const isSelected = activityLevel === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.listItem, isSelected && styles.listItemActive]}
            onPress={() => setActivityLevel(item.value)}
            activeOpacity={0.8}
          >
            <View style={[styles.listItemIconBg, isSelected && styles.listItemIconBgActive]}>
              <Ionicons
                name={item.icon}
                size={16}
                color={isSelected ? Colors.gold : Colors.textSecondary}
              />
            </View>
            <Text style={[styles.listItemText, isSelected && styles.listItemTextActive]}>
              {ACTIVITY_LABELS[item.value]}
            </Text>
            {isSelected && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark" size={12} color={Colors.bg} />
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Goal */}
      <Text style={styles.sectionTitle}>TRAINING OBJECTIVE</Text>
      <View style={styles.goalGrid}>
        {GOALS.map((g) => {
          const isSelected = goal === g.value;
          return (
            <TouchableOpacity
              key={g.value}
              style={[
                styles.goalCard,
                isSelected && styles.goalCardActive,
              ]}
              onPress={() => setGoal(g.value)}
              activeOpacity={0.8}
            >
              <View style={styles.goalHeaderRow}>
                <View style={[styles.goalIconContainer, isSelected && styles.goalIconContainerActive]}>
                  <Ionicons name={g.icon} size={16} color={isSelected ? Colors.gold : Colors.textSecondary} />
                </View>
                <Text style={[styles.goalLabel, isSelected && styles.goalLabelActive]}>
                  {g.label}
                </Text>
              </View>
              <Text style={styles.goalDesc}>{g.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Diet Preference */}
      <Text style={styles.sectionTitle}>NUTRITION REGIMEN</Text>
      <View style={styles.dietRow}>
        {DIET_PREFS.map((d) => {
          const isSelected = dietPref === d.value;
          return (
            <TouchableOpacity
              key={d.value}
              style={[styles.dietBtn, isSelected && styles.dietBtnActive]}
              onPress={() => setDietPref(d.value)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={d.icon}
                size={16}
                color={isSelected ? Colors.gold : Colors.textSecondary}
              />
              <Text style={[styles.dietLabel, isSelected && styles.dietLabelActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleContinue} activeOpacity={0.85}>
        <Text style={styles.nextBtnText}>Calculate Nutrition Protocol</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.bg} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingTop: 60, paddingBottom: 40 },

  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  progressDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.bgElevated, borderWidth: 1, borderColor: Colors.border,
  },
  progressDone: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  progressActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  progressLine: { flex: 1, height: 1.5, backgroundColor: Colors.border, marginHorizontal: 6 },
  progressLineDone: { backgroundColor: Colors.gold },

  stepLabel: {
    fontSize: 10, color: Colors.gold, fontWeight: '800',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6,
  },
  title: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginBottom: Spacing.xl, lineHeight: 18 },
  sectionTitle: {
    fontSize: 10, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, marginTop: Spacing.md,
  },

  listItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    padding: 12, marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
  },
  listItemActive: { borderColor: Colors.borderGold, backgroundColor: '#17171F' },
  listItemIconBg: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  listItemIconBgActive: {
    backgroundColor: Colors.goldGlow,
  },
  listItemText: { flex: 1, fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600' },
  listItemTextActive: { color: Colors.textPrimary, fontWeight: '700' },
  checkmark: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center',
  },

  goalGrid: { gap: 10, marginBottom: Spacing.sm },
  goalCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    padding: 14, borderWidth: 1, borderColor: Colors.border,
  },
  goalCardActive: {
    borderColor: Colors.borderGold, backgroundColor: '#17171F',
  },
  goalHeaderRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4,
  },
  goalIconContainer: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center',
  },
  goalIconContainerActive: {
    backgroundColor: Colors.goldGlow,
  },
  goalLabel: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.textPrimary },
  goalLabelActive: { color: Colors.gold },
  goalDesc: { fontSize: FontSizes.xs, color: Colors.textSecondary, lineHeight: 18, paddingLeft: 38 },

  dietRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.sm },
  dietBtn: {
    flex: 1, minWidth: '47%', backgroundColor: Colors.bgCard,
    borderRadius: Radii.md, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, gap: 6,
  },
  dietBtnActive: { borderColor: Colors.borderGold, backgroundColor: Colors.goldGlow },
  dietLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600' },
  dietLabelActive: { color: Colors.gold, fontWeight: '700' },

  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.gold, paddingVertical: 16,
    borderRadius: Radii.full, gap: 8,
    marginTop: Spacing.lg, ...Shadows.gold,
  },
  nextBtnText: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.bg, letterSpacing: 0.5 },
});
