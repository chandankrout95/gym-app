import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../theme/ThemeContext';

export default function SleepLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Sleep & Recovery Hub',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="log-sleep"
        options={{
          title: 'Log Sleep Session',
          presentation: 'modal',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
