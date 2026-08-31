import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii } from '../theme';
import useAppStore from '../store/useAppStore';
import { getMealPlan } from '../data/mealPlans';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

const DIET_PREFS = [
  { value: 'nonveg', label: 'Standard', icon: 'restaurant-outline' },
  { value: 'veg', label: 'Vegetarian', icon: 'leaf-outline' },
  { value: 'vegan', label: 'Vegan', icon: 'flower-outline' },
  { value: 'keto', label: 'Keto', icon: 'flame-outline' },
];

const MEAL_SLOTS = [
  { key: 'breakfast', label: 'Breakfast', icon: 'sunny-outline', time: '7:00 – 9:00 AM' },
  { key: 'lunch', label: 'Lunch', icon: 'time-outline', time: '12:00 – 1:30 PM' },
  { key: 'dinner', label: 'Dinner', icon: 'moon-outline', time: '7:00 – 8:30 PM' },
  { key: 'snack', label: 'Target Snack', icon: 'cafe-outline', time: 'Between meals' },
];

const GOAL_LABELS = { bulk: 'Hypertrophy Surplus', cut: 'Shredding Deficit', maintain: 'Maintenance Balance' };

export default function DietScreen() {
  const { profile, nutrition } = useAppStore();
  const [dietFilter, setDietFilter] = useState(profile.dietPref || 'nonveg');
  const [expanded, setExpanded] = useState(null);

  const plan = getMealPlan(profile.goal || 'maintain', dietFilter);

  const totalCals = MEAL_SLOTS.reduce((sum, slot) => sum + (plan[slot.key]?.calories || 0), 0);
  const totalP = MEAL_SLOTS.reduce((sum, slot) => sum + (plan[slot.key]?.protein || 0), 0);
  const totalC = MEAL_SLOTS.reduce((sum, slot) => sum + (plan[slot.key]?.carbs || 0), 0);
  const totalF = MEAL_SLOTS.reduce((sum, slot) => sum + (plan[slot.key]?.fat || 0), 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Nutrition Protocol</Text>
          <Text style={styles.subtitle}>Curated macro targets & whole-food meal design</Text>
        </View>
        <View style={styles.goalBadge}>
          <Text style={styles.goalBadgeText}>
            {GOAL_LABELS[profile.goal] || 'Maintenance'}
          </Text>
        </View>
      </View>

      {/* Diet Filter Tabs */}
      <View style={styles.filterRow}>
        {DIET_PREFS.map((d) => {
          const isActive = dietFilter === d.value;
          return (
            <TouchableOpacity
              key={d.value}
              style={[styles.filterBtn, isActive && styles.filterBtnActive]}
              onPress={() => setDietFilter(d.value)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={d.icon}
                size={14}
                color={isActive ? Colors.gold : Colors.textMuted}
              />
              <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Daily Totals Card */}
      <Card style={styles.totalCard} highlighted>
        <Text style={styles.totalTitle}>DAILY PLANNED TOTALS</Text>
        <View style={styles.totalRow}>
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: Colors.gold }]}>{totalCals}</Text>
            <Text style={styles.totalLabel}>kcal</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: Colors.textPrimary }]}>{totalP}g</Text>
            <Text style={styles.totalLabel}>Protein</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: Colors.textSecondary }]}>{totalC}g</Text>
            <Text style={styles.totalLabel}>Carbs</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalItem}>
            <Text style={[styles.totalValue, { color: Colors.textMuted }]}>{totalF}g</Text>
            <Text style={styles.totalLabel}>Fat</Text>
          </View>
        </View>
        {nutrition.targetCalories > 0 && (
          <View style={styles.targetHint}>
            <Text style={styles.targetHintText}>
              Target: {nutrition.targetCalories} kcal ·{' '}
              {Math.abs(totalCals - nutrition.targetCalories) < 100
                ? 'Aligned with target'
                : totalCals < nutrition.targetCalories
                  ? `${nutrition.targetCalories - totalCals} kcal below target`
                  : `${totalCals - nutrition.targetCalories} kcal above target`}
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
                  <Ionicons name={slot.icon} size={18} color={Colors.gold} />
                </View>
                <View style={styles.mealMeta}>
                  <Text style={styles.mealSlotLabel}>{slot.label}</Text>
                  <Text style={styles.mealTime}>{slot.time}</Text>
                </View>
                <View style={styles.mealCalsContainer}>
                  <Text style={styles.mealCals}>{meal.calories}</Text>
                  <Text style={styles.mealCalsUnit}>kcal</Text>
                </View>
              </View>

              <View style={styles.mealNameRow}>
                <View style={styles.mealBullet} />
                <Text style={styles.mealName}>{meal.name}</Text>
              </View>

              {isExpanded && (
                <View style={styles.mealExpanded}>
                  <Text style={styles.mealDesc}>{meal.description}</Text>
                  <View style={styles.mealMacroRow}>
                    {[
                      { label: 'Protein', val: meal.protein, color: Colors.gold },
                      { label: 'Carbs', val: meal.carbs, color: Colors.textPrimary },
                      { label: 'Fat', val: meal.fat, color: Colors.textSecondary },
                    ].map((m) => (
                      <View key={m.label} style={styles.mealMacroPill}>
                        <Text style={[styles.mealMacroVal, { color: m.color }]}>{m.val}g</Text>
                        <Text style={styles.mealMacroLabel}>{m.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <Text style={styles.expandHint}>{isExpanded ? 'Collapse' : 'Details'}</Text>
            </Card>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.md, paddingTop: 60, paddingBottom: 32 },

  header: { marginBottom: Spacing.md },
  title: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginTop: 2, marginBottom: 8 },
  goalBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: Radii.full, borderWidth: 1, borderColor: Colors.borderGold,
    backgroundColor: Colors.goldGlow, alignSelf: 'flex-start',
  },
  goalBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.gold, letterSpacing: 0.5, textTransform: 'uppercase' },

  filterRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  filterBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    paddingVertical: 10, paddingHorizontal: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  filterBtnActive: { borderColor: Colors.borderGold, backgroundColor: Colors.goldGlow },
  filterLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600' },
  filterLabelActive: { color: Colors.gold, fontWeight: '700' },

  totalCard: { marginBottom: Spacing.md },
  totalTitle: {
    fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textSecondary,
    marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  totalItem: { alignItems: 'center' },
  totalValue: { fontSize: FontSizes.xl, fontWeight: '800' },
  totalLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2, textTransform: 'uppercase' },
  totalDivider: { width: 1, height: 28, backgroundColor: Colors.border },
  targetHint: {
    marginTop: 12, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  targetHintText: { fontSize: FontSizes.xs, color: Colors.textSecondary, textAlign: 'center' },

  mealCard: { marginBottom: 10 },
  mealHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  mealIconContainer: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.goldGlow, alignItems: 'center', justifyContent: 'center',
    marginRight: 10, borderWidth: 1, borderColor: Colors.borderGold,
  },
  mealMeta: { flex: 1 },
  mealSlotLabel: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textPrimary },
  mealTime: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 1 },
  mealCalsContainer: { alignItems: 'flex-end' },
  mealCals: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.gold },
  mealCalsUnit: { fontSize: 10, color: Colors.textMuted },

  mealNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  mealBullet: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.gold },
  mealName: { flex: 1, fontSize: FontSizes.sm, fontWeight: '600', color: Colors.textPrimary },

  mealExpanded: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  mealDesc: { fontSize: FontSizes.xs, color: Colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  mealMacroRow: { flexDirection: 'row', gap: 8 },
  mealMacroPill: {
    flex: 1, backgroundColor: Colors.bgElevated,
    borderRadius: Radii.sm, padding: 8, alignItems: 'center',
  },
  mealMacroVal: { fontSize: FontSizes.sm, fontWeight: '800' },
  mealMacroLabel: { fontSize: 9, color: Colors.textMuted, marginTop: 2, textTransform: 'uppercase' },

  expandHint: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', marginTop: 8, letterSpacing: 0.5, textTransform: 'uppercase' },
});
