import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../theme/ThemeContext';

export default function ProductivityLayout() {
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
        name="pomodoro"
        options={{
          title: 'Deep Focus & Prep Timer',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="habits"
        options={{
          title: 'Daily Routines & Habits',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
