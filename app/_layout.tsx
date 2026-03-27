import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { useEffect } from 'react';

import { useAutoReset } from '@/hooks/use-auto-reset';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTaskStore } from '@/store/use-task-store';
import { applyMontserratDefaults } from '@/utils/typography';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useAutoReset();

  const colorScheme = useColorScheme();
  const themePreference = useTaskStore((state) => state.settings.theme);
  const resolvedTheme = themePreference === 'system' ? colorScheme : themePreference;
  const [loaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (!loaded) {
      return;
    }

    applyMontserratDefaults();
    SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={resolvedTheme === 'light' ? DefaultTheme : DarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-task"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="add-category"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack>
      <StatusBar style={resolvedTheme === 'light' ? 'dark' : 'light'} />
    </ThemeProvider>
  );
}
