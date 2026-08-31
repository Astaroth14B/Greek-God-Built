import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, Radii } from '../theme';

/**
 * Minimalist horizontal progress bar for macro nutrients
 */
const MacroBar = ({ label, consumed, target, color = Colors.gold, unit = 'g' }) => {
  const progress = target > 0 ? Math.min(consumed / target, 1) : 0;
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.values}>
          <Text style={[styles.consumed, { color }]}>{Math.round(consumed)}</Text>
          <Text style={styles.separator}> / </Text>
          <Text style={styles.target}>{target}{unit}</Text>
        </Text>
      </View>
      <View style={styles.trackBackground}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  values: {
    fontSize: FontSizes.sm,
  },
  consumed: {
    fontWeight: '700',
  },
  separator: {
    color: Colors.textMuted,
  },
  target: {
    color: Colors.textMuted,
  },
  trackBackground: {
    height: 6,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radii.full,
  },
});

export default MacroBar;
