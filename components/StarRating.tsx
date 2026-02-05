import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

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
          color={filled ? Colors.starFilled : Colors.starEmpty}
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