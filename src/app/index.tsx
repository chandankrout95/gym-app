import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Routes to the main tab navigation directly for instant interaction, or (auth)/welcome if not logged in
  return <Redirect href="/(tabs)" />;
}
