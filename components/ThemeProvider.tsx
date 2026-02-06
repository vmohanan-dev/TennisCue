import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { getThemeColors, isThemeDark, ThemeColors } from '@/constants/themes';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme() ?? 'light';

  const colors = useMemo(
    () => getThemeColors(systemColorScheme),
    [systemColorScheme]
  );

  const isDark = useMemo(
    () => isThemeDark(systemColorScheme),
    [systemColorScheme]
  );

  const navigationTheme = useMemo(() => {
    const baseTheme = isDark ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.accent,
      },
    };
  }, [colors, isDark]);

  const contextValue: ThemeContextValue = useMemo(
    () => ({ colors, isDark }),
    [colors, isDark]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <NavigationThemeProvider value={navigationTheme}>
        {children}
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}
