import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Image, Dimensions,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import useAppStore from '../store/useAppStore';
import CalorieRing from '../components/CalorieRing';
import MacroBar from '../components/MacroBar';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';

const { width, height } = Dimensions.get('window');

// ─── QuickAction Component ───────────────────────────────────────────────────
const QuickAction = ({ icon, label, sublabel, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start(() => onPress());
  };

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.quickAction}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.qaIcon}>
          <Ionicons name={icon} size={20} color={Colors.gold} />
        </View>
        <Text style={styles.qaLabel}>{label}</Text>
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
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();

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

  return (
    <View style={styles.root}>
      {/* Background Statue (Slightly Darkened) */}
      <Image
        source={require('../../assets/zeus-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      {/* Dark tint overlay */}
      <View style={styles.backgroundDarkOverlay} />
      <View style={styles.backgroundGradientOverlay} />

      <Animated.ScrollView
        style={[styles.container, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Pop-Out Logo */}
        <View style={styles.header}>
          <View style={styles.headerUserRow}>
            {/* Elevated Gold-Popping Logo */}
            <View style={styles.avatarPopContainer}>
              <View style={styles.avatarGlowRing} />
              <View style={styles.avatarBorder}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.headerTextCol}>
              <View style={styles.protocolBadge}>
                <Text style={styles.protocolText}>PROJECT ZEUS</Text>
              </View>
              <Text style={styles.name}>{profile.name || 'Athlete'}</Text>
            </View>
          </View>

          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={18} color={Colors.gold} />
            <Text style={styles.streakCount}>{streak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Calorie Ring Card */}
        <Card style={styles.ringCard} highlighted>
          <View style={styles.ringHeader}>
            <Text style={styles.cardHeaderTitle}>DAILY ENERGY CONSUMPTION</Text>
            <View style={styles.goldStatusDot} />
          </View>
          <View style={styles.ringRow}>
            <CalorieRing consumed={consumed.calories} target={nutrition.targetCalories || 2200} size={170} />
            <View style={styles.ringStats}>
              <Text style={styles.ringStatLabel}>TARGET</Text>
              <Text style={[styles.ringStatValue, { color: Colors.gold }]}>{nutrition.targetCalories || 2200}</Text>
              <Text style={styles.ringStatUnit}>kcal / day</Text>
              <View style={styles.ringSep} />
              <Text style={styles.ringStatLabel}>EST. BURNED</Text>
              <Text style={[styles.ringStatValue, { color: Colors.textPrimary }]}>
                {Math.round((nutrition.targetCalories || 2200) * 0.18)}
              </Text>
              <Text style={styles.ringStatUnit}>kcal active</Text>
            </View>
          </View>
        </Card>

        {/* Macros Card */}
        <Card style={styles.macrosCard}>
          <View style={styles.macroHeaderRow}>
            <Text style={styles.cardHeaderTitle}>DAILY MACRONUTRIENTS</Text>
            <Text style={styles.macroSub}>Grams</Text>
          </View>
          <MacroBar
            label="Protein"
            consumed={consumed.protein}
            target={nutrition.macros?.protein || 160}
            color={Colors.gold}
          />
          <MacroBar
            label="Carbohydrates"
            consumed={consumed.carbs}
            target={nutrition.macros?.carbs || 220}
            color={Colors.white}
          />
          <MacroBar
            label="Healthy Fats"
            consumed={consumed.fat}
            target={nutrition.macros?.fat || 70}
            color={Colors.textSecondary}
          />
        </Card>

        {/* Steps + Rank Widgets */}
        <View style={styles.widgetRow}>
          <Card style={styles.widget}>
            <View style={styles.widgetHeader}>
              <Ionicons name="footsteps-outline" size={16} color={Colors.gold} />
              <Text style={styles.widgetTitle}>Daily Steps</Text>
            </View>
            <Text style={[styles.widgetValue, { color: Colors.textPrimary }]}>
              {stepCount.toLocaleString()}
            </Text>
            <Text style={styles.widgetSub}>Goal: 10,000</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${stepProgress * 100}%`, backgroundColor: Colors.gold }]} />
            </View>
            {!isPedometerAvailable && (
              <Text style={styles.mockBadge}>SENSOR SIMULATED</Text>
            )}
          </Card>

          <Card style={styles.widget}>
            <View style={styles.widgetHeader}>
              <Ionicons name="trophy-outline" size={16} color={Colors.gold} />
              <Text style={styles.widgetTitle}>Consistency Tier</Text>
            </View>
            <Text style={[styles.widgetValue, { color: Colors.gold }]}>Tier 1 · Active</Text>
            <Text style={styles.widgetSub}>Next milestone at 14 days</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.min((streak / 14) * 100, 100)}%`, backgroundColor: Colors.gold }]} />
            </View>
            <Text style={styles.mockBadge}>STREAK PROGRESS</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.quickRow}>
          <QuickAction
            icon="camera-outline"
            label="Scan Food"
            sublabel="Vision AI"
            onPress={() => navigation.navigate('LogTab')}
          />
          <QuickAction
            icon="barbell-outline"
            label="Pose Coach"
            sublabel="Form AI"
            onPress={() => navigation.navigate('WorkoutTab')}
          />
          <QuickAction
            icon="people-outline"
            label="Find Coach"
            sublabel="Experts"
            onPress={() => navigation.navigate('ProsTab')}
          />
        </View>

        {/* Today's Fuel Log */}
        <Card style={styles.logSummary}>
          <View style={styles.logHeader}>
            <Text style={styles.cardHeaderTitle}>TODAY'S FUEL LOG</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LogTab')}>
              <Text style={styles.viewAll}>View Log →</Text>
            </TouchableOpacity>
          </View>
          {dailyLog.length === 0 ? (
            <Text style={styles.emptyLog}>No meals logged today. Use the scanner to track food intake.</Text>
          ) : (
            dailyLog.slice(-3).map((entry) => (
              <View key={entry.id} style={styles.logItem}>
                <View style={styles.logBullet} />
                <View style={styles.logItemInfo}>
                  <Text style={styles.logItemName}>{entry.name}</Text>
                  <Text style={styles.logItemMacros}>
                    P: {Math.round(entry.protein)}g · C: {Math.round(entry.carbs)}g · F: {Math.round(entry.fat)}g
                  </Text>
                </View>
                <Text style={styles.logItemCals}>{entry.calories} kcal</Text>
              </View>
            ))
          )}
        </Card>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    opacity: 0.35,
  },
  backgroundDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 13, 0.78)',
  },
  backgroundGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
    backgroundColor: 'rgba(10, 10, 13, 0.85)',
  },
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: 36 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.md,
  },
  headerUserRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  avatarPopContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGlowRing: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(212, 175, 55, 0.25)',
  },
  avatarBorder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.gold,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerTextCol: {
    justifyContent: 'center',
  },
  protocolBadge: {
    backgroundColor: Colors.goldGlow,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  protocolText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 1,
  },
  name: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.textPrimary },

  streakBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(19, 19, 24, 0.92)',
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    minWidth: 72,
    ...Shadows.card,
  },
  streakCount: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.gold, marginTop: 2 },
  streakLabel: { fontSize: 8, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },

  ringCard: { marginBottom: Spacing.md, backgroundColor: 'rgba(22, 22, 29, 0.92)' },
  ringHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardHeaderTitle: {
    fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textSecondary,
    letterSpacing: 1.2, textTransform: 'uppercase',
  },
  goldStatusDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.gold,
  },
  ringRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  ringStats: { alignItems: 'center' },
  ringStatLabel: { fontSize: 9, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  ringStatValue: { fontSize: FontSizes.xl, fontWeight: '800', marginTop: 2 },
  ringStatUnit: { fontSize: 10, color: Colors.textMuted },
  ringSep: { width: 24, height: 1, backgroundColor: Colors.border, marginVertical: 8 },

  macrosCard: { marginBottom: Spacing.md, backgroundColor: 'rgba(19, 19, 24, 0.92)' },
  macroHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  macroSub: { fontSize: FontSizes.xs, color: Colors.textMuted },

  widgetRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.md },
  widget: { flex: 1, backgroundColor: 'rgba(19, 19, 24, 0.92)' },
  widgetHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  widgetTitle: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '700', textTransform: 'uppercase' },
  widgetValue: { fontSize: FontSizes.xl, fontWeight: '800' },
  widgetSub: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  track: {
    height: 4, backgroundColor: Colors.bgElevated,
    borderRadius: Radii.full, marginTop: 8, overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: Radii.full },
  mockBadge: {
    fontSize: 8, color: Colors.textMuted, letterSpacing: 0.8,
    textTransform: 'uppercase', marginTop: 6,
  },

  sectionTitle: {
    fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10,
  },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  quickAction: {
    borderRadius: Radii.md, padding: 14, alignItems: 'center',
    backgroundColor: 'rgba(19, 19, 24, 0.92)', borderWidth: 1, borderColor: Colors.border,
  },
  qaIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.goldGlow,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8, borderWidth: 1, borderColor: Colors.borderGold,
  },
  qaLabel: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  qaSub: { fontSize: 9, color: Colors.textMuted, marginTop: 2 },

  logSummary: { marginBottom: Spacing.md, backgroundColor: 'rgba(19, 19, 24, 0.92)' },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  viewAll: { fontSize: FontSizes.xs, color: Colors.gold, fontWeight: '700', letterSpacing: 0.5 },
  emptyLog: { fontSize: FontSizes.sm, color: Colors.textMuted, lineHeight: 20 },
  logItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  logBullet: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.gold, marginRight: 12,
  },
  logItemInfo: { flex: 1 },
  logItemName: { fontSize: FontSizes.sm, color: Colors.textPrimary, fontWeight: '600' },
  logItemMacros: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  logItemCals: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.gold },
});
