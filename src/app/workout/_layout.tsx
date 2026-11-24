import React from 'react';
import { Stack } from 'expo-router';

export default function WorkoutStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="anatomy" />
      <Stack.Screen name="exercises" />
      <Stack.Screen name="session" options={{ animation: 'fade' }} />
      <Stack.Screen name="create-plan" />
    </Stack>
  );
}
