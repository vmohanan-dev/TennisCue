import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { SkillLevel } from '@/types';
import { levelLabels } from '@/data/cues';

interface LevelBadgeProps {
  level: SkillLevel;
  size?: 'small' | 'medium';
}

export function LevelBadge({ level, size = 'small' }: LevelBadgeProps) {
  const backgroundColor = Colors[level];

  return (
    <View style={[styles.badge, styles[size], { backgroundColor }]}>
      <Text style={[styles.text, styles[`${size}Text`]]}>
        {levelLabels[level]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  small: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  medium: {
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  text: {
    color: Colors.textLight,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
});