import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeProvider';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 24,
  onChange,
  readonly = false,
}: StarRatingProps) {
  const { colors } = useTheme();
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const filled = i <= rating;
    const star = (
      <TouchableOpacity
        key={i}
        onPress={() => !readonly && onChange?.(i)}
        disabled={readonly}
        style={styles.star}
      >
        <FontAwesome
          name={filled ? 'star' : 'star-o'}
          size={size}
          color={filled ? colors.starFilled : colors.starEmpty}
        />
      </TouchableOpacity>
    );
    stars.push(star);
  }

  return <View style={styles.container}>{stars}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 2,
  },
});
