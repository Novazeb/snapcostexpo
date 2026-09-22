export const COLORS = {
  light: {
    background: '#FAFAFA',
    card: '#FFFFFF',
    cardSubtle: '#F4F4F5',
    textPrimary: '#09090B',
    textSecondary: '#52525B',
    textMuted: '#71717A',
    border: '#E4E4E7',
    accent: '#059669', // Clean Emerald
    accentLight: '#ECFDF5',
    accentDark: '#047857',
    danger: '#DC2626',
    dangerLight: '#FEF2F2',
    warning: '#D97706',
    warningLight: '#FFFBEB',
    tabBarBg: '#FFFFFF',
    tabBarBorder: '#E4E4E7',
    scanBtnBg: '#09090B',
    scanBtnText: '#FFFFFF',
    shadowColor: '#000000',
  },
  dark: {
    background: '#09090B', // Deep zinc matte
    card: '#18181B',
    cardSubtle: '#27272A',
    textPrimary: '#FAFAFA',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    border: '#27272A',
    accent: '#10B981', // Crisp Emerald
    accentLight: '#064E3B',
    accentDark: '#059669',
    danger: '#EF4444',
    dangerLight: '#450A0A',
    warning: '#F59E0B',
    warningLight: '#451A03',
    tabBarBg: '#09090B',
    tabBarBorder: '#18181B',
    scanBtnBg: '#10B981',
    scanBtnText: '#FFFFFF',
    shadowColor: '#000000',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Swiss disciplined geometric radii
export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  full: 9999,
};

// Subtle, functional elevation without artificial neon glows
export const SHADOWS = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  floating: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};
