import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
  Animated, Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors, FontSizes, Spacing, Radii, Shadows } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function FoodCameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [captured, setCaptured] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const cameraRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true })
    ).start();
  }, []);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permContainer}>
        <View style={styles.permIconContainer}>
          <Ionicons name="camera-outline" size={32} color={Colors.gold} />
        </View>
        <Text style={styles.permTitle}>Camera Permission Needed</Text>
        <Text style={styles.permDesc}>
          Allow camera access to analyze meal portions and estimate caloric content.
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission} activeOpacity={0.85}>
          <Text style={styles.permBtnText}>Enable Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Return</Text>
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
      // Fallback in dev/mock environments
    }

    setTimeout(() => {
      setAnalyzing(false);
      navigation.replace('FoodResult', { photoUri });
    }, 1200);
  };

  const scanLineY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_SIZE - 4],
  });

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing}>
        {/* Top bar overlay */}
        <View style={styles.topOverlay}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.topBadge}>
            <Ionicons name="scan-outline" size={13} color={Colors.gold} />
            <Text style={styles.topBadgeText}>AI NUTRITION SCANNER</Text>
          </View>
          <TouchableOpacity
            style={styles.flipBtn}
            onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}
          >
            <Ionicons name="camera-reverse-outline" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Scan Reticle Frame */}
        {!analyzing && (
          <View style={styles.scanFrame}>
            {[
              { top: 0, left: 0 },
              { top: 0, right: 0 },
              { bottom: 0, left: 0 },
              { bottom: 0, right: 0 },
            ].map((pos, i) => (
              <View key={i} style={[styles.corner, pos]} />
            ))}
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY: scanLineY }] }]}
            />
            <Text style={styles.scanHint}>Align meal within the frame</Text>
          </View>
        )}

        {/* Analyzing state overlay */}
        {analyzing && (
          <View style={styles.analyzingOverlay}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={styles.analyzingText}>Analyzing Nutritional Breakdown</Text>
            <Text style={styles.analyzingSubtext}>Estimating macros & calories</Text>
          </View>
        )}

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <Text style={styles.hint}>Hold device steady and tap capture</Text>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.captureBtn, analyzing && styles.captureBtnDisabled]}
              onPress={handleCapture}
              activeOpacity={0.8}
            >
              <View style={styles.captureBtnInner} />
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.mockNote}>COMPUTER VISION MODEL</Text>
        </View>
      </CameraView>
    </View>
  );
}

const FRAME_SIZE = width * 0.72;

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

  topOverlay: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  topBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(10,10,13,0.85)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radii.full,
    borderWidth: 1, borderColor: Colors.borderGold,
  },
  topBadgeText: { fontSize: 10, color: Colors.gold, fontWeight: '800', letterSpacing: 1 },
  flipBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
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
    width: 22, height: 22,
    borderColor: Colors.gold, borderWidth: 2.5,
  },
  scanLine: {
    position: 'absolute',
    left: 0, right: 0, height: 2,
    backgroundColor: Colors.gold, opacity: 0.9,
  },
  scanHint: {
    fontSize: 10, color: '#fff',
    marginBottom: 12, fontWeight: '600', letterSpacing: 0.8,
    backgroundColor: 'rgba(10,10,13,0.75)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.full,
    textTransform: 'uppercase',
  },

  analyzingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,13,0.85)',
    alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  analyzingText: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.textPrimary },
  analyzingSubtext: { fontSize: FontSizes.xs, color: Colors.gold, letterSpacing: 0.5 },

  bottomControls: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingBottom: 44, paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', gap: 14,
  },
  hint: { fontSize: FontSizes.xs, color: Colors.textSecondary },
  captureBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'transparent',
    borderWidth: 3, borderColor: Colors.gold,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.gold,
  },
  captureBtnDisabled: { borderColor: Colors.textMuted },
  captureBtnInner: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.gold,
  },
  mockNote: {
    fontSize: 8, color: Colors.textMuted,
    letterSpacing: 1, textTransform: 'uppercase',
  },
});
