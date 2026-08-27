import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Platform,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import useAppStore from '../store/useAppStore';
import CalorieRing from '../components/CalorieRing';
import MacroBar from '../components/MacroBar';
import Card from '../components/Card';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';

export default function HomeScreen({ navigation }) {
  const { profile, nutrition, streak, stepCount, setStepCount, incrementSteps, getConsumed, dailyLog } = useAppStore();
  const consumed = getConsumed();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    // Try real pedometer, fall back to mock incrementing counter
    let mockInterval;
    Pedometer.isAvailableAsync().then((available) => {
      setIsPedometerAvailable(available);
      if (available) {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        Pedometer.getStepCountAsync(start, end)
          .then((res) => setStepCount(res.steps))
          .catch(() => {});
      } else {
        // MOCK: Simulate step count incrementing
        mockInterval = setInterval(() => {
          incrementSteps(Math.floor(Math.random() * 8) + 1);
        }, 4000);
      }
    }).catch(() => {
      // MOCK fallback
      mockInterval = setInterval(() => {
        incrementSteps(Math.floor(Math.random() * 8) + 1);
      }, 4000);
    });

    return () => clearInterval(mockInterval);
  }, []);

  const stepProgress = Math.min(stepCount / 10000, 1);
  const goalColor = { bulk: Colors.green, cut: Colors.orange, maintain: Colors.accent }[profile.goal] || Colors.accent;

  const QuickAction = ({ icon, label, color, onPress, iconLib = 'Ionicons' }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.94, duration: 80, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]).start(() => onPress());
    };
    const IconComp = iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
    return (
      <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[styles.quickAction, { borderColor: color + '44', backgroundColor: color + '12' }]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <View style={[styles.qaIcon, { backgroundColor: color + '22', borderColor: color + '44' }]}>
            <IconComp name={icon} size={22} color={color} />
          </View>
          <Text style={[styles.qaLabel, { color }]}>{label}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{profile.name || 'Champion'} ⚡</Text>
        </View>
        <View style={[styles.streakBadge, Shadows.green]}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakCount}>{streak}</Text>
          <Text style={styles.streakLabel}>day{streak !== 1 ? 's' : ''}</Text>
        </View>
      </View>

      {/* Calorie Ring */}
      <Card style={styles.ringCard}>
        <View style={styles.ringRow}>
          <CalorieRing consumed={consumed.calories} target={nutrition.targetCalories} size={180} />
          <View style={styles.ringStats}>
            <Text style={styles.ringStatLabel}>Target</Text>
            <Text style={styles.ringStatValue}>{nutrition.targetCalories}</Text>
            <Text style={styles.ringStatUnit}>kcal</Text>
            <View style={styles.ringSep} />
            <Text style={styles.ringStatLabel}>Burned</Text>
            <Text style={[styles.ringStatValue, { color: Colors.orange }]}>
              {Math.round(nutrition.targetCalories * 0.15)}
            </Text>
            <Text style={styles.ringStatUnit}>kcal</Text>
          </View>
        </View>
      </Card>

      {/* Macros */}
      <Card style={styles.macrosCard}>
        <Text style={styles.cardTitle}>Macronutrients</Text>
        <MacroBar
          label="Protein"
          consumed={consumed.protein}
          target={nutrition.macros?.protein || 150}
          color={Colors.accent}
        />
        <MacroBar
          label="Carbs"
          consumed={consumed.carbs}
          target={nutrition.macros?.carbs || 200}
          color={Colors.purple}
        />
        <MacroBar
          label="Fat"
          consumed={consumed.fat}
          target={nutrition.macros?.fat || 65}
          color={Colors.orange}
        />
      </Card>

      {/* Steps + Streak Row */}
      <View style={styles.widgetRow}>
        {/* Steps */}
        <Card style={styles.widget}>
          <View style={styles.widgetHeader}>
            <Ionicons name="footsteps" size={18} color={Colors.green} />
            <Text style={styles.widgetTitle}>Steps</Text>
          </View>
          <Text style={[styles.widgetValue, { color: Colors.green }]}>{stepCount.toLocaleString()}</Text>
          <Text style={styles.widgetSub}>/ 10,000 goal</Text>
          <View style={styles.stepTrack}>
            <View style={[styles.stepFill, { width: `${stepProgress * 100}%` }]} />
          </View>
          {!isPedometerAvailable && (
            <Text style={styles.mockBadge}>SIMULATED</Text>
          )}
        </Card>

        {/* Streak */}
        <Card style={[styles.widget, { borderColor: Colors.orange + '44' }]}>
          <View style={styles.widgetHeader}>
            <Text style={{ fontSize: 18 }}>🔥</Text>
            <Text style={styles.widgetTitle}>Streak</Text>
          </View>
          <Text style={[styles.widgetValue, { color: Colors.orange }]}>{streak}</Text>
          <Text style={styles.widgetSub}>days active</Text>
          <Text style={styles.streakMsg}>
            {streak >= 7 ? '🏆 On fire! Keep it up!' : '💪 Keep going!'}
          </Text>
        </Card>
      </View>

      {/* Today's log summary */}
      <Card style={styles.logSummary}>
        <View style={styles.logHeader}>
          <Text style={styles.cardTitle}>Today's Log</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Log')}>
            <Text style={styles.viewAll}>View all →</Text>
          </TouchableOpacity>
        </View>
        {dailyLog.length === 0 ? (
          <Text style={styles.emptyLog}>No meals logged yet. Add your first meal! 🍽️</Text>
        ) : (
          dailyLog.slice(-3).map((entry) => (
            <View key={entry.id} style={styles.logItem}>
              <Text style={styles.logEmoji}>{entry.emoji || '🍽️'}</Text>
              <View style={styles.logItemInfo}>
                <Text style={styles.logItemName}>{entry.name}</Text>
                <Text style={styles.logItemMacros}>
                  P:{entry.protein}g · C:{entry.carbs}g · F:{entry.fat}g
                </Text>
              </View>
              <Text style={styles.logItemCals}>{entry.calories} kcal</Text>
            </View>
          ))
        )}
      </Card>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickRow}>
        <QuickAction
          icon="camera"
          label="Log Meal"
          color={Colors.accent}
          onPress={() => navigation.navigate('Log')}
        />
        <QuickAction
          icon="barbell"
          label="Workout"
          color={Colors.green}
          onPress={() => navigation.navigate('Workout')}
        />
        <QuickAction
          icon="people"
          label="Find Pro"
          color={Colors.purple}
          onPress={() => navigation.navigate('Pros')}
        />
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: 60, paddingBottom: 40 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: Spacing.lg,
  },
  greeting: { fontSize: FontSizes.md, color: Colors.textSecondary },
  name: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary },

  streakBadge: {
    alignItems: 'center', backgroundColor: Colors.bgCard,
    borderRadius: Radii.lg, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.orange + '44',
  },
  streakFire: { fontSize: 22 },
  streakCount: { fontSize: FontSizes.xl, fontWeight: '900', color: Colors.orange },
  streakLabel: { fontSize: FontSizes.xs, color: Colors.textMuted },

  ringCard: { marginBottom: Spacing.md },
  ringRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  ringStats: { alignItems: 'center' },
  ringStatLabel: { fontSize: FontSizes.xs, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  ringStatValue: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
  ringStatUnit: { fontSize: FontSizes.xs, color: Colors.textMuted },
  ringSep: { width: 30, height: 1, backgroundColor: Colors.border, marginVertical: 8 },

  macrosCard: { marginBottom: Spacing.md },
  cardTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },

  widgetRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.md },
  widget: { flex: 1 },
  widgetHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  widgetTitle: { fontSize: FontSizes.sm, color: Colors.textSecondary, fontWeight: '600' },
  widgetValue: { fontSize: FontSizes.xxxl, fontWeight: '900' },
  widgetSub: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  stepTrack: {
    height: 4, backgroundColor: Colors.bgElevated,
    borderRadius: Radii.full, marginTop: 8, overflow: 'hidden',
  },
  stepFill: { height: '100%', backgroundColor: Colors.green, borderRadius: Radii.full },
  mockBadge: {
    fontSize: 8, color: Colors.textMuted, letterSpacing: 1,
    textTransform: 'uppercase', marginTop: 4,
  },
  streakMsg: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginTop: 4 },

  logSummary: { marginBottom: Spacing.md },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  viewAll: { fontSize: FontSizes.sm, color: Colors.accent, fontWeight: '600' },
  emptyLog: { fontSize: FontSizes.sm, color: Colors.textMuted, fontStyle: 'italic' },
  logItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  logEmoji: { fontSize: 22, marginRight: 12 },
  logItemInfo: { flex: 1 },
  logItemName: { fontSize: FontSizes.md, color: Colors.textPrimary, fontWeight: '600' },
  logItemMacros: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  logItemCals: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.accent },

  sectionTitle: {
    fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  quickAction: {
    borderRadius: Radii.md, padding: 14, alignItems: 'center',
    borderWidth: 1.5,
  },
  qaIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8, borderWidth: 1,
  },
  qaLabel: { fontSize: FontSizes.xs, fontWeight: '700', textAlign: 'center' },
});
