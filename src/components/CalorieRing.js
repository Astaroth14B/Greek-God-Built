import React from 'react';
import Svg, { Circle, G } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes } from '../theme';

/**
 * Clean Black, White & Gold circular calorie ring
 */
const CalorieRing = ({ consumed = 0, target = 2000, size = 175, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = target > 0 ? Math.min(consumed / target, 1) : 0;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

  const remaining = Math.max(target - consumed, 0);
  const isOver = consumed > target;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Background track */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={Colors.bgElevated}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress arc in Olympian Gold */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={isOver ? Colors.orange : Colors.gold}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
      </Svg>
      {/* Center text */}
      <View style={[styles.centerContent, { width: size, height: size }]}>
        <Text style={styles.consumedText}>{Math.round(consumed)}</Text>
        <Text style={styles.unitText}>kcal eaten</Text>
        <View style={styles.divider} />
        <Text style={[styles.remainingText, isOver && styles.overText]}>
          {isOver ? `${Math.round(consumed - target)} over` : `${Math.round(remaining)} remaining`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consumedText: {
    fontSize: FontSizes.xxxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  unitText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    width: 24,
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 5,
  },
  remainingText: {
    fontSize: FontSizes.sm,
    color: Colors.gold,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  overText: {
    color: Colors.orange,
  },
});

export default CalorieRing;
