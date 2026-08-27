import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import SkeletonOverlay from '../components/SkeletonOverlay';
import FormTipToast from '../components/FormTipToast';
import useAppStore from '../store/useAppStore';

const { width, height } = Dimensions.get('window');

// MOCK: replace with real model inference - MediaPipe BlazePose or similar
const FORM_TIPS = [
  'Keep your back straight',
  'Go slightly deeper on the squat',
  'Keep your knees in line with your toes',
  'Breathe out on the way up',
  'Engage your core throughout',
  'Control the descent — don\'t drop!',
  'Keep your chin up, chest proud',
  'Drive through your heels',
  'Squeeze at the top of the movement',
  'Full range of motion — go lower!',
];

export default function WorkoutCameraScreen({ navigation, route }) {
  const { exercise } = route.params || {};
  const [permission, requestPermission] = useCameraPermissions();
  const [isTracking, setIsTracking] = useState(false);
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);
  const [currentTip, setCurrentTip] = useState('');
  const [tipVisible, setTipVisible] = useState(false);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const { addWorkoutSession, incrementStreak } = useAppStore();

  const repTimer = useRef(null);
  const tipTimer = useRef(null);
  const clockTimer = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(repTimer.current);
      clearInterval(tipTimer.current);
      clearInterval(clockTimer.current);
    };
  }, []);

  const startTracking = () => {
    setIsTracking(true);

    // MOCK: increment rep every ~2.5 seconds
    repTimer.current = setInterval(() => {
      setReps((r) => {
        const newReps = r + 1;
        if (newReps % 8 === 0) setSets((s) => s + 1);
        return newReps;
      });
    }, 2500);

    // MOCK: show random form tip every 8–12 seconds
    tipTimer.current = setInterval(() => {
      const tip = FORM_TIPS[Math.floor(Math.random() * FORM_TIPS.length)];
      setCurrentTip(tip);
      setTipVisible(true);
    }, 8000 + Math.random() * 4000);

    // Clock
    clockTimer.current = setInterval(() => setElapsedSecs((s) => s + 1), 1000);
  };

  const stopTracking = () => {
    clearInterval(repTimer.current);
    clearInterval(tipTimer.current);
    clearInterval(clockTimer.current);
    setIsTracking(false);

    // Save session
    const caloriesBurned = Math.round(reps * 0.5 * (exercise?.id === 'deadlift' ? 1.5 : 1));
    const formScore = Math.round(70 + Math.random() * 25);

    const session = {
      exercise: exercise?.name || 'Unknown',
      reps,
      sets: sets || Math.ceil(reps / 8),
      duration: elapsedSecs,
      caloriesBurned,
      formScore,
    };

    addWorkoutSession(session);
    incrementStreak();
    navigation.replace('WorkoutSummary', { session });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permContainer}>
        <Text style={styles.permEmoji}>🎥</Text>
        <Text style={styles.permTitle}>Camera Needed</Text>
        <Text style={styles.permDesc}>Grant camera access to track your workout form.</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Access</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} facing="front">
        {/* Skeleton overlay */}
        <SkeletonOverlay width={width * 0.55} height={height * 0.55} />

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              clearInterval(repTimer.current);
              clearInterval(tipTimer.current);
              clearInterval(clockTimer.current);
              navigation.goBack();
            }}
          >
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.exercisePill}>
            <Text style={styles.exerciseEmoji}>{exercise?.emoji || '💪'}</Text>
            <Text style={styles.exerciseName}>{exercise?.name || 'Workout'}</Text>
          </View>

          <View style={styles.timerBox}>
            <Text style={styles.timerText}>{formatTime(elapsedSecs)}</Text>
          </View>
        </View>

        {/* Stand back reminder */}
        {!isTracking && (
          <View style={styles.reminderBox}>
            <Text style={styles.reminderText}>
              📐 Stand 5–6 ft back so your full body is visible.{'\n'}
              Front camera is active — prop your phone on a stand.
            </Text>
          </View>
        )}

        {/* Rep/Set Counters */}
        <View style={styles.countersRow}>
          <View style={styles.counterBox}>
            <Text style={styles.counterValue}>{reps}</Text>
            <Text style={styles.counterLabel}>REPS</Text>
          </View>
          <View style={[styles.counterBox, styles.counterBoxSet]}>
            <Text style={[styles.counterValue, { color: Colors.green }]}>
              {sets || Math.ceil(reps / 8) || 0}
            </Text>
            <Text style={styles.counterLabel}>SETS</Text>
          </View>
        </View>

        {/* MOCK label */}
        <View style={styles.mockLabel}>
          <Text style={styles.mockText}>MOCK AI • Pose estimation simulated</Text>
        </View>

        {/* Form Tip Toast */}
        <FormTipToast
          tip={currentTip}
          visible={tipVisible}
          onHide={() => setTipVisible(false)}
        />

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          {!isTracking ? (
            <TouchableOpacity style={styles.startBtn} onPress={startTracking}>
              <Ionicons name="play" size={24} color={Colors.bg} />
              <Text style={styles.startBtnText}>Start Tracking</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopBtn} onPress={stopTracking}>
              <Ionicons name="stop" size={24} color="#fff" />
              <Text style={styles.stopBtnText}>End Session</Text>
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  permContainer: {
    flex: 1, backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center', padding: Spacing.xl,
  },
  permEmoji: { fontSize: 56, marginBottom: 16 },
  permTitle: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  permDesc: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  permBtn: {
    backgroundColor: Colors.green, paddingVertical: 14, paddingHorizontal: 36,
    borderRadius: Radii.full, marginBottom: 12,
  },
  permBtnText: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.bg },
  backBtn: { paddingVertical: 10 },
  backBtnText: { fontSize: FontSizes.md, color: Colors.textSecondary },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  exercisePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: Radii.full,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.green + '66',
  },
  exerciseEmoji: { fontSize: 18 },
  exerciseName: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.textPrimary },
  timerBox: {
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: Radii.md,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  timerText: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.green, fontVariant: ['tabular-nums'] },

  reminderBox: {
    alignSelf: 'center', marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: Radii.md,
    paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    maxWidth: width * 0.85,
  },
  reminderText: {
    fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', lineHeight: 18,
  },

  countersRow: {
    position: 'absolute', bottom: 140, left: 20, right: 20,
    flexDirection: 'row', gap: 12,
  },
  counterBox: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: Radii.lg, alignItems: 'center', paddingVertical: 14,
    borderWidth: 1.5, borderColor: Colors.accent + '66',
  },
  counterBoxSet: { borderColor: Colors.green + '66' },
  counterValue: { fontSize: FontSizes.xxxl, fontWeight: '900', color: Colors.accent },
  counterLabel: {
    fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2, textTransform: 'uppercase', marginTop: 2,
  },

  mockLabel: {
    position: 'absolute', top: 130, alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: Radii.full,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  mockText: { fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase' },

  bottomControls: {
    position: 'absolute', bottom: 50, left: 20, right: 20,
  },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.green, paddingVertical: 18,
    borderRadius: Radii.full, gap: 10, ...Shadows.green,
  },
  startBtnText: { fontSize: FontSizes.xl, fontWeight: '900', color: Colors.bg },
  stopBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.danger, paddingVertical: 18,
    borderRadius: Radii.full, gap: 10,
    shadowColor: Colors.danger, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12,
  },
  stopBtnText: { fontSize: FontSizes.xl, fontWeight: '900', color: '#fff' },
});
