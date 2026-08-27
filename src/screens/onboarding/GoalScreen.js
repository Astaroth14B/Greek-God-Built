import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../../theme';
import useAppStore from '../../store/useAppStore';
import { ACTIVITY_LABELS } from '../../utils/nutrition';

const ACTIVITY_LEVELS = [
  { value: 'sedentary', icon: '🛋️' },
  { value: 'light', icon: '🚶' },
  { value: 'moderate', icon: '🏋️' },
  { value: 'active', icon: '🏃' },
  { value: 'veryActive', icon: '🏆' },
];

const GOALS = [
  {
    value: 'bulk',
    label: 'Bulk Up',
    desc: 'Build muscle mass with a caloric surplus',
    icon: '💪',
    color: Colors.green,
  },
  {
    value: 'cut',
    label: 'Cut & Shred',
    desc: 'Lose fat while preserving muscle',
    icon: '🔥',
    color: Colors.orange,
  },
  {
    value: 'maintain',
    label: 'Maintain',
    desc: 'Stay at your current weight and improve performance',
    icon: '⚖️',
    color: Colors.accent,
  },
];

const DIET_PREFS = [
  { value: 'nonveg', label: 'Non-Veg', icon: '🥩' },
  { value: 'veg', label: 'Vegetarian', icon: '🥗' },
  { value: 'vegan', label: 'Vegan', icon: '🌱' },
  { value: 'keto', label: 'Keto', icon: '🥑' },
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

      <Text style={styles.stepLabel}>Step 2 of 3</Text>
      <Text style={styles.title}>Your Goals</Text>
      <Text style={styles.subtitle}>How active are you and what's your mission?</Text>

      {/* Activity Level */}
      <Text style={styles.sectionTitle}>Activity Level</Text>
      {ACTIVITY_LEVELS.map((item) => (
        <TouchableOpacity
          key={item.value}
          style={[styles.listItem, activityLevel === item.value && styles.listItemActive]}
          onPress={() => setActivityLevel(item.value)}
        >
          <Text style={styles.listItemIcon}>{item.icon}</Text>
          <Text style={[styles.listItemText, activityLevel === item.value && styles.listItemTextActive]}>
            {ACTIVITY_LABELS[item.value]}
          </Text>
          {activityLevel === item.value && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      {/* Goal */}
      <Text style={styles.sectionTitle}>Your Goal</Text>
      <View style={styles.goalGrid}>
        {GOALS.map((g) => (
          <TouchableOpacity
            key={g.value}
            style={[
              styles.goalCard,
              goal === g.value && { borderColor: g.color, backgroundColor: `${g.color}18` },
            ]}
            onPress={() => setGoal(g.value)}
          >
            <Text style={styles.goalIcon}>{g.icon}</Text>
            <Text style={[styles.goalLabel, goal === g.value && { color: g.color }]}>
              {g.label}
            </Text>
            <Text style={styles.goalDesc}>{g.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Diet Preference */}
      <Text style={styles.sectionTitle}>Dietary Preference</Text>
      <View style={styles.dietRow}>
        {DIET_PREFS.map((d) => (
          <TouchableOpacity
            key={d.value}
            style={[styles.dietBtn, dietPref === d.value && styles.dietBtnActive]}
            onPress={() => setDietPref(d.value)}
          >
            <Text style={styles.dietIcon}>{d.icon}</Text>
            <Text style={[styles.dietLabel, dietPref === d.value && styles.dietLabelActive]}>
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={handleContinue}>
        <Text style={styles.nextBtnText}>See My Plan →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingTop: 60 },

  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  progressDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.bgElevated, borderWidth: 1, borderColor: Colors.border,
  },
  progressDone: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  progressActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  progressLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginHorizontal: 4 },
  progressLineDone: { backgroundColor: Colors.accent },

  stepLabel: {
    fontSize: FontSizes.xs, color: Colors.accent, fontWeight: '700',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8,
  },
  title: { fontSize: FontSizes.xxxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: FontSizes.md, color: Colors.textSecondary, marginBottom: Spacing.xl },
  sectionTitle: {
    fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: Spacing.md,
  },

  listItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
  },
  listItemActive: { borderColor: Colors.accent, backgroundColor: Colors.accentGlow },
  listItemIcon: { fontSize: 22, marginRight: 12 },
  listItemText: { flex: 1, fontSize: FontSizes.md, color: Colors.textSecondary, fontWeight: '500' },
  listItemTextActive: { color: Colors.textPrimary },
  checkmark: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  checkmarkText: { fontSize: 13, color: Colors.bg, fontWeight: '800' },

  goalGrid: { gap: 10, marginBottom: Spacing.sm },
  goalCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radii.lg,
    padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.border,
  },
  goalIcon: { fontSize: 28, marginBottom: 6 },
  goalLabel: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  goalDesc: { fontSize: FontSizes.sm, color: Colors.textSecondary },

  dietRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: Spacing.sm },
  dietBtn: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.bgCard,
    borderRadius: Radii.md, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  dietBtnActive: { borderColor: Colors.accent, backgroundColor: Colors.accentGlow },
  dietIcon: { fontSize: 24, marginBottom: 4 },
  dietLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary, fontWeight: '600' },
  dietLabelActive: { color: Colors.accent },

  nextBtn: {
    backgroundColor: Colors.accent, paddingVertical: 16,
    borderRadius: Radii.full, alignItems: 'center',
    marginTop: Spacing.lg, ...Shadows.accent,
  },
  nextBtnText: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.bg },
});
