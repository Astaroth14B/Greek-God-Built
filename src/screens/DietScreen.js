import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import useAppStore from '../store/useAppStore';
import { getMealPlan } from '../data/mealPlans';
import Card from '../components/Card';

const DIET_PREFS = [
  { value: 'nonveg', label: 'Non-Veg', icon: '🥩' },
  { value: 'veg', label: 'Vegetarian', icon: '🥗' },
  { value: 'vegan', label: 'Vegan', icon: '🌱' },
  { value: 'keto', label: 'Keto', icon: '🥑' },
];

const MEAL_SLOTS = [
  { key: 'breakfast', label: 'Breakfast', icon: '🌅', time: '7:00 – 9:00 AM' },
  { key: 'lunch', label: 'Lunch', icon: '☀️', time: '12:00 – 1:30 PM' },
  { key: 'dinner', label: 'Dinner', icon: '🌙', time: '7:00 – 8:30 PM' },
  { key: 'snack', label: 'Snack', icon: '⚡', time: 'Between meals' },
];

const GOAL_LABELS = { bulk: 'Bulk', cut: 'Cut', maintain: 'Maintain' };
const GOAL_COLORS = { bulk: Colors.green, cut: Colors.orange, maintain: Colors.accent };

export default function DietScreen() {
  const { profile, nutrition } = useAppStore();
  const [dietFilter, setDietFilter] = useState(profile.dietPref || 'nonveg');
  const [expanded, setExpanded] = useState(null);

  const plan = getMealPlan(profile.goal || 'maintain', dietFilter);
  const goalColor = GOAL_COLORS[profile.goal] || Colors.accent;

  const totalCals = MEAL_SLOTS.reduce((sum, slot) => sum + (plan[slot.key]?.calories || 0), 0);
  const totalP = MEAL_SLOTS.reduce((sum, slot) => sum + (plan[slot.key]?.protein || 0), 0);
  const totalC = MEAL_SLOTS.reduce((sum, slot) => sum + (plan[slot.key]?.carbs || 0), 0);
  const totalF = MEAL_SLOTS.reduce((sum, slot) => sum + (plan[slot.key]?.fat || 0), 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Diet Plan</Text>
        <View style={[styles.goalBadge, { backgroundColor: goalColor + '20', borderColor: goalColor + '55' }]}>
          <Text style={[styles.goalBadgeText, { color: goalColor }]}>
            {GOAL_LABELS[profile.goal] || 'Maintain'} Goal
          </Text>
        </View>
      </View>

      {/* Diet Filter */}
      <View style={styles.filterRow}>
        {DIET_PREFS.map((d) => (
          <TouchableOpacity
            key={d.value}
            style={[styles.filterBtn, dietFilter === d.value && styles.filterBtnActive]}
            onPress={() => setDietFilter(d.value)}
          >
            <Text style={styles.filterIcon}>{d.icon}</Text>
            <Text style={[styles.filterLabel, dietFilter === d.value && styles.filterLabelActive]}>
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Day Total */}
      <Card style={[styles.totalCard, { borderColor: goalColor + '44' }]}>
        <Text style={styles.totalTitle}>Daily Totals</Text>
        <View style={styles.totalRow}>
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: goalColor }]}>{totalCals}</Text>
            <Text style={styles.totalLabel}>kcal</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: Colors.accent }]}>{totalP}g</Text>
            <Text style={styles.totalLabel}>Protein</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: Colors.purple }]}>{totalC}g</Text>
            <Text style={styles.totalLabel}>Carbs</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: Colors.orange }]}>{totalF}g</Text>
            <Text style={styles.totalLabel}>Fat</Text>
          </View>
        </View>
        {nutrition.targetCalories > 0 && (
          <View style={styles.targetHint}>
            <Text style={styles.targetHintText}>
              Your target: {nutrition.targetCalories} kcal
              {' '}·{' '}
              {Math.abs(totalCals - nutrition.targetCalories) < 100
                ? '✅ Perfect match!'
                : totalCals < nutrition.targetCalories
                  ? `⬆️ ${nutrition.targetCalories - totalCals} kcal under`
                  : `⬇️ ${totalCals - nutrition.targetCalories} kcal over`}
            </Text>
          </View>
        )}
      </Card>

      {/* Meal Cards */}
      {MEAL_SLOTS.map((slot) => {
        const meal = plan[slot.key];
        const isExpanded = expanded === slot.key;
        if (!meal) return null;
        return (
          <TouchableOpacity
            key={slot.key}
            onPress={() => setExpanded(isExpanded ? null : slot.key)}
            activeOpacity={0.85}
          >
            <Card style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <View style={styles.mealIconContainer}>
                  <Text style={styles.mealSlotIcon}>{slot.icon}</Text>
                </View>
                <View style={styles.mealMeta}>
                  <Text style={styles.mealSlotLabel}>{slot.label}</Text>
                  <Text style={styles.mealTime}>{slot.time}</Text>
                </View>
                <View style={styles.mealCalsContainer}>
                  <Text style={[styles.mealCals, { color: goalColor }]}>{meal.calories}</Text>
                  <Text style={styles.mealCalsUnit}>kcal</Text>
                </View>
              </View>

              <View style={styles.mealNameRow}>
                <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                <Text style={styles.mealName}>{meal.name}</Text>
              </View>

              {isExpanded && (
                <View style={styles.mealExpanded}>
                  <Text style={styles.mealDesc}>{meal.description}</Text>
                  <View style={styles.mealMacroRow}>
                    {[
                      { label: 'Protein', val: meal.protein, color: Colors.accent },
                      { label: 'Carbs', val: meal.carbs, color: Colors.purple },
                      { label: 'Fat', val: meal.fat, color: Colors.orange },
                    ].map((m) => (
                      <View key={m.label} style={styles.mealMacroPill}>
                        <Text style={[styles.mealMacroVal, { color: m.color }]}>{m.val}g</Text>
                        <Text style={styles.mealMacroLabel}>{m.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <Text style={styles.expandHint}>{isExpanded ? '▲ Tap to collapse' : '▼ Tap for details'}</Text>
            </Card>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.md, paddingTop: 60, paddingBottom: 40 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  title: { fontSize: FontSizes.xxxl, fontWeight: '900', color: Colors.textPrimary },
  goalBadge: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: Radii.full, borderWidth: 1,
  },
  goalBadgeText: { fontSize: FontSizes.xs, fontWeight: '800', letterSpacing: 0.8 },

  filterRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md, flexWrap: 'wrap' },
  filterBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    paddingVertical: 10, paddingHorizontal: 8,
    borderWidth: 1, borderColor: Colors.border, minWidth: '22%',
  },
  filterBtnActive: { borderColor: Colors.accent, backgroundColor: Colors.accentGlow },
  filterIcon: { fontSize: 16 },
  filterLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600' },
  filterLabelActive: { color: Colors.accent },

  totalCard: { marginBottom: Spacing.md },
  totalTitle: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  totalItem: { alignItems: 'center' },
  totalValue: { fontSize: FontSizes.xl, fontWeight: '800' },
  totalLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  totalDivider: { width: 1, height: 30, backgroundColor: Colors.border },
  targetHint: {
    marginTop: 10, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  targetHintText: { fontSize: FontSizes.xs, color: Colors.textSecondary, textAlign: 'center' },

  mealCard: { marginBottom: 10 },
  mealHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  mealIconContainer: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  mealSlotIcon: { fontSize: 20 },
  mealMeta: { flex: 1 },
  mealSlotLabel: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary },
  mealTime: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  mealCalsContainer: { alignItems: 'flex-end' },
  mealCals: { fontSize: FontSizes.xl, fontWeight: '800' },
  mealCalsUnit: { fontSize: FontSizes.xs, color: Colors.textMuted },

  mealNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mealEmoji: { fontSize: 22 },
  mealName: { flex: 1, fontSize: FontSizes.md, fontWeight: '600', color: Colors.textPrimary },

  mealExpanded: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.border },
  mealDesc: { fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: 10 },
  mealMacroRow: { flexDirection: 'row', gap: 8 },
  mealMacroPill: {
    flex: 1, backgroundColor: Colors.bgElevated,
    borderRadius: Radii.sm, padding: 8, alignItems: 'center',
  },
  mealMacroVal: { fontSize: FontSizes.md, fontWeight: '800' },
  mealMacroLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },

  expandHint: { fontSize: FontSizes.xs, color: Colors.textMuted, textAlign: 'center', marginTop: 8 },
});
