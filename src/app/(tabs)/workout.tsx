import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Dumbbell, Play, Timer, Flame, ChevronRight, Plus, Sparkles } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../store';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { MuscleWorkoutBrowser } from '../../features/workout/components/MuscleWorkoutBrowser';
import { spacing, borderRadius } from '../../theme';

export default function WorkoutTab() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const workoutPlans = useAppSelector((state) => state.workout.workoutPlans);
  const recentSessions = useAppSelector((state) => state.workout.recentSessions);

  const splits = ['Push/Pull/Legs', 'Upper/Lower', 'Arnold Split', 'Full Body'];
  const [selectedSplit, setSelectedSplit] = useState('Push/Pull/Legs');

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <View>
          <Text variant="caption" color={theme.colors.textTertiary} style={styles.eyebrow}>
            TRAINING & PERIODIZATION
          </Text>
          <Text variant="headlineLarge" color={theme.colors.textPrimary} style={{ fontWeight: '900' }}>
            Workouts
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: theme.colors.primaryMuted, borderColor: theme.colors.primary }]}
          activeOpacity={0.8}
          onPress={() => router.push('/workout/create-plan')}
        >
          <Plus size={18} color={theme.colors.primary} />
          <Text variant="labelSmall" color={theme.colors.primary} style={{ fontWeight: '700' }}>
            Custom Plan
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1. Target Muscle Workouts Browser with Overlay Gradient & Tier Dropdown */}
      <MuscleWorkoutBrowser />

      {/* Split Selector Chips */}
      <View style={{ marginTop: spacing[3] }}>
        <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ fontWeight: '700', marginBottom: spacing[2] }}>
          Periodized Training Splits
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.splitChips}
        >
          {splits.map((split) => {
            const isActive = selectedSplit === split;
            return (
              <TouchableOpacity
                key={split}
                onPress={() => setSelectedSplit(split)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                    borderColor: isActive ? theme.colors.primary : theme.colors.border,
                  },
                ]}
              >
                <Text
                  variant="labelSmall"
                  color={isActive ? theme.colors.textOnPrimary : theme.colors.textSecondary}
                  style={{ fontWeight: '600' }}
                >
                  {split}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Active / Current Workout Routine Card */}
      <View style={{ marginTop: spacing[5] }}>
        <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ fontWeight: '700', marginBottom: spacing[3] }}>
          Today's Routine
        </Text>

        {workoutPlans.map((plan) => (
          <Card key={plan.id} padding={4} style={styles.planCard}>
            <View style={styles.planHeader}>
              <Badge label={plan.difficulty.toUpperCase()} variant="primary" size="sm" />
              <View style={styles.durationPill}>
                <Timer size={14} color={theme.colors.textTertiary} />
                <Text variant="caption" color={theme.colors.textTertiary}>
                  {plan.estimatedDuration} mins
                </Text>
              </View>
            </View>

            <Text variant="titleLarge" color={theme.colors.textPrimary} style={{ marginTop: spacing[2], fontWeight: '800' }}>
              {plan.name}
            </Text>
            <Text variant="bodySmall" color={theme.colors.textTertiary} style={{ marginTop: 2 }}>
              {plan.description}
            </Text>

            <View style={styles.exerciseList}>
              {plan.exercises.map((ex, idx) => (
                <View key={ex.id} style={[styles.exerciseItem, { borderBottomColor: theme.colors.border }]}>
                  <View style={styles.exLeft}>
                    <Text variant="labelSmall" color={theme.colors.primary} style={styles.exIndex}>
                      0{idx + 1}
                    </Text>
                    <View>
                      <Text variant="titleSmall" color={theme.colors.textPrimary}>
                        {ex.exercise.name}
                      </Text>
                      <Text variant="caption" color={theme.colors.textTertiary}>
                        {ex.sets.length} Sets • {ex.exercise.equipment.join(', ')}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color={theme.colors.textTertiary} />
                </View>
              ))}
            </View>

            <Button
              label="Start Session"
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<Play size={18} color={theme.colors.textOnPrimary} fill={theme.colors.textOnPrimary} />}
              onPress={() => router.push('/workout/session')}
              style={{ marginTop: spacing[4] }}
            />
          </Card>
        ))}
      </View>

      {/* Muscle Heatmap & Anatomy Entry Callout */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/workout/anatomy')}
      >
        <Card
          padding={4}
          style={[
            styles.anatomyCallout,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, marginTop: spacing[5] },
          ]}
        >
          <View style={styles.anatomyLeft}>
            <View style={[styles.anatomyIconWrap, { backgroundColor: theme.colors.primaryMuted }]}>
              <Sparkles size={22} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
                Interactive Muscle Anatomy
              </Text>
              <Text variant="caption" color={theme.colors.textTertiary} style={{ marginTop: 2 }}>
                View front/back human anatomy heatmap & recovery status
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={theme.colors.primary} />
        </Card>
      </TouchableOpacity>

      {/* Exercise Library Shortcut Callout */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/workout/exercises')}
        style={{ marginTop: spacing[3] }}
      >
        <Card
          padding={4}
          style={[
            styles.anatomyCallout,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <View style={styles.anatomyLeft}>
            <View style={[styles.anatomyIconWrap, { backgroundColor: 'rgba(96, 165, 250, 0.12)' }]}>
              <Dumbbell size={22} color={theme.colors.blue400} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
                Verified Exercise Library
              </Text>
              <Text variant="caption" color={theme.colors.textTertiary} style={{ marginTop: 2 }}>
                Browse 20+ compound & isolation movements with tips
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={theme.colors.blue400} />
        </Card>
      </TouchableOpacity>

      {/* Recent Workout History */}
      <View style={{ marginTop: spacing[6], marginBottom: spacing[8] }}>
        <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ fontWeight: '700', marginBottom: spacing[3] }}>
          Recent Workout History
        </Text>

        {recentSessions.map((session) => (
          <Card key={session.id} padding={3.5} style={styles.historyCard}>
            <View style={styles.historyLeft}>
              <View style={[styles.historyIcon, { backgroundColor: 'rgba(74, 222, 128, 0.12)' }]}>
                <Dumbbell size={18} color={theme.colors.success} />
              </View>
              <View>
                <Text variant="titleSmall" color={theme.colors.textPrimary} style={{ fontWeight: '600' }}>
                  {session.name}
                </Text>
                <Text variant="caption" color={theme.colors.textTertiary}>
                  {Math.round((session.duration ?? 0) / 60)} mins • {session.totalVolume?.toLocaleString()} kg moved
                </Text>
              </View>
            </View>
            <Badge label="COMPLETED" variant="success" size="sm" />
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[4],
  },
  eyebrow: {
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  splitChips: {
    gap: spacing[2],
    marginTop: spacing[4],
  },
  chip: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  planCard: {
    borderRadius: borderRadius.xl,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseList: {
    marginTop: spacing[3],
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  exLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  exIndex: {
    fontWeight: '800',
    width: 22,
  },
  anatomyCallout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  anatomyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  anatomyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
