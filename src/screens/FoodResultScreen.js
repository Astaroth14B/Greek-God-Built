import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { mockRecognizeFood } from '../data/mockFoods';
import useAppStore from '../store/useAppStore';
import { Ionicons } from '@expo/vector-icons';

export default function FoodResultScreen({ navigation }) {
  // MOCK: replace with real model inference - in production, receive photo URI and run vision model
  const [food, setFood] = useState(null);
  const [editingCals, setEditingCals] = useState('');
  const [editingName, setEditingName] = useState('');
  const [editing, setEditing] = useState(false);
  const { addFoodEntry, incrementStreak } = useAppStore();

  useEffect(() => {
    // MOCK: randomly pick a food from local lookup
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
      <Text style={{ color: Colors.textPrimary }}>Loading...</Text>
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
          <Ionicons name="flash" size={14} color={Colors.accent} />
          <Text style={styles.aiBadgeText}>AI ANALYSIS COMPLETE • MOCK</Text>
        </View>

        {/* Food Card */}
        <View style={styles.foodCard}>
          <Text style={styles.foodEmoji}>{food.emoji}</Text>

          {editing ? (
            <TextInput
              style={styles.nameInput}
              value={editingName}
              onChangeText={setEditingName}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.foodName}>{editingName}</Text>
              <Text style={styles.editHint}>✏️ Tap to edit name</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.serving}>{food.serving}</Text>
        </View>

        {/* Calorie Highlight */}
        <View style={styles.calsCard}>
          <Text style={styles.calsLabel}>Estimated Calories</Text>
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
              <Ionicons name="pencil" size={14} color={Colors.accent} />
              <Text style={styles.editCalsBtnText}>Edit</Text>
            </TouchableOpacity>
          )}
          {editing && (
            <TouchableOpacity onPress={() => setEditing(false)} style={styles.doneCalsBtn}>
              <Text style={styles.doneCalsText}>Done ✓</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Macro Breakdown */}
        <View style={styles.macroGrid}>
          {[
            { label: 'Protein', val: food.protein, color: Colors.accent, icon: '🥩' },
            { label: 'Carbs', val: food.carbs, color: Colors.purple, icon: '🍚' },
            { label: 'Fat', val: food.fat, color: Colors.orange, icon: '🥑' },
          ].map((m) => (
            <View key={m.label} style={[styles.macroCard, { borderColor: m.color + '44' }]}>
              <Text style={styles.macroIcon}>{m.icon}</Text>
              <Text style={[styles.macroVal, { color: m.color }]}>{m.val}g</Text>
              <Text style={styles.macroLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* Confidence indicator */}
        <View style={styles.confidenceCard}>
          <View style={styles.confRow}>
            <Text style={styles.confLabel}>AI Confidence</Text>
            <Text style={styles.confValue}>87%</Text>
          </View>
          <View style={styles.confTrack}>
            <View style={[styles.confFill, { width: '87%' }]} />
          </View>
          <Text style={styles.confNote}>
            Results are estimated. Edit if the portion size differs.
          </Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Ionicons name="checkmark-circle" size={22} color={Colors.bg} />
          <Text style={styles.confirmBtnText}>Add to Log</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.retakeBtn} onPress={handleRetake}>
          <Ionicons name="camera-reverse" size={18} color={Colors.textSecondary} />
          <Text style={styles.retakeBtnText}>Retake Photo</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.lg, paddingTop: 60, paddingBottom: 40 },

  aiBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'center', marginBottom: Spacing.lg,
    backgroundColor: Colors.accentGlow, borderRadius: Radii.full,
    paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.borderAccent,
  },
  aiBadgeText: {
    fontSize: FontSizes.xs, color: Colors.accent,
    fontWeight: '800', letterSpacing: 1.5,
  },

  foodCard: {
    alignItems: 'center', marginBottom: Spacing.md,
    backgroundColor: Colors.bgCard, borderRadius: Radii.xl,
    padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border,
  },
  foodEmoji: { fontSize: 72, marginBottom: 12 },
  foodName: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  editHint: { fontSize: FontSizes.xs, color: Colors.accent, textAlign: 'center', marginTop: 4 },
  nameInput: {
    fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.accent,
    borderBottomWidth: 2, borderBottomColor: Colors.accent,
    textAlign: 'center', minWidth: 200, marginBottom: 4,
  },
  serving: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: 6 },

  calsCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radii.lg, padding: Spacing.lg,
    alignItems: 'center', marginBottom: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.accent + '44', ...Shadows.accent,
  },
  calsLabel: {
    fontSize: FontSizes.xs, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8,
  },
  calsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  calsValue: { fontSize: 64, fontWeight: '900', color: Colors.accent, lineHeight: 72 },
  calsInput: {
    fontSize: 64, fontWeight: '900', color: Colors.accent,
    borderBottomWidth: 2, borderBottomColor: Colors.accent,
    textAlign: 'center', minWidth: 120,
  },
  calsUnit: { fontSize: FontSizes.lg, color: Colors.textSecondary, marginBottom: 10 },
  editCalsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 6, paddingHorizontal: 12, paddingVertical: 4,
    backgroundColor: Colors.accentGlow, borderRadius: Radii.full,
  },
  editCalsBtnText: { fontSize: FontSizes.xs, color: Colors.accent, fontWeight: '700' },
  doneCalsBtn: {
    marginTop: 8, paddingHorizontal: 16, paddingVertical: 6,
    backgroundColor: Colors.accentGlow, borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.borderAccent,
  },
  doneCalsText: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: '700' },

  macroGrid: { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  macroCard: {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1.5,
  },
  macroIcon: { fontSize: 22, marginBottom: 6 },
  macroVal: { fontSize: FontSizes.xl, fontWeight: '800' },
  macroLabel: {
    fontSize: FontSizes.xs, color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 3,
  },

  confidenceCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    padding: Spacing.md, marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  confRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  confLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary, fontWeight: '600' },
  confValue: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.green },
  confTrack: {
    height: 4, backgroundColor: Colors.bgElevated,
    borderRadius: Radii.full, marginBottom: 8, overflow: 'hidden',
  },
  confFill: { height: '100%', backgroundColor: Colors.green, borderRadius: Radii.full },
  confNote: { fontSize: FontSizes.xs, color: Colors.textMuted, textAlign: 'center' },

  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.accent, paddingVertical: 16,
    borderRadius: Radii.full, gap: 10, marginBottom: 12, ...Shadows.accent,
  },
  confirmBtnText: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.bg },
  retakeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, gap: 6,
  },
  retakeBtnText: { fontSize: FontSizes.md, color: Colors.textSecondary, fontWeight: '600' },
});
