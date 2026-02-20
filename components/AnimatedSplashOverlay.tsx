import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const SPLASH_BG = '#FFFBF5';

interface AnimatedSplashOverlayProps {
  isReady: boolean;
  onFinish: () => void;
}

export function AnimatedSplashOverlay({ isReady, onFinish }: AnimatedSplashOverlayProps) {
  const hasStarted = useRef(false);

  const iconScale = useSharedValue(1);
  const iconOpacity = useSharedValue(1);
  const overlayOpacity = useSharedValue(1);
  const gradientOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const startAnimation = () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Step 1: Subtle gradient glow behind icon
    gradientOpacity.value = withTiming(0.6, { duration: 150 });

    // Step 2: Icon breathe pulse
    iconScale.value = withDelay(
      100,
      withSequence(
        withSpring(1.08, { damping: 8, stiffness: 200 }),
        withSpring(1.0, { damping: 12, stiffness: 180 })
      )
    );

    // Step 3: Glow ring flare
    glowOpacity.value = withDelay(
      100,
      withSequence(
        withTiming(0.4, { duration: 150 }),
        withTiming(0, { duration: 150 })
      )
    );
    glowScale.value = withDelay(
      100,
      withTiming(1.15, { duration: 300, easing: Easing.out(Easing.quad) })
    );

    // Step 4: Icon scales up and fades out
    iconScale.value = withDelay(
      350,
      withTiming(1.12, { duration: 300, easing: Easing.in(Easing.quad) })
    );
    iconOpacity.value = withDelay(
      350,
      withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) })
    );

    // Step 5: Overlay dissolves to reveal app
    overlayOpacity.value = withDelay(
      400,
      withTiming(0, {
        duration: 300,
        easing: Easing.inOut(Easing.quad),
      }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      })
    );
  };

  // Start animation when app content is ready
  useEffect(() => {
    if (isReady) {
      startAnimation();
    }
  }, [isReady]);

  // Safety timeout: start animation after 2.5s even if not ready
  useEffect(() => {
    const timeout = setTimeout(() => {
      startAnimation();
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    opacity: iconOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  const gradientContainerStyle = useAnimatedStyle(() => ({
    opacity: gradientOpacity.value,
  }));

  return (
    <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none">
      <View style={styles.background} />

      <Animated.View style={[styles.gradientContainer, gradientContainerStyle]}>
        <LinearGradient
          colors={['rgba(45, 106, 79, 0.08)', 'rgba(232, 212, 77, 0.04)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0.4 }}
          end={{ x: 0.5, y: 1.0 }}
        />
      </Animated.View>

      <Animated.View style={[styles.glowRing, glowStyle]} />

      <Animated.Image
        source={require('@/assets/images/splash-icon.png')}
        style={[styles.icon, iconStyle]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SPLASH_BG,
  },
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(232, 212, 77, 0.15)',
  },
  icon: {
    width: 180,
    height: 180,
  },
});
