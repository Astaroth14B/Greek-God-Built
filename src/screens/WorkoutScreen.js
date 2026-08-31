import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated,
} from 'react-native';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';

const EXERCISES = [
  { id: 'squat', name: 'Barbell Squat', emoji: '🦵', muscles: 'Quads, Glutes, Core', difficulty: 'Intermediate' },
  { id: 'pushup', name: 'Push-Up', emoji: '💪', muscles: 'Chest, Shoulders, Triceps', difficulty: 'Beginner' },
  { id: 'deadlift', name: 'Deadlift', emoji: '🏋️', muscles: 'Back, Hamstrings, Glutes', difficulty: 'Advanced' },
  { id: 'lunges', name: 'Walking Lunges', emoji: '🚶', muscles: 'Quads, Glutes, Balance', difficulty: 'Beginner' },
  { id: 'ohpress', name: 'Overhead Press', emoji: '🙌', muscles: 'Shoulders, Triceps, Core', difficulty: 'Intermediate' },
  { id: 'pullup', name: 'Pull-Up', emoji: '🔝', muscles: 'Lats, Biceps, Rear Delt', difficulty: 'Advanced' },
];

const DIFFICULTY_COLORS = {
  Beginner: Colors.green,
  Intermediate: Colors.accent,
  Advanced: Colors.orange,
};

export default function WorkoutScreen({ navigation }) {
  const [selected, setSelected] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Form Tracker</Text>
          <Text style={styles.subtitle}>
            Pick an exercise and our AI will count your reps and coach your form in real time.
          </Text>
        </View>

        {/* How it works */}
        <Card style={styles.howCard}>
          <Text style={styles.howTitle}>⚡ How it works</Text>
          <View style={styles.step}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
            <Text style={styles.stepText}>Choose your exercise below</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
            <Text style={styles.stepText}>Prop your phone 5–6 ft away (front-facing camera)</Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNum}><Text style={styles.stepNumText}>3</Text></View>
            <Text style={styles.stepText}>AI tracks your reps and gives real-time form tips</Text>
          </View>
        </Card>

        {/* Exercise Selection */}
        <Text style={styles.sectionTitle}>Choose Exercise</Text>
        {EXERCISES.map((ex) => (
          <TouchableOpacity
            key={ex.id}
            style={[styles.exerciseCard, selected === ex.id && styles.exerciseCardActive]}
            onPress={() => setSelected(ex.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.exerciseEmoji}>{ex.emoji}</Text>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exerciseMuscles}>{ex.muscles}</Text>
            </View>
            <View>
              <View style={[
                styles.diffBadge,
                { backgroundColor: DIFFICULTY_COLORS[ex.difficulty] + '20', borderColor: DIFFICULTY_COLORS[ex.difficulty] + '55' }
              ]}>
                <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[ex.difficulty] }]}>
                  {ex.difficulty}
                </Text>
              </View>
              {selected === ex.id && (
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={14} color={Colors.bg} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startBtn, !selected && styles.startBtnDisabled]}
          disabled={!selected}
          onPress={() => navigation.navigate('WorkoutCamera', {
            exercise: EXERCISES.find((e) => e.id === selected),
          })}
        >
          <Ionicons name="camera" size={22} color={Colors.bg} />
          <Text style={styles.startBtnText}>
            {selected
              ? `Start ${EXERCISES.find(e => e.id === selected)?.name} Session`
              : 'Select an exercise to start'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.md, paddingTop: 60, paddingBottom: 40 },

  header: { marginBottom: Spacing.lg },
  title: { fontSize: FontSizes.xxxl, fontWeight: '900', color: Colors.textPrimary },
  subtitle: { fontSize: FontSizes.md, color: Colors.textSecondary, marginTop: 6, lineHeight: 22 },

  howCard: { marginBottom: Spacing.lg, borderColor: Colors.accentGlow },
  howTitle: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.accent, marginBottom: 12 },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stepNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.accentGlow, borderWidth: 1, borderColor: Colors.borderAccent,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  stepNumText: { fontSize: FontSizes.xs, fontWeight: '800', color: Colors.accent },
  stepText: { flex: 1, fontSize: FontSizes.sm, color: Colors.textSecondary },

  sectionTitle: {
    fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },

  exerciseCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.bgCard, borderRadius: Radii.md,
    padding: 14, marginBottom: 8, borderWidth: 1.5, borderColor: Colors.border,
  },
  exerciseCardActive: {
    borderColor: Colors.accent, backgroundColor: Colors.accentGlow,
  },
  exerciseEmoji: { fontSize: 28, marginRight: 12 },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary },
  exerciseMuscles: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 3 },
  diffBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: Radii.full, borderWidth: 1,
  },
  diffText: { fontSize: FontSizes.xs, fontWeight: '700' },
  checkCircle: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
    marginTop: 6, alignSelf: 'center',
  },

  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.green, paddingVertical: 16,
    borderRadius: Radii.full, gap: 10, marginTop: Spacing.md,
    ...Shadows.green,
  },
  startBtnDisabled: {
    backgroundColor: Colors.bgElevated, shadowOpacity: 0, elevation: 0,
  },
  startBtnText: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.bg },
});
