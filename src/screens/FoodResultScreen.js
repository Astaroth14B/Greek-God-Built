import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { mockRecognizeFood } from '../data/mockFoods';
import useAppStore from '../store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';

export default function FoodResultScreen({ navigation }) {
  const [food, setFood] = useState(null);
  const [editingCals, setEditingCals] = useState('');
  const [editingName, setEditingName] = useState('');
  const [editing, setEditing] = useState(false);
  const { addFoodEntry, incrementStreak } = useAppStore();

  useEffect(() => {
    const result = mockRecognizeFood();
    setFood(result);
    setEditingCals(String(result.calories));
    setEditingName(result.name);
  }, []);

  const handleConfirm = () => {
    if (!food) return;
    addFoodEntry({
      ...food,
      name: editingName || food.name,
      calories: parseInt(editingCals) || food.calories,
    });
    incrementStreak();
    navigation.navigate('LogTab');
  };

  const handleRetake = () => {
    navigation.replace('FoodCamera');
  };

  if (!food) return (
    <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
      <Text style={{ color: Colors.textPrimary }}>Analyzing nutrition...</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* AI Badge */}
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={13} color={Colors.gold} />
          <Text style={styles.aiBadgeText}>AI NUTRITION ANALYSIS</Text>
        </View>

        {/* Food Name & Category Card */}
        <Card style={styles.foodCard} highlighted>
          <View style={styles.foodIconContainer}>
            <Ionicons name="restaurant-outline" size={28} color={Colors.gold} />
          </View>

          {editing ? (
            <TextInput
              style={styles.nameInput}
              value={editingName}
              onChangeText={setEditingName}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setEditing(true)} activeOpacity={0.7}>
              <Text style={styles.foodName}>{editingName}</Text>
              <Text style={styles.editHint}>Tap to modify name</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.serving}>{food.serving} · {food.category || 'Whole Food'}</Text>
        </Card>

        {/* Calorie Highlight */}
        <Card style={styles.calsCard}>
          <Text style={styles.calsLabel}>CALORIC VALUE</Text>
          <View style={styles.calsRow}>
            {editing ? (
              <TextInput
                style={styles.calsInput}
                value={editingCals}
                onChangeText={setEditingCals}
                keyboardType="numeric"
                maxLength={4}
              />
            ) : (
              <Text style={styles.calsValue}>{editingCals}</Text>
            )}
            <Text style={styles.calsUnit}>kcal</Text>
          </View>
          {!editing && (
            <TouchableOpacity onPress={() => setEditing(true)} style={styles.editCalsBtn}>
              <Ionicons name="pencil-outline" size={12} color={Colors.gold} />
              <Text style={styles.editCalsBtnText}>Adjust Calories</Text>
            </TouchableOpacity>
          )}
          {editing && (
            <TouchableOpacity onPress={() => setEditing(false)} style={styles.doneCalsBtn}>
              <Text style={styles.doneCalsText}>Done</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Macro Breakdown */}
        <View style={styles.macroGrid}>
          {[
            { label: 'Protein', val: food.protein, color: Colors.gold, icon: 'fitness-outline' },
            { label: 'Carbs', val: food.carbs, color: Colors.textPrimary, icon: 'nutrition-outline' },
            { label: 'Healthy Fat', val: food.fat, color: Colors.textSecondary, icon: 'shield-checkmark-outline' },
          ].map((m) => (
            <View key={m.label} style={styles.macroCard}>
              <View style={styles.macroIconContainer}>
                <Ionicons name={m.icon} size={14} color={m.color} />
              </View>
              <Text style={[styles.macroVal, { color: m.color }]}>{m.val}g</Text>
              <Text style={styles.macroLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* Confidence Indicator */}
        <Card style={styles.confidenceCard}>
          <View style={styles.confRow}>
            <Text style={styles.confLabel}>Vision AI Match Accuracy</Text>
            <Text style={styles.confValue}>89%</Text>
          </View>
          <View style={styles.confTrack}>
            <View style={[styles.confFill, { width: '89%' }]} />
          </View>
          <Text style={styles.confNote}>
            Portion estimates are calculated based on standard volumetric density.
          </Text>
        </Card>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
          <Ionicons name="checkmark" size={20} color={Colors.bg} />
          <Text style={styles.confirmBtnText}>Add Meal to Daily Log</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.retakeBtn} onPress={handleRetake} activeOpacity={0.8}>
          <Ionicons name="camera-reverse-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.retakeBtnText}>Retake Photo</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.md, paddingTop: 60, paddingBottom: 40 },

  aiBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'center', marginBottom: Spacing.md,
    backgroundColor: Colors.goldGlow, borderRadius: Radii.full,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  aiBadgeText: {
    fontSize: 10, color: Colors.gold,
    fontWeight: '800', letterSpacing: 1.2,
  },

  foodCard: {
    alignItems: 'center', marginBottom: Spacing.md, paddingVertical: 20,
  },
  foodIconContainer: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.goldGlow,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, borderWidth: 1, borderColor: Colors.borderGold,
  },
  foodName: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  editHint: { fontSize: 10, color: Colors.gold, textAlign: 'center', marginTop: 4, letterSpacing: 0.5 },
  nameInput: {
    fontSize: FontSizes.xl, fontWeight: '800', color: Colors.gold,
    borderBottomWidth: 1.5, borderBottomColor: Colors.gold,
    textAlign: 'center', minWidth: 200, marginBottom: 4,
  },
  serving: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 4 },

  calsCard: {
    alignItems: 'center', marginBottom: Spacing.md, paddingVertical: 20,
  },
  calsLabel: {
    fontSize: 10, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4,
  },
  calsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  calsValue: { fontSize: 54, fontWeight: '900', color: Colors.gold, lineHeight: 60 },
  calsInput: {
    fontSize: 54, fontWeight: '900', color: Colors.gold,
    borderBottomWidth: 1.5, borderBottomColor: Colors.gold,
    textAlign: 'center', minWidth: 120,
  },
  calsUnit: { fontSize: FontSizes.sm, color: Colors.textMuted, marginBottom: 10 },
  editCalsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 6, paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: Colors.bgElevated, borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.border,
  },
  editCalsBtnText: { fontSize: 10, color: Colors.gold, fontWeight: '700' },
  doneCalsBtn: {
    marginTop: 8, paddingHorizontal: 14, paddingVertical: 5,
    backgroundColor: Colors.goldGlow, borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  doneCalsText: { fontSize: FontSizes.xs, color: Colors.gold, fontWeight: '700' },

  macroGrid: { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  macroCard: {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  macroIconContainer: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.bgElevated, alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  macroVal: { fontSize: FontSizes.lg, fontWeight: '800' },
  macroLabel: {
    fontSize: 9, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2,
  },

  confidenceCard: { marginBottom: Spacing.lg },
  confRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  confLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600' },
  confValue: { fontSize: FontSizes.xs, fontWeight: '800', color: Colors.gold },
  confTrack: {
    height: 4, backgroundColor: Colors.bgElevated,
    borderRadius: Radii.full, marginBottom: 8, overflow: 'hidden',
  },
  confFill: { height: '100%', backgroundColor: Colors.gold, borderRadius: Radii.full },
  confNote: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },

  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.gold, paddingVertical: 16,
    borderRadius: Radii.full, gap: 8, marginBottom: 10, ...Shadows.gold,
  },
  confirmBtnText: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.bg, letterSpacing: 0.5 },
  retakeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, gap: 6,
  },
  retakeBtnText: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600' },
});
