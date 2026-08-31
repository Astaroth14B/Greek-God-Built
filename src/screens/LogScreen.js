import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, Animated,
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
    Alert.alert('Remove Entry', `Remove "${name}" from your daily log?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFoodEntry(id) },
    ]);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Food Intake Log</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
        </View>

        {/* Daily Summary */}
        <Card style={styles.summaryCard} highlighted>
          <View style={styles.summaryRow}>
            {[
              { label: 'Calories', value: Math.round(consumed.calories), target: nutrition.targetCalories, color: Colors.gold, unit: 'kcal' },
              { label: 'Protein', value: Math.round(consumed.protein), target: nutrition.macros?.protein || 150, color: Colors.textPrimary, unit: 'g' },
              { label: 'Carbs', value: Math.round(consumed.carbs), target: nutrition.macros?.carbs || 200, color: Colors.textSecondary, unit: 'g' },
              { label: 'Fat', value: Math.round(consumed.fat), target: nutrition.macros?.fat || 65, color: Colors.textMuted, unit: 'g' },
            ].map((item) => (
              <View key={item.label} style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
                <Text style={styles.summaryTarget}>/{item.target}{item.unit}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Scan Food CTA */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('FoodCamera')}
          activeOpacity={0.85}
        >
          <View style={styles.addBtnIcon}>
            <Ionicons name="camera-outline" size={22} color={Colors.bg} />
          </View>
          <View style={styles.addBtnText}>
            <Text style={styles.addBtnTitle}>Scan Food with Vision AI</Text>
            <Text style={styles.addBtnSub}>Capture your plate to estimate macros & calories</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={Colors.bg} />
        </TouchableOpacity>

        {/* Log Entries Header */}
        <Text style={styles.sectionTitle}>
          {dailyLog.length === 0 ? 'No logged meals today' : `${dailyLog.length} entry${dailyLog.length === 1 ? '' : 's'} recorded`}
        </Text>

        {dailyLog.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="restaurant-outline" size={32} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Nothing logged yet</Text>
            <Text style={styles.emptyDesc}>
              Snap a photo of your meal or snack to track your caloric and macronutrient targets.
            </Text>
          </View>
        ) : (
          [...dailyLog].reverse().map((entry) => (
            <Card key={entry.id} style={styles.logCard}>
              <View style={styles.logRow}>
                <View style={styles.logBullet} />
                <View style={styles.logInfo}>
                  <Text style={styles.logName}>{entry.name}</Text>
                  <Text style={styles.logServing}>{entry.serving || '1 serving'}</Text>
                  <View style={styles.macroRow}>
                    <View style={styles.macroPill}>
                      <Text style={styles.macroLabel}>P:</Text>
                      <Text style={styles.macroVal}>{Math.round(entry.protein)}g</Text>
                    </View>
                    <View style={styles.macroPill}>
                      <Text style={styles.macroLabel}>C:</Text>
                      <Text style={styles.macroVal}>{Math.round(entry.carbs)}g</Text>
                    </View>
                    <View style={styles.macroPill}>
                      <Text style={styles.macroLabel}>F:</Text>
                      <Text style={styles.macroVal}>{Math.round(entry.fat)}g</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.logRight}>
                  <Text style={styles.logCals}>{entry.calories}</Text>
                  <Text style={styles.logCalsUnit}>kcal</Text>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(entry.id, entry.name)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={14} color={Colors.danger} />
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
  title: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary },
  date: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginTop: 4 },

  summaryCard: { marginBottom: Spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: FontSizes.lg, fontWeight: '800' },
  summaryTarget: { fontSize: 10, color: Colors.textMuted },
  summaryLabel: { fontSize: 9, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 3 },

  addBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.gold, borderRadius: Radii.lg,
    padding: Spacing.md, marginBottom: Spacing.lg,
    gap: 12, ...Shadows.gold,
  },
  addBtnIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { flex: 1 },
  addBtnTitle: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.bg },
  addBtnSub: { fontSize: FontSizes.xs, color: 'rgba(10,10,13,0.75)', marginTop: 2 },

  sectionTitle: {
    fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIconContainer: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.bgCard, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  emptyTitle: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  emptyDesc: { fontSize: FontSizes.sm, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 20, lineHeight: 20 },

  logCard: { marginBottom: 10 },
  logRow: { flexDirection: 'row', alignItems: 'flex-start' },
  logBullet: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.gold, marginRight: 12, marginTop: 6,
  },
  logInfo: { flex: 1 },
  logName: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textPrimary },
  logServing: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 1 },
  macroRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  macroPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgElevated, borderRadius: Radii.sm,
    paddingHorizontal: 6, paddingVertical: 2, gap: 3,
  },
  macroLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },
  macroVal: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },

  logRight: { alignItems: 'flex-end' },
  logCals: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.gold },
  logCalsUnit: { fontSize: 9, color: Colors.textMuted },
  deleteBtn: {
    marginTop: 8, padding: 4,
    backgroundColor: Colors.danger + '15',
    borderRadius: Radii.sm,
  },
});
