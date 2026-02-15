import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface DotIndicatorProps {
  count: number;
  activeIndex: number;
  activeColor?: string;
  inactiveColor?: string;
}

function Dot({
  isActive,
  activeColor,
  inactiveColor,
}: {
  isActive: boolean;
  activeColor: string;
  inactiveColor: string;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(isActive ? 24 : 8, { duration: 200 }),
    opacity: withTiming(isActive ? 1 : 0.3, { duration: 200 }),
    backgroundColor: isActive ? activeColor : inactiveColor,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export function DotIndicator({
  count,
  activeIndex,
  activeColor = '#FFFFFF',
  inactiveColor = 'rgba(255,255,255,0.3)',
}: DotIndicatorProps) {
  if (count <= 1) return null;

  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, i) => (
        <Dot
          key={i}
          isActive={i === activeIndex}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
