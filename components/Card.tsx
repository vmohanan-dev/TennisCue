import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable, StyleProp } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, style, onPress, variant = 'default' }: CardProps) {
  const { colors } = useTheme();

  const variantStyles: ViewStyle = {
    backgroundColor: colors.surface,
    ...(variant === 'outlined' && {
      borderWidth: 1,
      borderColor: colors.border,
    }),
    ...(variant === 'elevated' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    }),
  };

  const cardStyles = [styles.base, variantStyles, style];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [cardStyles, pressed && styles.pressed]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 16,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
