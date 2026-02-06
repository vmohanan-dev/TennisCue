// Simplified theme system - single adaptive theme following system preference

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryDark: string;
  primaryLight: string;

  // Secondary colors
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;

  // Accent
  accent: string;
  accentLight: string;

  // Backgrounds & surfaces
  background: string;
  surface: string;
  surfaceElevated: string;

  // Text colors
  text: string;
  textSecondary: string;
  textOnPrimary: string;

  // Semantic colors
  success: string;
  warning: string;
  error: string;

  // Borders & dividers
  border: string;
  divider: string;

  // Level colors (tennis-specific)
  beginner: string;
  intermediate: string;
  advanced: string;

  // Rating stars
  starFilled: string;
  starEmpty: string;

  // Tab bar
  tabIconDefault: string;
  tabIconSelected: string;
}

const lightColors: ThemeColors = {
  // Primary - Grass green
  primary: '#2D6A4F',
  primaryDark: '#245C44',
  primaryLight: '#40916C',

  // Secondary - Tennis yellow
  secondary: '#E8D44D',
  secondaryDark: '#D4C045',
  secondaryLight: '#F0E06A',

  // Accent - Soft navy
  accent: '#1D3557',
  accentLight: '#2A4A73',

  // Backgrounds - Warm white
  background: '#FFFBF5',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#212121',
  textSecondary: '#666666',
  textOnPrimary: '#FFFFFF',

  // Semantic
  success: '#2D6A4F',
  warning: '#E8D44D',
  error: '#E63946',

  // Borders
  border: '#E0DCD5',
  divider: '#EFEBE5',

  // Levels
  beginner: '#2D6A4F',
  intermediate: '#E8D44D',
  advanced: '#E63946',

  // Stars
  starFilled: '#E8D44D',
  starEmpty: '#E0DCD5',

  // Tab bar
  tabIconDefault: '#666666',
  tabIconSelected: '#2D6A4F',
};

const darkColors: ThemeColors = {
  // Primary - Electric teal
  primary: '#00F5D4',
  primaryDark: '#00C4A9',
  primaryLight: '#4DFAE3',

  // Secondary - Amber
  secondary: '#FFB703',
  secondaryDark: '#E0A003',
  secondaryLight: '#FFC940',

  // Accent - Soft white
  accent: '#E8E8E8',
  accentLight: '#FFFFFF',

  // Backgrounds - Midnight blue
  background: '#0A1628',
  surface: '#162447',
  surfaceElevated: '#1E3057',

  // Text
  text: '#F8F8F8',
  textSecondary: '#A0AAB8',
  textOnPrimary: '#0A1628',

  // Semantic
  success: '#00F5D4',
  warning: '#FFB703',
  error: '#FF6B6B',

  // Borders
  border: '#2A3F5F',
  divider: '#1E3057',

  // Levels
  beginner: '#00F5D4',
  intermediate: '#FFB703',
  advanced: '#FF6B6B',

  // Stars
  starFilled: '#FFB703',
  starEmpty: '#2A3F5F',

  // Tab bar
  tabIconDefault: '#A0AAB8',
  tabIconSelected: '#00F5D4',
};

export function getThemeColors(systemColorScheme: 'light' | 'dark'): ThemeColors {
  return systemColorScheme === 'dark' ? darkColors : lightColors;
}

export function isThemeDark(systemColorScheme: 'light' | 'dark'): boolean {
  return systemColorScheme === 'dark';
}
