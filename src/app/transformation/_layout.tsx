import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../theme/ThemeContext';

export default function TransformationLayout() {
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
          title: 'Transformation Studio',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="log-measurement"
        options={{
          title: 'Log Measurements',
          presentation: 'modal',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="compare-photos"
        options={{
          title: 'Before & After Compare',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
