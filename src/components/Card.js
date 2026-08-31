import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radii, Shadows } from '../theme';

/**
 * Clean minimalist obsidian card component
 */
const Card = ({ children, style, highlighted = false, noPadding = false }) => {
  return (
    <View
      style={[
        styles.card,
        highlighted && styles.cardHighlighted,
        noPadding && styles.noPadding,
        style,
      ]}
    >
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
  cardHighlighted: {
    borderColor: Colors.borderGold,
    backgroundColor: '#16161D',
  },
  noPadding: {
    padding: 0,
  },
});

export default Card;
