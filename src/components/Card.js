import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radii, Shadows } from '../theme';

/**
 * Reusable card component with glass-dark styling
 */
const Card = ({ children, style, noPadding = false }) => {
  return (
    <View style={[styles.card, noPadding && styles.noPadding, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  noPadding: {
    padding: 0,
  },
});

export default Card;
