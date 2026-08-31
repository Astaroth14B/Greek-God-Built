import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  Animated, Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function FoodCameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [captured, setCaptured] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const cameraRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for capture button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Scan line animation
    Animated.loop(
      Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true })
    ).start();
  }, []);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permContainer}>
        <Text style={styles.permEmoji}>📷</Text>
        <Text style={styles.permTitle}>Camera Access Needed</Text>
        <Text style={styles.permDesc}>
          We need camera access to analyze your food and estimate calories.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Access</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (analyzing || captured) return;
    setCaptured(true);
    setAnalyzing(true);

    let photoUri = null;
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
        photoUri = photo?.uri || null;
      }
    } catch (e) {
      // Fallback for emulator / mock environments
    }

    // Simulate 1.2s analysis delay for Vision AI experience
    setTimeout(() => {
      setAnalyzing(false);
      navigation.replace('FoodResult', { photoUri });
    }, 1200);
  };

  const scanLineY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing}>
        {/* Top overlay */}
        <View style={styles.topOverlay}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.topBadge}>
            <Ionicons name="flash" size={14} color={Colors.accent} />
            <Text style={styles.topBadgeText}>AI Calorie Scanner</Text>
          </View>
          <TouchableOpacity
            style={styles.flipBtn}
            onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
          >
            <Ionicons name="camera-reverse" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Scan Frame */}
        {!analyzing && (
          <View style={styles.scanFrame}>
            {/* Corner marks */}
            {[
              { top: 0, left: 0 },
              { top: 0, right: 0 },
              { bottom: 0, left: 0 },
              { bottom: 0, right: 0 },
            ].map((pos, i) => (
              <View key={i} style={[styles.corner, pos]} />
            ))}
            {/* Scan line */}
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]}
            />
            <Text style={styles.scanHint}>Center your food in the frame</Text>
          </View>
        )}

        {/* Analyzing overlay */}
        {analyzing && (
          <View style={styles.analyzingOverlay}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.analyzingText}>Analyzing food...</Text>
            <Text style={styles.analyzingSubtext}>Identifying nutrition info</Text>
          </View>
        )}

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <Text style={styles.hint}>📸 Point at your meal and tap to analyze</Text>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.captureBtn, analyzing && styles.captureBtnDisabled]}
              onPress={handleCapture}
              activeOpacity={0.8}
            >
              <View style={styles.captureBtnInner} />
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.mockNote}>MOCK • AI Result Simulated</Text>
        </View>
      </CameraView>
    </View>
  );
}

const FRAME_SIZE = width * 0.7;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  permContainer: {
    flex: 1, backgroundColor: Colors.bg,
    alignItems: 'center', justifyContent: 'center', padding: Spacing.xl,
  },
  permEmoji: { fontSize: 56, marginBottom: 16 },
  permTitle: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8, textAlign: 'center' },
  permDesc: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  permBtn: {
    backgroundColor: Colors.accent, paddingVertical: 14, paddingHorizontal: 36,
    borderRadius: Radii.full, marginBottom: 12, ...Shadows.accent,
  },
  permBtnText: { fontSize: FontSizes.md, fontWeight: '800', color: Colors.bg },
  backBtn: { paddingVertical: 10 },
  backBtnText: { fontSize: FontSizes.md, color: Colors.textSecondary },

  topOverlay: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  topBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.borderAccent,
  },
  topBadgeText: { fontSize: FontSizes.xs, color: Colors.accent, fontWeight: '700', letterSpacing: 0.5 },
  flipBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },

  scanFrame: {
    alignSelf: 'center',
    width: FRAME_SIZE, height: FRAME_SIZE,
    marginTop: 40, position: 'relative',
    alignItems: 'center', justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 24, height: 24,
    borderColor: Colors.accent, borderWidth: 3,
    borderTopRightRadius: 0, borderBottomLeftRadius: 0,
  },
  scanLine: {
    position: 'absolute',
    left: 0, right: 0, height: 2,
    backgroundColor: Colors.accent, opacity: 0.8,
    shadowColor: Colors.accent, shadowRadius: 8, shadowOpacity: 1,
  },
  scanHint: {
    fontSize: FontSizes.xs, color: 'rgba(255,255,255,0.7)',
    marginBottom: 12, fontWeight: '600', letterSpacing: 0.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full,
  },

  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  analyzingText: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.textPrimary },
  analyzingSubtext: { fontSize: FontSizes.sm, color: Colors.accent },

  bottomControls: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingBottom: 50, paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', gap: 16,
  },
  hint: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.8)' },
  captureBtn: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 4, borderColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.accent,
  },
  captureBtnDisabled: { borderColor: Colors.textMuted },
  captureBtnInner: {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: Colors.accent,
  },
  mockNote: {
    fontSize: 9, color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1, textTransform: 'uppercase',
  },
});
