import React from 'react';
import { Stack } from 'expo-router';

export default function NutritionStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="log-food" />
      <Stack.Screen name="meal-planner" />
      <Stack.Screen name="diet-marketplace" />
    </Stack>
  );
}
