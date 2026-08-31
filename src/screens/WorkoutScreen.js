import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';

const EXERCISES = [
  { id: 'squat', name: 'Barbell Squat', icon: 'barbell-outline', muscles: 'Quads, Glutes, Core', difficulty: 'Intermediate' },
  { id: 'pushup', name: 'Push-Up Protocol', icon: 'body-outline', muscles: 'Chest, Shoulders, Triceps', difficulty: 'Beginner' },
  { id: 'deadlift', name: 'Conventional Deadlift', icon: 'barbell-outline', muscles: 'Hamstrings, Back, Glutes', difficulty: 'Advanced' },
  { id: 'lunges', name: 'Walking Lunges', icon: 'walk-outline', muscles: 'Quads, Balance, Core', difficulty: 'Beginner' },
  { id: 'ohpress', name: 'Overhead Press', icon: 'fitness-outline', muscles: 'Deltoids, Triceps, Core', difficulty: 'Intermediate' },
  { id: 'pullup', name: 'Strict Pull-Up', icon: 'trending-up-outline', muscles: 'Lats, Biceps, Rear Delts', difficulty: 'Advanced' },
];

const DIFFICULTY_STYLES = {
  Beginner: { color: Colors.green, border: Colors.green + '55', bg: Colors.greenGlow },
  Intermediate: { color: Colors.gold, border: Colors.borderGold, bg: Colors.goldGlow },
  Advanced: { color: Colors.orange, border: Colors.orange + '55', bg: Colors.orangeGlow },
};

export default function WorkoutScreen({ navigation }) {
  const [selected, setSelected] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Form Tracking</Text>
          <Text style={styles.subtitle}>
            Real-time biometric pose analysis and rep counting via front camera.
          </Text>
        </View>

        {/* How it works */}
        <Card style={styles.howCard} highlighted>
          <View style={styles.howHeader}>
            <Ionicons name="scan-outline" size={16} color={Colors.gold} />
            <Text style={styles.howTitle}>SETUP PROTOCOL</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
            <Text style={styles.stepText}>Select your compound or bodyweight exercise below</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
            <Text style={styles.stepText}>Position device 5–6 feet away with front camera active</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
            <Text style={styles.stepText}>Computer vision tracks joint angles, pacing & reps</Text>
          </View>
        </Card>

        {/* Exercise Selection */}
        <Text style={styles.sectionTitle}>SELECT EXERCISE</Text>
        {EXERCISES.map((ex) => {
          const isSelected = selected === ex.id;
          const diffStyle = DIFFICULTY_STYLES[ex.difficulty] || DIFFICULTY_STYLES.Beginner;
          return (
            <TouchableOpacity
              key={ex.id}
              style={[styles.exerciseCard, isSelected && styles.exerciseCardActive]}
              onPress={() => setSelected(ex.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.exerciseIconContainer, isSelected && styles.exerciseIconActive]}>
                <Ionicons
                  name={ex.icon}
                  size={20}
                  color={isSelected ? Colors.gold : Colors.textSecondary}
                />
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseMuscles}>{ex.muscles}</Text>
              </View>
              <View style={styles.exerciseRight}>
                <View style={[styles.diffBadge, { backgroundColor: diffStyle.bg, borderColor: diffStyle.border }]}>
                  <Text style={[styles.diffText, { color: diffStyle.color }]}>
                    {ex.difficulty}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={12} color={Colors.bg} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startBtn, !selected && styles.startBtnDisabled]}
          disabled={!selected}
          onPress={() => navigation.navigate('WorkoutCamera', {
            exercise: EXERCISES.find((e) => e.id === selected),
          })}
          activeOpacity={0.85}
        >
          <Ionicons name="camera-outline" size={20} color={selected ? Colors.bg : Colors.textMuted} />
          <Text style={[styles.startBtnText, !selected && styles.startBtnTextDisabled]}>
            {selected
              ? `Begin ${EXERCISES.find(e => e.id === selected)?.name}`
              : 'Select an exercise to continue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.md, paddingTop: 60, paddingBottom: 32 },

  header: { marginBottom: Spacing.lg },
  title: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 4, lineHeight: 20 },

  howCard: { marginBottom: Spacing.lg },
  howHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  howTitle: { fontSize: FontSizes.xs, fontWeight: '800', color: Colors.gold, letterSpacing: 1 },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stepNum: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.goldGlow, borderWidth: 1, borderColor: Colors.borderGold,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  stepNumText: { fontSize: 10, fontWeight: '800', color: Colors.gold },
  stepText: { flex: 1, fontSize: FontSizes.xs, color: Colors.textSecondary, lineHeight: 18 },

  sectionTitle: {
    fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10,
  },

  exerciseCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
  },
  exerciseCardActive: {
    borderColor: Colors.borderGold, backgroundColor: '#181820',
  },
  exerciseIconContainer: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12, borderWidth: 1, borderColor: Colors.border,
  },
  exerciseIconActive: {
    backgroundColor: Colors.goldGlow, borderColor: Colors.borderGold,
  },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textPrimary },
  exerciseMuscles: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  exerciseRight: { alignItems: 'flex-end', gap: 4 },
  diffBadge: {
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: Radii.full, borderWidth: 1,
  },
  diffText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  checkCircle: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center',
  },

  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.gold, paddingVertical: 16,
    borderRadius: Radii.full, gap: 8, marginTop: Spacing.md,
    ...Shadows.gold,
  },
  startBtnDisabled: {
    backgroundColor: Colors.bgElevated, shadowOpacity: 0, elevation: 0,
  },
  startBtnText: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.bg, letterSpacing: 0.5 },
  startBtnTextDisabled: { color: Colors.textMuted },
});
