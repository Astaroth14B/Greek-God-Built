import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Colors, FontSizes, Radii, Spacing } from '../theme';
import { Ionicons } from '@expo/vector-icons';

/**
 * Toast notification for workout form tips
 * Auto-dismisses after `duration` ms
 */
const FormTipToast = ({ tip, visible, onHide, duration = 3500 }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  // Keep a stable ref to onHide so we never need it in the dep array
  const onHideRef = useRef(onHide);
  useEffect(() => { onHideRef.current = onHide; }, [onHide]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 20, duration: 300, useNativeDriver: true }),
        ]).start(() => onHideRef.current && onHideRef.current());
      }, duration);

      return () => clearTimeout(timer);
    }
  // opacity and translateY are stable Animated.Values (from useRef), so safe to omit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, duration]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="bulb" size={18} color={Colors.accent} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>FORM TIP</Text>
        <Text style={styles.tip}>{tip}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(18, 18, 26, 0.95)',
    borderRadius: Radii.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderAccent,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  tip: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});

export default FormTipToast;
