import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import {
  Sparkles,
  ShoppingBag,
  Camera,
  MapPin,
  Bot,
  Users,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Moon,
  BarChart3,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { spacing, borderRadius } from '../../theme';

export default function ExploreTab() {
  const { theme } = useTheme();

  const sections = [
    {
      id: 'transformation',
      title: 'Transformation Studio',
      desc: 'Private photo timeline, body measurements & caliper logs',
      badge: 'STUDIO',
      badgeVariant: 'primary' as const,
      icon: <Camera size={24} color={theme.colors.primary} />,
      route: '/transformation',
    },
    {
      id: 'analytics',
      title: 'Performance Analytics',
      desc: '1RM strength progression, volume tonnage & muscle balance',
      badge: 'METRICS',
      badgeVariant: 'info' as const,
      icon: <TrendingUp size={24} color={theme.colors.blue400} />,
      route: '/analytics',
    },
    {
      id: 'pomodoro',
      title: 'Deep Focus & Prep Timer',
      desc: 'Pomodoro timer, pre-workout visualization & binaural audio',
      badge: 'FOCUS',
      badgeVariant: 'warning' as const,
      icon: <Clock size={24} color={theme.colors.orange} />,
      route: '/productivity/pomodoro',
    },
    {
      id: 'habits',
      title: 'Daily Habits & Discipline',
      desc: 'Morning routines, hydration streaks & recovery checklists',
      badge: 'HABITS',
      badgeVariant: 'success' as const,
      icon: <CheckCircle2 size={24} color={theme.colors.success} />,
      route: '/productivity/habits',
    },
    {
      id: 'sleep',
      title: 'Sleep & CNS Recovery',
      desc: 'Sleep architecture, readiness index & autonomic restoration',
      badge: 'RECOVERY',
      badgeVariant: 'neutral' as const,
      icon: <Moon size={24} color={theme.colors.purple400} />,
      route: '/sleep',
    },
    {
      id: 'ai_coach',
      title: 'AI Fitness Coach',
      desc: 'Ask workout adjustments, nutrition ideas & form checks',
      badge: 'PRO',
      badgeVariant: 'primary' as const,
      icon: <Bot size={24} color={theme.colors.primary} />,
      route: undefined,
    },
    {
      id: 'marketplace',
      title: 'Fitness Marketplace',
      desc: 'Supplements, certified diet plans, gym wear & gear',
      badge: 'MARKET',
      badgeVariant: 'warning' as const,
      icon: <ShoppingBag size={24} color={theme.colors.orange} />,
      route: undefined,
    },
    {
      id: 'gyms_trainers',
      title: 'Gym & Trainer Discovery',
      desc: 'Find certified elite gyms, studios & book trainers near you',
      badge: 'NEARBY',
      badgeVariant: 'success' as const,
      icon: <MapPin size={24} color={theme.colors.success} />,
      route: undefined,
    },
    {
      id: 'community',
      title: 'FITVERSE Community',
      desc: 'Fitness leaderboards, partner matchmaking & challenges',
      badge: 'SOCIAL',
      badgeVariant: 'neutral' as const,
      icon: <Users size={24} color={theme.colors.purple400} />,
      route: undefined,
    },
  ];

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text variant="caption" color={theme.colors.textTertiary} style={styles.eyebrow}>
          ECOSYSTEM & SERVICES
        </Text>
        <Text variant="headlineLarge" color={theme.colors.textPrimary} style={{ fontWeight: '900' }}>
          Explore
        </Text>
      </View>

      <View style={{ gap: spacing[3.5], marginTop: spacing[5], marginBottom: spacing[8] }}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.id}
            activeOpacity={0.8}
            onPress={() => {
              if (section.route) {
                router.push(section.route as any);
              }
            }}
          >
            <Card padding={4} style={styles.sectionCard}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconWrap, { backgroundColor: theme.colors.surfaceSecondary }]}>
                  {section.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
                      {section.title}
                    </Text>
                    <Badge label={section.badge} variant={section.badgeVariant} size="sm" />
                  </View>
                  <Text variant="bodySmall" color={theme.colors.textTertiary} style={{ marginTop: 2 }}>
                    {section.desc}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={theme.colors.textTertiary} />
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing[4],
  },
  eyebrow: {
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  sectionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3.5],
    flex: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
});
