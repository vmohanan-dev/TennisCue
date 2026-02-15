import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function CourtModeLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A0A' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="summary"
          options={{ animation: 'slide_from_right' }}
        />
      </Stack>
    </>
  );
}
