import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  AppState,
  Animated,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import SkeletonOverlay from '../components/SkeletonOverlay';
import FormTipToast from '../components/FormTipToast';
import useAppStore from '../store/useAppStore';

const { width, height } = Dimensions.get('window');

const REP_PHASES = ['DESCENT (ECCENTRIC)', 'PEAK CONTRACTION', 'ASCENT (CONCENTRIC)', 'LOCKOUT'];

export default function WorkoutCameraScreen({ navigation, route }) {
  const { exercise } = route.params || {};
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('front');
  const [isTracking, setIsTracking] = useState(false);
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(1);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [formScore, setFormScore] = useState(94);
  const [jointAngle, setJointAngle] = useState(175);
  const [coachingMessage, setCoachingMessage] = useState('Position yourself in front of camera');
  const [currentTip, setCurrentTip] = useState('');
  const [tipVisible, setTipVisible] = useState(false);

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const { addWorkoutSession, recordWorkoutStreak } = useAppStore();

  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const phaseProgress = useRef(new Animated.Value(0)).current;

  // Timer refs
  const trackingInterval = useRef(null);
  const clockTimer = useRef(null);
  const tipTimer = useRef(null);
  const aiCoachTimer = useRef(null);

  // Form cues for the current exercise
  const formCues = exercise?.formCues || [
    'Maintain neutral spine and rigid core brace',
    'Full range of motion at peak contraction',
    'Exhale smoothly through the concentric drive',
    'Control the 2-second eccentric tempo',
    'Keep chest proud and shoulders engaged',
  ];

  useEffect(() => {
    // Pulse animation for AI tracker status
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') {
        stopTimers();
      }
    });

    return () => {
      appStateSub.remove();
      stopTimers();
    };
  }, []);

  const stopTimers = () => {
    if (trackingInterval.current) clearInterval(trackingInterval.current);
    if (clockTimer.current) clearInterval(clockTimer.current);
    if (tipTimer.current) clearTimeout(tipTimer.current);
    if (aiCoachTimer.current) clearInterval(aiCoachTimer.current);
  };

  const startTracking = () => {
    setIsTracking(true);
    setCoachingMessage(`Zeus AI: Tracking ${exercise?.name || 'Workout'} biomechanics`);

    // Clock
    clockTimer.current = setInterval(() => {
      setElapsedSecs((s) => s + 1);
    }, 1000);

    // AI Biomechanical Tracking Simulation
    let phase = 0;
    trackingInterval.current = setInterval(() => {
      phase = (phase + 1) % REP_PHASES.length;
      setCurrentPhaseIdx(phase);

      // Simulate joint angle changes based on movement phase
      if (phase === 0) {
        // Eccentric descent
        setJointAngle(130);
        setCoachingMessage('Zeus AI: Controlled descent — loading target muscles');
      } else if (phase === 1) {
        // Deep peak
        setJointAngle(88);
        setCoachingMessage('Zeus AI: Optimal depth achieved! Drive upward!');
      } else if (phase === 2) {
        // Concentric ascent
        setJointAngle(145);
        setCoachingMessage('Zeus AI: Powerful concentric drive — maintain tempo');
      } else {
        // Lockout / Rep completed!
        setJointAngle(178);
        setCoachingMessage('Zeus AI: Rep completed with optimal biomechanics!');
        setReps((r) => {
          const newReps = r + 1;
          if (newReps % 8 === 0) {
            setSets((s) => s + 1);
            setCoachingMessage(`Zeus AI: Set ${Math.ceil(newReps / 8)} completed! Excellent work.`);
          }
          return newReps;
        });
        // Fluctuate form score realistically between 90-98
        setFormScore(Math.floor(90 + Math.random() * 8));
      }
    }, 1200);

    // AI periodic form tips
    scheduleTip();
  };

  function scheduleTip() {
    const delay = 6000 + Math.random() * 4000;
    tipTimer.current = setTimeout(() => {
      const tip = formCues[Math.floor(Math.random() * formCues.length)];
      setCurrentTip(tip);
      setTipVisible(true);
      scheduleTip();
    }, delay);
  }

  const stopTracking = () => {
    stopTimers();
    setIsTracking(false);

    const caloriesBurned = Math.max(12, Math.round(reps * (exercise?.caloriesPerRep || 0.5) * 1.5 + elapsedSecs * 0.15));
    const finalScore = Math.max(88, formScore);

    const session = {
      exercise: exercise?.name || 'Workout Session',
      category: exercise?.category || 'Strength',
      reps: Math.max(reps, 1),
      sets: sets || Math.ceil(reps / 8) || 1,
      duration: elapsedSecs,
      caloriesBurned,
      formScore: finalScore,
    };

    addWorkoutSession(session);
    recordWorkoutStreak();
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
          <Ionicons name="camera-outline" size={36} color={Colors.gold} />
        </View>
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permDesc}>
          Project Zeus AI needs camera access for computer vision pose tracking, joint angle analysis, and rep counting.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission} activeOpacity={0.85}>
          <Text style={styles.permBtnText}>Enable Camera Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Return to Exercises</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} facing={facing}>
        {/* Pose Skeleton Overlay */}
        <SkeletonOverlay width={width * 0.55} height={height * 0.55} />

        {/* Top Header HUD */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              stopTimers();
              navigation.goBack();
            }}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.exercisePill}>
            <Ionicons name={exercise?.icon || 'barbell-outline'} size={14} color={Colors.gold} />
            <Text style={{ color: Colors.gold, fontSize: FontSizes.sm }}>{exercise?.name || 'Workout'} </Text>
          </View>

          <View style={styles.topRightActions}>
            <TouchableOpacity style={styles.flipBtn} onPress={toggleCameraFacing} activeOpacity={0.75}>
              <Ionicons name="camera-reverse-outline" size={20} color={Colors.gold} />
            </TouchableOpacity>

            <View style={styles.timerBox}>
              <Text style={styles.timerText}>{formatTime(elapsedSecs)}</Text>
            </View>
          </View>
        </View>

        {/* AI Agent Status Pill */}
        <View style={styles.aiStatusRow}>
          <Animated.View style={[styles.aiPulseDot, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={styles.aiStatusText}>
            {isTracking ? 'ZEUS VISION AI • ACTIVE TRACKING' : 'ZEUS VISION AI • STANDBY'}
          </Text>
        </View>

        {/* Live Form Score & Joint Telemetry (Active when tracking) */}
        {isTracking && (
          <View style={styles.telemetryOverlay}>
            <View style={styles.telemetryCard}>
              <Text style={styles.telemetryScoreVal}>{formScore}%</Text>
              <Text style={styles.telemetryScoreLabel}>FORM PRECISION</Text>
            </View>
            <View style={styles.telemetryCard}>
              <Text style={styles.telemetryAngleVal}>{jointAngle}°</Text>
              <Text style={styles.telemetryScoreLabel}>JOINT FLEXION</Text>
            </View>
          </View>
        )}

        {/* AI Live Coaching Banner */}
        <View style={styles.coachingBanner}>
          <View style={styles.coachAvatar}>
            <Ionicons name="sparkles" size={14} color={Colors.gold} />
          </View>
          <Text style={styles.coachingText} numberOfLines={2}>
            {coachingMessage}
          </Text>
        </View>

        {/* Rep Phase Meter */}
        {isTracking && (
          <View style={styles.phaseContainer}>
            <Text style={styles.phaseLabel}>PHASE: {REP_PHASES[currentPhaseIdx]}</Text>
            <View style={styles.phaseBar}>
              <View style={[styles.phaseFill, { width: `${((currentPhaseIdx + 1) / REP_PHASES.length) * 100}%` }]} />
            </View>
          </View>
        )}

        {/* Rep & Set Counters */}
        <View style={styles.countersRow}>
          <View style={styles.counterBox}>
            <Text style={styles.counterValue}>{reps}</Text>
            <Text style={styles.counterLabel}>REPS</Text>
          </View>
          <View style={[styles.counterBox, styles.counterBoxSet]}>
            <Text style={[styles.counterValue, { color: Colors.gold }]}>{sets}</Text>
            <Text style={styles.counterLabel}>SETS</Text>
          </View>
          <View style={styles.counterBox}>
            <Text style={[styles.counterValue, { color: Colors.orange }]}>
              {Math.max(0, Math.round(reps * (exercise?.caloriesPerRep || 0.5) * 1.5 + elapsedSecs * 0.15))}
            </Text>
            <Text style={styles.counterLabel}>KCAL</Text>
          </View>
        </View>

        {/* Form Tip Toast */}
        <FormTipToast tip={currentTip} visible={tipVisible} onHide={() => setTipVisible(false)} />

        {/* Bottom Action Controls */}
        <View style={styles.bottomControls}>
          {!isTracking ? (
            <TouchableOpacity style={styles.startBtn} onPress={startTracking} activeOpacity={0.85}>
              <Ionicons name="play" size={20} color={Colors.bg} />
              <Text style={styles.startBtnText}>START AI TRACKING</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopBtn} onPress={stopTracking} activeOpacity={0.85}>
              <Ionicons name="stop" size={20} color="#fff" />
              <Text style={styles.stopBtnText}>COMPLETE & LOG WORKOUT</Text>
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
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  permIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.goldGlow,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  permTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  permDesc: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  permBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: Radii.full,
    marginBottom: 14,
    ...Shadows.gold,
  },
  permBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: Colors.bg,
    letterSpacing: 0.5,
  },
  backBtn: { paddingVertical: 10 },
  backBtnText: { fontSize: FontSizes.xs, color: Colors.textSecondary },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exercisePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10,10,13,0.92)',
    borderRadius: Radii.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flipBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(10,10,13,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  timerBox: {
    backgroundColor: 'rgba(10,10,13,0.92)',
    borderRadius: Radii.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timerText: {
    fontSize: FontSizes.sm,
    fontWeight: '800',
    color: Colors.gold,
    fontVariant: ['tabular-nums'],
  },

  aiStatusRow: {
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10,10,13,0.85)',
    borderRadius: Radii.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  aiPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  aiStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 1,
  },

  telemetryOverlay: {
    position: 'absolute',
    top: 110,
    left: 16,
    gap: 8,
  },
  telemetryCard: {
    backgroundColor: 'rgba(10,10,13,0.88)',
    borderRadius: Radii.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    alignItems: 'center',
  },
  telemetryScoreVal: {
    fontSize: FontSizes.md,
    fontWeight: '900',
    color: '#22c55e',
  },
  telemetryAngleVal: {
    fontSize: FontSizes.md,
    fontWeight: '900',
    color: Colors.gold,
  },
  telemetryScoreLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginTop: 1,
  },

  coachingBanner: {
    position: 'absolute',
    top: 175,
    alignSelf: 'center',
    width: width * 0.88,
    backgroundColor: 'rgba(19, 19, 26, 0.94)',
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  coachAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.goldGlow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  coachingText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },

  phaseContainer: {
    position: 'absolute',
    bottom: 195,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(10,10,13,0.85)',
    borderRadius: Radii.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  phaseLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center',
  },
  phaseBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  phaseFill: {
    height: '100%',
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },

  countersRow: {
    position: 'absolute',
    bottom: 110,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  counterBox: {
    flex: 1,
    backgroundColor: 'rgba(10,10,13,0.92)',
    borderRadius: Radii.lg,
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  counterBoxSet: {
    borderColor: Colors.borderGold,
  },
  counterValue: {
    fontSize: FontSizes.xxl,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  counterLabel: {
    fontSize: 8,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  bottomControls: {
    position: 'absolute',
    bottom: 36,
    left: 20,
    right: 20,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    borderRadius: Radii.full,
    gap: 8,
    ...Shadows.gold,
  },
  startBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: '900',
    color: Colors.bg,
    letterSpacing: 1,
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.danger,
    paddingVertical: 16,
    borderRadius: Radii.full,
    gap: 8,
  },
  stopBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
});
