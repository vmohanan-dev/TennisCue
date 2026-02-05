// TennisCue - Sporty & Energetic Color Palette

export const Colors = {
  // Primary colors
  primary: '#00C853', // Vibrant tennis court green
  primaryDark: '#00A844',
  primaryLight: '#69F0AE',

  // Secondary colors
  secondary: '#2979FF', // Electric blue
  secondaryDark: '#2962FF',
  secondaryLight: '#82B1FF',

  // Accent
  accent: '#FF6D00', // Bright orange for CTAs
  accentLight: '#FFAB40',

  // Neutrals
  background: '#FAFAFA',
  backgroundDark: '#121212',
  surface: '#FFFFFF',
  surfaceDark: '#1E1E1E',

  // Text
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  textDark: '#E0E0E0',

  // Semantic
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',

  // Borders & Dividers
  border: '#E0E0E0',
  borderDark: '#424242',
  divider: '#EEEEEE',

  // Level colors
  beginner: '#4CAF50',
  intermediate: '#FF9800',
  advanced: '#F44336',

  // Rating stars
  starFilled: '#FFD700',
  starEmpty: '#E0E0E0',
};

// Theme configuration for light/dark mode
export default {
  light: {
    text: Colors.text,
    textSecondary: Colors.textSecondary,
    background: Colors.background,
    surface: Colors.surface,
    tint: Colors.primary,
    tabIconDefault: Colors.textSecondary,
    tabIconSelected: Colors.primary,
    border: Colors.border,
    card: Colors.surface,
  },
  dark: {
    text: Colors.textLight,
    textSecondary: Colors.textDark,
    background: Colors.backgroundDark,
    surface: Colors.surfaceDark,
    tint: Colors.primaryLight,
    tabIconDefault: Colors.textDark,
    tabIconSelected: Colors.primaryLight,
    border: Colors.borderDark,
    card: Colors.surfaceDark,
  },
};
