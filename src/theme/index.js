// Project Zeus — Minimalist Black, White & Gold Design System
export const Colors = {
  // Deep Obsidian Matte Backgrounds
  bg: '#0A0A0D',
  bgCard: '#131318',
  bgElevated: '#1B1B22',
  bgInput: '#15151B',

  // Refined Olympic Gold
  gold: '#D4AF37',
  goldDim: '#997D2A',
  goldLight: '#F3E5A8',
  goldGlow: 'rgba(212, 175, 55, 0.12)',

  // Primary Accent (Aligned to Gold)
  accent: '#D4AF37',
  accentDim: '#A8872B',
  accentGlow: 'rgba(212, 175, 55, 0.12)',
  accentDeep: '#5C4A19',

  // Monochrome Scale
  white: '#FFFFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#9EA4B0',
  textMuted: '#5D6370',

  // Subtle Organic Accent Tones (Understated, never neon)
  green: '#8FB986',      // Laurel leaf sage
  greenDim: '#648A5C',
  greenGlow: 'rgba(143, 185, 134, 0.12)',

  orange: '#C88D62',     // Terracotta
  orangeDim: '#9A6640',
  orangeGlow: 'rgba(200, 141, 98, 0.12)',

  purple: '#9B93B8',     // Muted slate amethyst
  purpleDim: '#6F668E',

  // Minimalist Borders
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.14)',
  borderGold: 'rgba(212, 175, 55, 0.35)',
  borderAccent: 'rgba(212, 175, 55, 0.35)',

  // Alert
  danger: '#D96B6B',

  // Navigation
  tabBar: '#0B0B0E',
};

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 32,
  display: 40,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radii = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  gold: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  accent: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  green: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};
