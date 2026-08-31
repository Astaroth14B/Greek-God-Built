import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Image,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import useAppStore from '../store/useAppStore';
import CalorieRing from '../components/CalorieRing';
import MacroBar from '../components/MacroBar';
import Card from '../components/Card';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';

// ─── QuickAction — defined at module scope so hooks/refs are stable ────────────
const QuickAction = ({ icon, label, sublabel, color, onPress, iconLib = 'Ionicons' }) => {
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
        style={[styles.quickAction, { borderColor: color + '55', backgroundColor: color + '10' }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={[styles.qaIcon, { backgroundColor: color + '20', borderColor: color + '60' }]}>
          <IconComp name={icon} size={22} color={color} />
        </View>
        <Text style={[styles.qaLabel, { color }]}>{label}</Text>
        {sublabel && <Text style={styles.qaSub}>{sublabel}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen({ navigation }) {
  const { profile, nutrition, streak, stepCount, setStepCount, incrementSteps, getConsumed, dailyLog } = useAppStore();
  const consumed = getConsumed();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    let mockInterval;
    Pedometer.isAvailableAsync().then((available) => {
      setIsPedometerAvailable(available);
      if (available) {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        Pedometer.getStepCountAsync(start, end)
          .then((res) => res && setStepCount(res.steps))
          .catch(() => {});
      } else {
        mockInterval = setInterval(() => {
          incrementSteps(Math.floor(Math.random() * 8) + 1);
        }, 4000);
      }
    }).catch(() => {
      mockInterval = setInterval(() => {
        incrementSteps(Math.floor(Math.random() * 8) + 1);
      }, 4000);
    });

    return () => clearInterval(mockInterval);
  }, []);

  const stepProgress = Math.min(stepCount / 10000, 1);

  // QuickAction is now defined at module scope above — do not inline it here

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Divine Header with Greek God Logo */}
      <View style={styles.header}>
        <View style={styles.headerUserRow}>
          <View style={styles.avatarBorder}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerTextCol}>
            <View style={styles.demigodPill}>
              <Text style={styles.demigodText}>⚡ OLYMPIAN PROTOCOL</Text>
            </View>
            <Text style={styles.name}>{profile.name || 'Demi-God'} 🔱</Text>
          </View>
        </View>

        <View style={[styles.streakBadge, Shadows.gold]}>
          <Text style={styles.streakFire}>🔥</Text>
          <Text style={styles.streakCount}>{streak}</Text>
          <Text style={styles.streakLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Calorie Ring Card */}
      <Card style={styles.ringCard}>
        <View style={styles.ringHeader}>
          <Text style={styles.cardHeaderTitle}>DAILY ENERGY CONSUMPTION</Text>
          <View style={styles.goldStatusDot} />
        </View>
        <View style={styles.ringRow}>
          <CalorieRing consumed={consumed.calories} target={nutrition.targetCalories || 2200} size={175} />
          <View style={styles.ringStats}>
            <Text style={styles.ringStatLabel}>TARGET</Text>
            <Text style={[styles.ringStatValue, { color: Colors.gold }]}>{nutrition.targetCalories || 2200}</Text>
            <Text style={styles.ringStatUnit}>kcal/day</Text>
            <View style={styles.ringSep} />
            <Text style={styles.ringStatLabel}>BURNED</Text>
            <Text style={[styles.ringStatValue, { color: Colors.orange }]}>
              {Math.round((nutrition.targetCalories || 2200) * 0.18)}
            </Text>
            <Text style={styles.ringStatUnit}>kcal active</Text>
          </View>
        </View>
      </Card>

      {/* Macros Card */}
      <Card style={styles.macrosCard}>
        <View style={styles.macroHeaderRow}>
          <Text style={styles.cardHeaderTitle}>OLYMPIAN MACROS</Text>
          <Text style={styles.macroSub}>Target Goals</Text>
        </View>
        <MacroBar
          label="Protein (Muscle Synthesis)"
          consumed={consumed.protein}
          target={nutrition.macros?.protein || 160}
          color={Colors.accent}
        />
        <MacroBar
          label="Carbohydrates (Titan Energy)"
          consumed={consumed.carbs}
          target={nutrition.macros?.carbs || 220}
          color={Colors.purple}
        />
        <MacroBar
          label="Healthy Fats (Hormone Health)"
          consumed={consumed.fat}
          target={nutrition.macros?.fat || 70}
          color={Colors.gold}
        />
      </Card>

      {/* Steps + Streak Widgets */}
      <View style={styles.widgetRow}>
        <Card style={[styles.widget, { borderColor: Colors.green + '40' }]}>
          <View style={styles.widgetHeader}>
            <Ionicons name="footsteps" size={18} color={Colors.green} />
            <Text style={styles.widgetTitle}>March Steps</Text>
          </View>
          <Text style={[styles.widgetValue, { color: Colors.green }]}>{stepCount.toLocaleString()}</Text>
          <Text style={styles.widgetSub}>/ 10,000 Spartan Goal</Text>
          <View style={styles.stepTrack}>
            <View style={[styles.stepFill, { width: `${stepProgress * 100}%` }]} />
          </View>
          {!isPedometerAvailable && (
            <Text style={styles.mockBadge}>SIMULATED SENSOR</Text>
          )}
        </Card>

        <Card style={[styles.widget, { borderColor: Colors.gold + '40' }]}>
          <View style={styles.widgetHeader}>
            <Text style={{ fontSize: 18 }}>🏆</Text>
            <Text style={styles.widgetTitle}>Divine Rank</Text>
          </View>
          <Text style={[styles.widgetValue, { color: Colors.gold }]}>Spartan</Text>
          <Text style={styles.widgetSub}>Next: Titan at 14 days</Text>
          <View style={styles.rankTrack}>
            <View style={[styles.rankFill, { width: `${Math.min((streak / 14) * 100, 100)}%` }]} />
          </View>
          <Text style={styles.mockBadge}>RANK PROGRESS</Text>
        </Card>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>COMMAND CENTER</Text>
      <View style={styles.quickRow}>
        <QuickAction
          icon="camera"
          label="Scan Meal"
          sublabel="Vision AI"
          color={Colors.accent}
          onPress={() => navigation.navigate('LogTab')}
        />
        <QuickAction
          icon="barbell"
          label="Track Form"
          sublabel="Pose AI"
          color={Colors.gold}
          onPress={() => navigation.navigate('WorkoutTab')}
        />
        <QuickAction
          icon="people"
          label="Book Pro"
          sublabel="Masters"
          color={Colors.green}
          onPress={() => navigation.navigate('ProsTab')}
        />
      </View>

      {/* Today's Food Log */}
      <Card style={styles.logSummary}>
        <View style={styles.logHeader}>
          <Text style={styles.cardHeaderTitle}>TODAY'S FUEL LOG</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LogTab')}>
            <Text style={styles.viewAll}>Full Log →</Text>
          </TouchableOpacity>
        </View>
        {dailyLog.length === 0 ? (
          <Text style={styles.emptyLog}>No meals logged yet today. Scan your first meal! ⚡</Text>
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
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: 36 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.md,
  },
  headerUserRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  avatarBorder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.gold,
    overflow: 'hidden',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerTextCol: {
    justifyContent: 'center',
  },
  demigodPill: {
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  demigodText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 1,
  },
  name: { fontSize: FontSizes.xl, fontWeight: '900', color: Colors.textPrimary },

  streakBadge: {
    alignItems: 'center', backgroundColor: Colors.bgCard,
    borderRadius: Radii.md, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1.5, borderColor: Colors.gold + '60',
  },
  streakFire: { fontSize: 18 },
  streakCount: { fontSize: FontSizes.lg, fontWeight: '900', color: Colors.gold },
  streakLabel: { fontSize: 9, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },

  ringCard: { marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.borderGold },
  ringHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardHeaderTitle: {
    fontSize: FontSizes.xs, fontWeight: '800', color: Colors.textSecondary,
    letterSpacing: 1.2, textTransform: 'uppercase',
  },
  goldStatusDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.gold,
  },
  ringRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  ringStats: { alignItems: 'center' },
  ringStatLabel: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  ringStatValue: { fontSize: FontSizes.xxl, fontWeight: '900', marginTop: 2 },
  ringStatUnit: { fontSize: 10, color: Colors.textMuted },
  ringSep: { width: 30, height: 1, backgroundColor: Colors.border, marginVertical: 8 },

  macrosCard: { marginBottom: Spacing.md },
  macroHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  macroSub: { fontSize: FontSizes.xs, color: Colors.textMuted },

  widgetRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.md },
  widget: { flex: 1 },
  widgetHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  widgetTitle: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '700', textTransform: 'uppercase' },
  widgetValue: { fontSize: FontSizes.xxl, fontWeight: '900' },
  widgetSub: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  stepTrack: {
    height: 4, backgroundColor: Colors.bgElevated,
    borderRadius: Radii.full, marginTop: 8, overflow: 'hidden',
  },
  stepFill: { height: '100%', backgroundColor: Colors.green, borderRadius: Radii.full },
  rankTrack: {
    height: 4, backgroundColor: Colors.bgElevated,
    borderRadius: Radii.full, marginTop: 8, overflow: 'hidden',
  },
  rankFill: { height: '100%', backgroundColor: Colors.gold, borderRadius: Radii.full },
  mockBadge: {
    fontSize: 8, color: Colors.textMuted, letterSpacing: 0.8,
    textTransform: 'uppercase', marginTop: 5,
  },

  sectionTitle: {
    fontSize: FontSizes.xs, fontWeight: '800', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10,
  },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  quickAction: {
    borderRadius: Radii.md, padding: 12, alignItems: 'center',
    borderWidth: 1.5,
  },
  qaIcon: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6, borderWidth: 1,
  },
  qaLabel: { fontSize: FontSizes.xs, fontWeight: '800', textAlign: 'center' },
  qaSub: { fontSize: 9, color: Colors.textMuted, marginTop: 1 },

  logSummary: { marginBottom: Spacing.md },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  viewAll: { fontSize: FontSizes.xs, color: Colors.accent, fontWeight: '700', letterSpacing: 0.5 },
  emptyLog: { fontSize: FontSizes.sm, color: Colors.textMuted, fontStyle: 'italic' },
  logItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  logEmoji: { fontSize: 22, marginRight: 12 },
  logItemInfo: { flex: 1 },
  logItemName: { fontSize: FontSizes.sm, color: Colors.textPrimary, fontWeight: '700' },
  logItemMacros: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  logItemCals: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.gold },
});
