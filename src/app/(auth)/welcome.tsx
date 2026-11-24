import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Dumbbell, Apple, Activity, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { theme } = useTheme();

  const highlights = [
    {
      icon: <Dumbbell size={20} color={theme.colors.primary} />,
      title: 'Precision Workouts & Anatomy',
      desc: 'Interactive 3D muscle targeting, real-time sets, reps & rest timer.',
    },
    {
      icon: <Apple size={20} color={theme.colors.orange} />,
      title: 'Smart Indian & Global Nutrition',
      desc: 'Accurate macros, verified Indian food library & meal planning.',
    },
    {
      icon: <Activity size={20} color={theme.colors.blue400} />,
      title: 'Lifestyle & Habit Productivity',
      desc: 'Sleep tracking, daily consistency score, water & focus timer.',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={styles.safe}>
        {/* Brand Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.brandContainer}>
          <View style={[styles.logoBadge, { backgroundColor: theme.colors.primary }]}>
            <Zap size={28} color={theme.colors.textOnPrimary} fill={theme.colors.textOnPrimary} />
          </View>
          <Text variant="displaySmall" color={theme.colors.textPrimary} style={styles.brandTitle}>
            FITVERSE
          </Text>
          <Text variant="bodySmall" color={theme.colors.textTertiary} align="center">
            THE ALL-IN-ONE FITNESS LIFESTYLE SUPER APP
          </Text>
        </Animated.View>

        {/* Feature Highlights */}
        <View style={styles.cardsContainer}>
          {highlights.map((item, index) => (
            <Animated.View
              key={item.title}
              entering={FadeInDown.delay(200 + index * 100).duration(500)}
            >
              <Card variant="default" padding={4} style={styles.highlightCard}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.surfaceSecondary }]}>
                  {item.icon}
                </View>
                <View style={styles.cardText}>
                  <Text variant="titleSmall" color={theme.colors.textPrimary}>
                    {item.title}
                  </Text>
                  <Text variant="caption" color={theme.colors.textTertiary} style={{ marginTop: 2 }}>
                    {item.desc}
                  </Text>
                </View>
              </Card>
            </Animated.View>
          ))}
        </View>

        {/* Action Controls */}
        <Animated.View entering={FadeInUp.delay(500).duration(600)} style={styles.ctaSection}>
          <Button
            label="Get Started"
            variant="primary"
            size="xl"
            fullWidth
            onPress={() => router.push('/(auth)/register')}
          />
          <Button
            label="Sign In to Existing Account"
            variant="secondary"
            size="lg"
            fullWidth
            onPress={() => router.push('/(auth)/login')}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.replace('/(tabs)')}
            style={styles.guestLink}
          >
            <Text variant="labelSmall" color={theme.colors.primary} align="center">
              Explore FITVERSE as Guest →
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: spacing[5], justifyContent: 'space-between' },
  brandContainer: {
    alignItems: 'center',
    marginTop: spacing[4],
    gap: spacing[2],
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: borderRadius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  brandTitle: {
    fontWeight: '900',
    letterSpacing: 4,
  },
  cardsContainer: {
    gap: spacing[3],
    marginVertical: spacing[4],
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3.5],
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1 },
  ctaSection: {
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  guestLink: {
    paddingVertical: spacing[2],
  },
});
