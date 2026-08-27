import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, TextInput, Modal, Animated,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import useAppStore from '../store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';

export default function LogScreen({ navigation }) {
  const { dailyLog, removeFoodEntry, getConsumed, nutrition } = useAppStore();
  const consumed = getConsumed();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const handleDelete = (id, name) => {
    Alert.alert('Remove Entry', `Remove "${name}" from your log?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFoodEntry(id) },
    ]);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Food Log</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
        </View>

        {/* Daily Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            {[
              { label: 'Calories', value: Math.round(consumed.calories), target: nutrition.targetCalories, color: Colors.accent, unit: 'kcal' },
              { label: 'Protein', value: Math.round(consumed.protein), target: nutrition.macros?.protein || 150, color: Colors.accent, unit: 'g' },
              { label: 'Carbs', value: Math.round(consumed.carbs), target: nutrition.macros?.carbs || 200, color: Colors.purple, unit: 'g' },
              { label: 'Fat', value: Math.round(consumed.fat), target: nutrition.macros?.fat || 65, color: Colors.orange, unit: 'g' },
            ].map((item) => (
              <View key={item.label} style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.summaryTarget}>/{item.target}{item.unit}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Add Food Button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('FoodCamera')}
          activeOpacity={0.85}
        >
          <View style={styles.addBtnIcon}>
            <Ionicons name="camera" size={22} color={Colors.bg} />
          </View>
          <View style={styles.addBtnText}>
            <Text style={styles.addBtnTitle}>Scan Food with AI</Text>
            <Text style={styles.addBtnSub}>Take a photo to analyze calories instantly</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color={Colors.bg} />
        </TouchableOpacity>

        {/* Log List */}
        <Text style={styles.sectionTitle}>
          {dailyLog.length === 0 ? 'No entries yet' : `${dailyLog.length} entr${dailyLog.length === 1 ? 'y' : 'ies'} today`}
        </Text>

        {dailyLog.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📷</Text>
            <Text style={styles.emptyTitle}>Nothing logged yet</Text>
            <Text style={styles.emptyDesc}>Snap a photo of your meal and our AI will estimate the calories for you.</Text>
          </View>
        ) : (
          [...dailyLog].reverse().map((entry) => (
            <Card key={entry.id} style={styles.logCard}>
              <View style={styles.logRow}>
                <Text style={styles.logEmoji}>{entry.emoji || '🍽️'}</Text>
                <View style={styles.logInfo}>
                  <Text style={styles.logName}>{entry.name}</Text>
                  <Text style={styles.logServing}>{entry.serving || '1 serving'}</Text>
                  <View style={styles.macroRow}>
                    {[
                      { label: 'P', val: entry.protein, color: Colors.accent },
                      { label: 'C', val: entry.carbs, color: Colors.purple },
                      { label: 'F', val: entry.fat, color: Colors.orange },
                    ].map((m) => (
                      <View key={m.label} style={styles.macroPill}>
                        <Text style={[styles.macroLabel, { color: m.color }]}>{m.label}</Text>
                        <Text style={styles.macroVal}>{Math.round(m.val)}g</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.logRight}>
                  <Text style={styles.logCals}>{entry.calories}</Text>
                  <Text style={styles.logCalsUnit}>kcal</Text>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(entry.id, entry.name)}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.md, paddingTop: 60, paddingBottom: 40 },

  header: { marginBottom: Spacing.md },
  title: { fontSize: FontSizes.xxxl, fontWeight: '900', color: Colors.textPrimary },
  date: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 4 },

  summaryCard: { marginBottom: Spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: FontSizes.xl, fontWeight: '800' },
  summaryTarget: { fontSize: FontSizes.xs, color: Colors.textMuted },
  summaryLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },

  addBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.accent, borderRadius: Radii.lg,
    padding: Spacing.md, marginBottom: Spacing.lg,
    gap: 12, ...Shadows.accent,
  },
  addBtnIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { flex: 1 },
  addBtnTitle: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.bg },
  addBtnSub: { fontSize: FontSizes.xs, color: Colors.bg + 'CC', marginTop: 2 },

  sectionTitle: {
    fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  emptyDesc: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 20 },

  logCard: { marginBottom: 10 },
  logRow: { flexDirection: 'row', alignItems: 'flex-start' },
  logEmoji: { fontSize: 30, marginRight: 12, paddingTop: 2 },
  logInfo: { flex: 1 },
  logName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary },
  logServing: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  macroRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  macroPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgElevated, borderRadius: Radii.sm,
    paddingHorizontal: 6, paddingVertical: 2, gap: 3,
  },
  macroLabel: { fontSize: FontSizes.xs, fontWeight: '700' },
  macroVal: { fontSize: FontSizes.xs, color: Colors.textSecondary },

  logRight: { alignItems: 'flex-end' },
  logCals: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.accent },
  logCalsUnit: { fontSize: FontSizes.xs, color: Colors.textMuted },
  deleteBtn: {
    marginTop: 10, padding: 4,
    backgroundColor: Colors.danger + '15',
    borderRadius: Radii.sm,
  },
});
