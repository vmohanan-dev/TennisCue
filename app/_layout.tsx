import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';

import { AnimatedSplashOverlay } from '@/components/AnimatedSplashOverlay';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useAuthStore, useUserStore } from '@/store';
import { syncWidgetData } from '@/services/widgetSync';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const { isInitialized, initialize } = useAuthStore();
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);

  // Initialize auth on mount and sync widget data
  useEffect(() => {
    initialize();
    syncWidgetData(useUserStore.getState().activeCueIds);
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide native splash once our animated overlay is rendered
  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => SplashScreen.hideAsync(), 50);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const isAppReady = loaded && isInitialized;

  return (
    <>
      <RootLayoutNav />
      {!splashAnimationComplete && (
        <AnimatedSplashOverlay
          isReady={isAppReady}
          onFinish={() => setSplashAnimationComplete(true)}
        />
      )}
    </>
  );
}

function RootLayoutNav() {
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const { user, isInitialized } = useAuthStore();

  // Handle navigation based on auth and onboarding state
  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      router.replace('/(auth)/login');
    } else if (!hasCompletedOnboarding) {
      router.replace('/onboarding/welcome');
    } else {
      router.replace('/(tabs)');
    }
  }, [user, isInitialized, hasCompletedOnboarding]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(auth)"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="onboarding/welcome"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="onboarding/index"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="onboarding/results"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="cue/[id]"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="court-mode"
              options={{
                presentation: 'modal',
                headerShown: false,
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="session/new"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="session/[id]"
              options={{
                presentation: 'card',
                headerShown: false,
              }}
            />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
