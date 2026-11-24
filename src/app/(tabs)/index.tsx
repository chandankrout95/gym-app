import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import {
  Flame,
  Footprints,
  Droplets,
  Dumbbell,
  Sparkles,
  Play,
  Plus,
  Utensils,
  Scale,
  Camera,
  ChevronRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Zap,
  Moon,
} from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../store';
import { logWater } from '../../features/nutrition/store/nutritionSlice';
import { updateSteps } from '../../features/dashboard/store/dashboardSlice';
import { toggleHabit } from '../../features/habits/store/habitsSlice';

import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

export default function HomeDashboardScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  // Redux Selectors
  const user = useAppSelector((state) => state.auth.user);
  const dashboard = useAppSelector((state) => state.dashboard);
  const nutrition = useAppSelector((state) => state.nutrition);
  const workout = useAppSelector((state) => state.workout);
  const habits = useAppSelector((state) => state.habits);

  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Computed metrics
  const stats = dashboard.stats;
  const todayMeals = nutrition.today?.meals ?? [];
  const totalCaloriesConsumed = todayMeals.reduce(
    (acc, m) => acc + m.foodItem.calories * m.quantity,
    0
  );
  const totalProteinConsumed = todayMeals.reduce(
    (acc, m) => acc + m.foodItem.protein * m.quantity,
    0
  );
  const proteinGoal = nutrition.targets.protein;
  const caloriesTarget = nutrition.targets.calories;

  const completedHabitsCount = habits.todayEntries.filter((h) => h.isCompleted).length;
  const totalHabitsCount = habits.habits.length;

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';

  const upcomingPlan = workout.workoutPlans[0] ?? {
    id: 'plan_default',
    name: 'Upper Body Hypertrophy (Push)',
    estimatedDuration: 55,
    exercises: [
      { exercise: { name: 'Incline Dumbbell Press' } },
      { exercise: { name: 'Standing Cable Fly' } },
      { exercise: { name: 'Overhead Tricep Extension' } },
    ],
  };

  // Quick Action Handler
  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'start_workout':
        router.push('/workout/session');
        break;
      case 'log_food':
        router.push('/(tabs)/nutrition');
        break;
      case 'track_water':
        dispatch(logWater(250));
        break;
      case 'track_weight':
        router.push('/transformation/log-measurement');
        break;
      case 'view_diet':
        router.push('/(tabs)/nutrition');
        break;
      case 'record_photo':
        router.push('/transformation');
        break;
      case 'focus_timer':
        router.push('/productivity/pomodoro');
        break;
      case 'sleep_recovery':
        router.push('/sleep');
        break;
      case 'analytics':
        router.push('/analytics');
        break;
    }
  };

  return (
    <ScreenContainer scrollable padding={false}>
      {/* 1. Header & Personalized Greeting */}
      <View style={[styles.headerContainer, { paddingHorizontal: spacing[5] }]}>
        <View style={styles.headerLeft}>
          <Text variant="caption" color={theme.colors.textTertiary} style={styles.dateLabel}>
            {greeting.toUpperCase()} • NOV 24
          </Text>
          <Text variant="headlineLarge" color={theme.colors.textPrimary} style={styles.greetingTitle}>
            {user?.fullName ?? 'Alex Vance'}
          </Text>
          <View style={styles.goalPillRow}>
            <Badge
              label="Hypertrophy Focus"
              variant="primary"
              size="sm"
            />
            <View style={styles.streakBadge}>
              <Flame size={14} color={theme.colors.orange} />
              <Text variant="labelSmall" color={theme.colors.orange} style={{ fontWeight: '700' }}>
                {stats.streakDays} Day Streak
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Avatar
            name={user?.fullName ?? 'Alex Vance'}
            size="lg"
            online
          />
        </TouchableOpacity>
      </View>

      {/* 2. Consistency & Readiness Score Hero Card */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(450)}
        style={{ paddingHorizontal: spacing[5], marginTop: spacing[4] }}
      >
        <Card
          variant="default"
          padding={4}
          style={[
            styles.heroCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroScoreGroup}>
              <Text variant="caption" color={theme.colors.textTertiary}>
                DAILY CONSISTENCY SCORE
              </Text>
              <View style={styles.scoreRow}>
                <Text variant="displaySmall" color={theme.colors.primary} style={{ fontWeight: '900' }}>
                  {stats.consistencyScore}
                </Text>
                <Text variant="headlineSmall" color={theme.colors.textTertiary} style={{ marginBottom: 4 }}>
                  /100
                </Text>
              </View>
            </View>
            <View style={[styles.heroIconBadge, { backgroundColor: theme.colors.primaryMuted }]}>
              <Zap size={22} color={theme.colors.primary} />
            </View>
          </View>

          <Text variant="bodySmall" color={theme.colors.textSecondary} style={{ marginTop: spacing[1] }}>
            Peak performance zone. 4/5 habits fulfilled, optimal hydration pace.
          </Text>

          <View style={styles.heroProgress}>
            <ProgressBar
              progress={stats.consistencyScore / 100}
              height={6}
              color={theme.colors.primary}
            />
          </View>
        </Card>
      </Animated.View>

      {/* 3. Daily Activity Key Rings / Summary Grid */}
      <View style={{ paddingHorizontal: spacing[5], marginTop: spacing[5] }}>
        <Text variant="titleMedium" color={theme.colors.textPrimary} style={styles.sectionHeading}>
          Today's Core Metrics
        </Text>

        <View style={styles.metricsGrid}>
          {/* Calories Burned */}
          <Card padding={3.5} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(249, 115, 22, 0.12)' }]}>
                <Flame size={18} color={theme.colors.orange} />
              </View>
              <Text variant="caption" color={theme.colors.textTertiary}>
                Burned
              </Text>
            </View>
            <Text variant="titleLarge" color={theme.colors.textPrimary} style={styles.metricValue}>
              {stats.caloriesBurned}{' '}
              <Text variant="caption" color={theme.colors.textTertiary}>
                kcal
              </Text>
            </Text>
            <ProgressBar
              progress={stats.caloriesBurned / stats.caloriesBurnGoal}
              height={4}
              color={theme.colors.orange}
            />
          </Card>

          {/* Calories Consumed */}
          <Card padding={3.5} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconWrap, { backgroundColor: theme.colors.primaryMuted }]}>
                <Utensils size={18} color={theme.colors.primary} />
              </View>
              <Text variant="caption" color={theme.colors.textTertiary}>
                Consumed
              </Text>
            </View>
            <Text variant="titleLarge" color={theme.colors.textPrimary} style={styles.metricValue}>
              {totalCaloriesConsumed}{' '}
              <Text variant="caption" color={theme.colors.textTertiary}>
                / {caloriesTarget}
              </Text>
            </Text>
            <ProgressBar
              progress={totalCaloriesConsumed / caloriesTarget}
              height={4}
              color={theme.colors.primary}
            />
          </Card>

          {/* Protein Intake */}
          <Card padding={3.5} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(96, 165, 250, 0.12)' }]}>
                <Sparkles size={18} color={theme.colors.blue400} />
              </View>
              <Text variant="caption" color={theme.colors.textTertiary}>
                Protein
              </Text>
            </View>
            <Text variant="titleLarge" color={theme.colors.textPrimary} style={styles.metricValue}>
              {totalProteinConsumed}g{' '}
              <Text variant="caption" color={theme.colors.textTertiary}>
                / {proteinGoal}g
              </Text>
            </Text>
            <ProgressBar
              progress={totalProteinConsumed / proteinGoal}
              height={4}
              color={theme.colors.blue400}
            />
          </Card>

          {/* Steps */}
          <Card padding={3.5} style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(74, 222, 128, 0.12)' }]}>
                <Footprints size={18} color={theme.colors.success} />
              </View>
              <Text variant="caption" color={theme.colors.textTertiary}>
                Steps
              </Text>
            </View>
            <Text variant="titleLarge" color={theme.colors.textPrimary} style={styles.metricValue}>
              {stats.steps.toLocaleString()}{' '}
              <Text variant="caption" color={theme.colors.textTertiary}>
                / 10k
              </Text>
            </Text>
            <ProgressBar
              progress={stats.steps / stats.stepsGoal}
              height={4}
              color={theme.colors.success}
            />
          </Card>
        </View>
      </View>

      {/* 4. Quick Actions Carousel / Row */}
      <View style={{ marginTop: spacing[5] }}>
        <View style={[styles.sectionTitleRow, { paddingHorizontal: spacing[5] }]}>
          <Text variant="titleMedium" color={theme.colors.textPrimary}>
            Quick Actions
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: spacing[5], gap: spacing[3], marginTop: spacing[3] }}
        >
          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleQuickAction('start_workout')}
          >
            <Play size={18} color={theme.colors.textOnPrimary} fill={theme.colors.textOnPrimary} />
            <Text variant="labelSmall" color={theme.colors.textOnPrimary} style={{ fontWeight: '700' }}>
              Start Workout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={() => handleQuickAction('log_food')}
          >
            <Utensils size={18} color={theme.colors.primary} />
            <Text variant="labelSmall" color={theme.colors.textPrimary} style={{ fontWeight: '600' }}>
              Log Meal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={() => handleQuickAction('track_water')}
          >
            <Droplets size={18} color={theme.colors.blue400} />
            <Text variant="labelSmall" color={theme.colors.textPrimary} style={{ fontWeight: '600' }}>
              +250ml Water
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={() => handleQuickAction('track_weight')}
          >
            <Scale size={18} color={theme.colors.orange} />
            <Text variant="labelSmall" color={theme.colors.textPrimary} style={{ fontWeight: '600' }}>
              Log Weight
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={() => handleQuickAction('record_photo')}
          >
            <Camera size={18} color={theme.colors.purple400} />
            <Text variant="labelSmall" color={theme.colors.textPrimary} style={{ fontWeight: '600' }}>
              Progress Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={() => handleQuickAction('focus_timer')}
          >
            <Clock size={18} color={theme.colors.primary} />
            <Text variant="labelSmall" color={theme.colors.textPrimary} style={{ fontWeight: '600' }}>
              Focus Timer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={() => handleQuickAction('sleep_recovery')}
          >
            <Moon size={18} color={theme.colors.blue400} />
            <Text variant="labelSmall" color={theme.colors.textPrimary} style={{ fontWeight: '600' }}>
              Sleep & Recovery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1 }]}
            onPress={() => handleQuickAction('analytics')}
          >
            <TrendingUp size={18} color={theme.colors.success} />
            <Text variant="labelSmall" color={theme.colors.textPrimary} style={{ fontWeight: '600' }}>
              Analytics
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 5. Upcoming Workout Banner */}
      <View style={{ paddingHorizontal: spacing[5], marginTop: spacing[5] }}>
        <View style={styles.sectionTitleRow}>
          <Text variant="titleMedium" color={theme.colors.textPrimary}>
            Scheduled Session
          </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/workout')}>
            <Text variant="labelSmall" color={theme.colors.primary}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        <Card padding={4} style={[styles.workoutCard, { marginTop: spacing[3] }]}>
          <View style={styles.workoutCardTop}>
            <View style={styles.workoutBadgeRow}>
              <Badge label="Upper Push" variant="primary" size="sm" />
              <View style={styles.timeTag}>
                <Clock size={13} color={theme.colors.textTertiary} />
                <Text variant="caption" color={theme.colors.textTertiary}>
                  {upcomingPlan.estimatedDuration ?? 55} Mins
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.playButtonMini, { backgroundColor: theme.colors.primary }]}
              onPress={() => router.push('/(tabs)/workout')}
            >
              <Play size={16} color={theme.colors.textOnPrimary} fill={theme.colors.textOnPrimary} />
            </TouchableOpacity>
          </View>

          <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ marginTop: spacing[2], fontWeight: '700' }}>
            {upcomingPlan.name}
          </Text>

          <View style={styles.exercisePreviewList}>
            {upcomingPlan.exercises.slice(0, 3).map((ex, i) => (
              <View key={i} style={styles.exerciseBullet}>
                <View style={[styles.bulletDot, { backgroundColor: theme.colors.primary }]} />
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {ex.exercise.name}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      {/* 6. Weekly Activity Frequency Chart */}
      <View style={{ paddingHorizontal: spacing[5], marginTop: spacing[5] }}>
        <View style={styles.sectionTitleRow}>
          <Text variant="titleMedium" color={theme.colors.textPrimary}>
            Weekly Caloric & Step Rhythm
          </Text>
          <Text variant="labelSmall" color={theme.colors.textTertiary}>
            {dashboard.stats.workoutsThisWeek}/5 Days Done
          </Text>
        </View>

        <Card padding={4} style={[styles.chartCard, { marginTop: spacing[3] }]}>
          <View style={styles.barChartContainer}>
            {dashboard.daysLabels.map((day, idx) => {
              const val = dashboard.weeklyCalories[idx] ?? 400;
              const maxVal = 800;
              const heightPct = Math.min((val / maxVal) * 100, 100);
              const isToday = idx === dashboard.daysLabels.length - 1;

              return (
                <View key={day} style={styles.chartCol}>
                  <View style={styles.chartTrack}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: `${heightPct}%`,
                          backgroundColor: isToday ? theme.colors.primary : theme.colors.surfaceSecondary,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    variant="caption"
                    color={isToday ? theme.colors.primary : theme.colors.textTertiary}
                    style={{ fontWeight: isToday ? '700' : '400', marginTop: 6 }}
                  >
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      </View>

      {/* 7. Daily Habits Checklist */}
      <View style={{ paddingHorizontal: spacing[5], marginTop: spacing[5], marginBottom: spacing[8] }}>
        <View style={styles.sectionTitleRow}>
          <Text variant="titleMedium" color={theme.colors.textPrimary}>
            Daily Habits & Discipline
          </Text>
          <Badge
            label={`${completedHabitsCount}/${totalHabitsCount} Complete`}
            variant={completedHabitsCount === totalHabitsCount ? 'success' : 'neutral'}
            size="sm"
          />
        </View>

        <View style={{ gap: spacing[2.5], marginTop: spacing[3] }}>
          {habits.habits.map((habit) => {
            const entry = habits.todayEntries.find((e) => e.habitId === habit.id);
            const isDone = !!entry?.isCompleted;

            return (
              <TouchableOpacity
                key={habit.id}
                activeOpacity={0.8}
                onPress={() => dispatch(toggleHabit(habit.id))}
              >
                <Card
                  padding={3.5}
                  style={[
                    styles.habitCard,
                    isDone && { borderColor: 'rgba(74, 222, 128, 0.3)' },
                  ]}
                >
                  <View style={styles.habitLeft}>
                    <View
                      style={[
                        styles.habitCheckbox,
                        {
                          borderColor: isDone ? theme.colors.success : theme.colors.borderStrong,
                          backgroundColor: isDone ? theme.colors.success : 'transparent',
                        },
                      ]}
                    >
                      {isDone && <CheckCircle2 size={16} color={theme.colors.black} />}
                    </View>
                    <Text
                      variant="bodySmall"
                      color={isDone ? theme.colors.textTertiary : theme.colors.textPrimary}
                      style={{
                        textDecorationLine: isDone ? 'line-through' : 'none',
                        fontWeight: '500',
                      }}
                    >
                      {habit.name}
                    </Text>
                  </View>

                  <View style={styles.habitStreak}>
                    <Flame size={13} color={theme.colors.orange} />
                    <Text variant="caption" color={theme.colors.orange}>
                      {habit.streak}d
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[4],
  },
  headerLeft: {
    gap: 3,
  },
  dateLabel: {
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  greetingTitle: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  goalPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2.5],
    marginTop: spacing[1],
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroCard: {
    borderRadius: borderRadius.xl,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroScoreGroup: {
    gap: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  heroIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroProgress: {
    marginTop: spacing[3],
  },
  sectionHeading: {
    fontWeight: '700',
    marginBottom: spacing[3],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  metricCard: {
    width: (width - spacing[5] * 2 - spacing[3]) / 2,
    gap: spacing[2],
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  metricIconWrap: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontWeight: '800',
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.xl,
  },
  workoutCard: {
    borderRadius: borderRadius.xl,
  },
  workoutCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playButtonMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exercisePreviewList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginTop: spacing[3],
  },
  exerciseBullet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chartCard: {
    borderRadius: borderRadius.xl,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 110,
    paddingTop: spacing[2],
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  chartTrack: {
    width: 14,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  chartBar: {
    width: '100%',
    borderRadius: 7,
  },
  habitCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  habitCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
