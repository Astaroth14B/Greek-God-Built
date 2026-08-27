// Greek God Build — Design Tokens
export const Colors = {
  // Backgrounds
  bg: '#0A0A0F',
  bgCard: '#12121A',
  bgElevated: '#1A1A26',
  bgInput: '#1E1E2E',

  // Accent — Electric Blue
  accent: '#00D4FF',
  accentDim: '#0099BB',
  accentGlow: 'rgba(0, 212, 255, 0.15)',

  // Secondary — Lime green for success/streaks
  green: '#39FF14',
  greenDim: '#27B80E',

  // Warning / fat
  orange: '#FF6B35',
  orangeDim: '#CC5528',

  // Carbs
  purple: '#A855F7',
  purpleDim: '#7C3AED',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#4B5563',

  // Borders
  border: 'rgba(255,255,255,0.08)',
  borderAccent: 'rgba(0, 212, 255, 0.3)',

  // Danger
  danger: '#FF4444',

  // Tab bar
  tabBar: '#0E0E18',
};

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 34,
  display: 48,
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
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  accent: {
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  green: {
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
};
