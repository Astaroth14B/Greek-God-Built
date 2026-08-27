import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, Radii } from '../theme';

/**
 * Horizontal progress bar for a single macro nutrient
 */
const MacroBar = ({ label, consumed, target, color, unit = 'g' }) => {
  const progress = Math.min(consumed / target, 1);
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
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    height: 8,
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
