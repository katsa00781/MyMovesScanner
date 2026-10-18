import '../global.css';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { colors } from '@/constants/theme';
import { useAccountSync } from '@/hooks/useAccountSync';
import { startAuthListener } from '@/lib/auth';
import { useProvidersStore } from '@/store/useProvidersStore';

SplashScreen.preventAutoHideAsync();

const navigationTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.background, primary: colors.accent },
};

export default function RootLayout() {
  // Az onboarding-döntéshez a mentett állapotnak be kell töltődnie.
  const ready = useProvidersStore((state) => state.hasHydrated);

  // Az auth nem blokkolja az indulást: fiók nélkül is használható az app (D-051).
  useEffect(() => startAuthListener(), []);
  useAccountSync();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="account" />
        <Stack.Screen name="title/[type]/[id]" />
      </Stack>
    </ThemeProvider>
  );
}
