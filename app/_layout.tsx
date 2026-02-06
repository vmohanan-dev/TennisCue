import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useUserStore, useAuthStore } from '@/store';
import { ThemeProvider } from '@/components/ThemeProvider';

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

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const { user, isInitialized, initialize } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, []);

  // Handle navigation based on auth and onboarding state
  useEffect(() => {
    if (!isInitialized) return;

    console.log('Auth state changed:', { user: !!user, hasCompletedOnboarding });

    if (!user) {
      // Not authenticated - go to login
      router.replace('/(auth)/login');
    } else if (!hasCompletedOnboarding) {
      // Authenticated but needs onboarding
      router.replace('/onboarding/welcome');
    } else {
      // Authenticated and onboarded - go to main app
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
