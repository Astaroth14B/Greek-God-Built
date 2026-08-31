import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, AppState,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import SkeletonOverlay from '../components/SkeletonOverlay';
import FormTipToast from '../components/FormTipToast';
import useAppStore from '../store/useAppStore';

const { width, height } = Dimensions.get('window');

const FORM_TIPS = [
  'Maintain neutral spinal alignment',
  'Increase depth to achieve full range of motion',
  'Track knees in direct alignment with mid-foot',
  'Exhale smoothly through the concentric phase',
  'Brace your abdominal wall throughout the rep',
  'Control eccentric tempo with 2-second descent',
  'Keep chest proud and shoulders depressed',
  'Drive upward through the center of your feet',
  'Achieve peak contraction at top of movement',
  'Maintain steady cadence without momentum',
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
    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        clearInterval(repTimer.current);
        clearInterval(clockTimer.current);
        clearTimeout(tipTimer.current);
      }
    });

    return () => {
      appStateSub.remove();
      clearInterval(repTimer.current);
      clearInterval(clockTimer.current);
      clearTimeout(tipTimer.current);
    };
  }, []);

  const startTracking = () => {
    setIsTracking(true);

    repTimer.current = setInterval(() => {
      setReps((r) => {
        const newReps = r + 1;
        if (newReps % 8 === 0) setSets((s) => s + 1);
        return newReps;
      });
    }, 2500);

    scheduleTip();
    clockTimer.current = setInterval(() => setElapsedSecs((s) => s + 1), 1000);
  };

  function scheduleTip() {
    const delay = 8000 + Math.random() * 4000;
    tipTimer.current = setTimeout(() => {
      const tip = FORM_TIPS[Math.floor(Math.random() * FORM_TIPS.length)];
      setCurrentTip(tip);
      setTipVisible(true);
      scheduleTip();
    }, delay);
  }

  const stopTracking = () => {
    clearInterval(repTimer.current);
    clearTimeout(tipTimer.current);
    clearInterval(clockTimer.current);
    setIsTracking(false);

    const caloriesBurned = Math.round(reps * 0.5 * (exercise?.id === 'deadlift' ? 1.5 : 1));
    const formScore = Math.round(75 + Math.random() * 20);

    const session = {
      exercise: exercise?.name || 'Workout Session',
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
        <View style={styles.permIconContainer}>
          <Ionicons name="camera-outline" size={32} color={Colors.gold} />
        </View>
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permDesc}>
          Enable camera access for computer vision pose analysis and automatic rep counting.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Enable Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Return</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} facing="front">
        {/* Pose Skeleton Overlay */}
        <SkeletonOverlay width={width * 0.55} height={height * 0.55} />

        {/* Top HUD */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              clearInterval(repTimer.current);
              clearTimeout(tipTimer.current);
              clearInterval(clockTimer.current);
              navigation.goBack();
            }}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.exercisePill}>
            <Ionicons name="barbell-outline" size={14} color={Colors.gold} />
            <Text style={styles.exerciseName}>{exercise?.name || 'Workout'}</Text>
          </View>

          <View style={styles.timerBox}>
            <Text style={styles.timerText}>{formatTime(elapsedSecs)}</Text>
          </View>
        </View>

        {/* Framing reminder */}
        {!isTracking && (
          <View style={styles.reminderBox}>
            <Text style={styles.reminderText}>
              Position device 5–6 ft away for full-body tracking.{'\n'}
              Front camera enabled · Prop phone against vertical surface.
            </Text>
          </View>
        )}

        {/* Rep & Set Counters */}
        <View style={styles.countersRow}>
          <View style={styles.counterBox}>
            <Text style={styles.counterValue}>{reps}</Text>
            <Text style={styles.counterLabel}>REPS</Text>
          </View>
          <View style={[styles.counterBox, styles.counterBoxSet]}>
            <Text style={[styles.counterValue, { color: Colors.gold }]}>
              {sets || Math.ceil(reps / 8) || 0}
            </Text>
            <Text style={styles.counterLabel}>SETS</Text>
          </View>
        </View>

        {/* Simulated status */}
        <View style={styles.mockLabel}>
          <Text style={styles.mockText}>VISION AI • POSE TRACKER</Text>
        </View>

        {/* Form Tip Toast */}
        <FormTipToast
          tip={currentTip}
          visible={tipVisible}
          onHide={() => setTipVisible(false)}
        />

        {/* Bottom Action Controls */}
        <View style={styles.bottomControls}>
          {!isTracking ? (
            <TouchableOpacity style={styles.startBtn} onPress={startTracking} activeOpacity={0.85}>
              <Ionicons name="play" size={20} color={Colors.bg} />
              <Text style={styles.startBtnText}>Start Tracking</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopBtn} onPress={stopTracking} activeOpacity={0.85}>
              <Ionicons name="stop" size={20} color="#fff" />
              <Text style={styles.stopBtnText}>Complete Session</Text>
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
  permIconContainer: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.goldGlow, borderWidth: 1, borderColor: Colors.borderGold,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  permTitle: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  permDesc: { fontSize: FontSizes.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  permBtn: {
    backgroundColor: Colors.gold, paddingVertical: 14, paddingHorizontal: 36,
    borderRadius: Radii.full, marginBottom: 12, ...Shadows.gold,
  },
  permBtnText: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.bg, letterSpacing: 0.5 },
  backBtn: { paddingVertical: 10 },
  backBtnText: { fontSize: FontSizes.xs, color: Colors.textSecondary },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  exercisePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(10,10,13,0.85)', borderRadius: Radii.full,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  exerciseName: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.textPrimary },
  timerBox: {
    backgroundColor: 'rgba(10,10,13,0.85)', borderRadius: Radii.sm,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.border,
  },
  timerText: { fontSize: FontSizes.sm, fontWeight: '800', color: Colors.gold, fontVariant: ['tabular-nums'] },

  reminderBox: {
    alignSelf: 'center', marginTop: 20,
    backgroundColor: 'rgba(10,10,13,0.85)', borderRadius: Radii.md,
    paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    maxWidth: width * 0.85,
  },
  reminderText: {
    fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', lineHeight: 18,
  },

  countersRow: {
    position: 'absolute', bottom: 130, left: 20, right: 20,
    flexDirection: 'row', gap: 12,
  },
  counterBox: {
    flex: 1, backgroundColor: 'rgba(10,10,13,0.88)',
    borderRadius: Radii.lg, alignItems: 'center', paddingVertical: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  counterBoxSet: { borderColor: Colors.borderGold },
  counterValue: { fontSize: FontSizes.xxxl, fontWeight: '900', color: Colors.textPrimary },
  counterLabel: {
    fontSize: 9, color: Colors.textMuted,
    letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2,
  },

  mockLabel: {
    position: 'absolute', top: 125, alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: Radii.full,
    paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: Colors.border,
  },
  mockText: { fontSize: 8, color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' },

  bottomControls: {
    position: 'absolute', bottom: 44, left: 20, right: 20,
  },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.gold, paddingVertical: 16,
    borderRadius: Radii.full, gap: 8, ...Shadows.gold,
  },
  startBtnText: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.bg, letterSpacing: 0.5 },
  stopBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.danger, paddingVertical: 16,
    borderRadius: Radii.full, gap: 8,
  },
  stopBtnText: { fontSize: FontSizes.md, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
});
