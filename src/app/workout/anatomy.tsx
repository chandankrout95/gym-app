import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Dumbbell,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { HumanAnatomyFront } from '../../features/anatomy/components/HumanAnatomyFront';
import { HumanAnatomyBack } from '../../features/anatomy/components/HumanAnatomyBack';
import { MuscleId, MuscleStatus, MuscleRecoveryState, MUSCLE_STATUS_COLORS } from '../../features/anatomy/types';
import { EXERCISE_LIBRARY } from '../../features/exercises/data/exerciseLibrary';
import { spacing, borderRadius } from '../../theme';

// Real-world simulated recovery state based on user workout history
const mockMuscleRecoveryData: Record<MuscleId, MuscleRecoveryState> = {
  chest: {
    id: 'chest',
    name: 'Pectoralis Major & Minor',
    status: 'trained',
    lastTrainedDaysAgo: 2,
    weeklySets: 14,
    recoveryPercentage: 88,
    suggestedAction: 'Optimal readiness. Ready for progressive overload or volume.',
  },
  shoulders: {
    id: 'shoulders',
    name: 'Deltoids (Anterior, Lateral, Posterior)',
    status: 'trained',
    lastTrainedDaysAgo: 2,
    weeklySets: 12,
    recoveryPercentage: 80,
    suggestedAction: 'Fully primed for overhead pressing and lateral raises.',
  },
  triceps: {
    id: 'triceps',
    name: 'Triceps Brachii (3 Heads)',
    status: 'trained',
    lastTrainedDaysAgo: 2,
    weeklySets: 10,
    recoveryPercentage: 82,
    suggestedAction: 'Adequately restored; compound push movements are cleared.',
  },
  biceps: {
    id: 'biceps',
    name: 'Biceps Brachii & Brachialis',
    status: 'not_trained',
    lastTrainedDaysAgo: 5,
    weeklySets: 8,
    recoveryPercentage: 100,
    suggestedAction: 'Completely recovered. Due for high-intensity pulling stimulus.',
  },
  forearms: {
    id: 'forearms',
    name: 'Brachioradialis & Wrist Flexors',
    status: 'not_trained',
    lastTrainedDaysAgo: 5,
    weeklySets: 6,
    recoveryPercentage: 100,
    suggestedAction: 'Ready for heavy grips and farmer carries.',
  },
  abs: {
    id: 'abs',
    name: 'Rectus Abdominis & Core',
    status: 'trained',
    lastTrainedDaysAgo: 1,
    weeklySets: 9,
    recoveryPercentage: 75,
    suggestedAction: 'Mild fatigue; maintain light core stability work.',
  },
  obliques: {
    id: 'obliques',
    name: 'Internal & External Obliques',
    status: 'not_trained',
    lastTrainedDaysAgo: 4,
    weeklySets: 6,
    recoveryPercentage: 95,
    suggestedAction: 'Refreshed. Rotation and anti-rotation work recommended.',
  },
  lats: {
    id: 'lats',
    name: 'Latissimus Dorsi',
    status: 'high_frequency',
    lastTrainedDaysAgo: 1,
    weeklySets: 18,
    recoveryPercentage: 62,
    suggestedAction: 'High weekly volume. Consider deloading pull intensity.',
  },
  traps: {
    id: 'traps',
    name: 'Trapezius (Upper, Middle, Lower)',
    status: 'trained',
    lastTrainedDaysAgo: 3,
    weeklySets: 10,
    recoveryPercentage: 90,
    suggestedAction: 'Well rested. Ready for rows and shrugs.',
  },
  lower_back: {
    id: 'lower_back',
    name: 'Erector Spinae',
    status: 'recovery_needed',
    lastTrainedDaysAgo: 1,
    weeklySets: 16,
    recoveryPercentage: 45,
    suggestedAction: 'Fatigue accumulated. Avoid heavy spinal loading today.',
  },
  glutes: {
    id: 'glutes',
    name: 'Gluteus Maximus & Medius',
    status: 'not_trained',
    lastTrainedDaysAgo: 4,
    weeklySets: 12,
    recoveryPercentage: 96,
    suggestedAction: 'Fully recovered. Primed for hip thrusts and squats.',
  },
  quadriceps: {
    id: 'quadriceps',
    name: 'Quadriceps Femoris (4 Heads)',
    status: 'recovery_needed',
    lastTrainedDaysAgo: 1,
    weeklySets: 16,
    recoveryPercentage: 42,
    suggestedAction: 'Heavy soreness present. Prioritize active recovery and hydration.',
  },
  hamstrings: {
    id: 'hamstrings',
    name: 'Biceps Femoris & Semitendinosus',
    status: 'trained',
    lastTrainedDaysAgo: 3,
    weeklySets: 10,
    recoveryPercentage: 86,
    suggestedAction: 'Restored. Ideal window for Romanian deadlifts and curls.',
  },
  calves: {
    id: 'calves',
    name: 'Gastrocnemius & Soleus',
    status: 'not_trained',
    lastTrainedDaysAgo: 4,
    weeklySets: 8,
    recoveryPercentage: 98,
    suggestedAction: 'Full recovery achieved. Frequency can be increased.',
  },
};

export default function MuscleAnatomyScreen() {
  const { theme } = useTheme();
  const [viewAngle, setViewAngle] = useState<'front' | 'back'>('front');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleId>('chest');

  const muscleStatusMap = Object.entries(mockMuscleRecoveryData).reduce(
    (acc, [id, data]) => {
      acc[id as MuscleId] = data.status;
      return acc;
    },
    {} as Record<MuscleId, MuscleStatus>
  );

  const selectedData = mockMuscleRecoveryData[selectedMuscle];

  // Exercises targeting this muscle
  const targetedExercises = EXERCISE_LIBRARY.filter(
    (ex) => ex.primaryMuscle === selectedMuscle || ex.muscleGroups.includes(selectedMuscle)
  );

  const getStatusBadge = (status: MuscleStatus) => {
    switch (status) {
      case 'trained':
        return { label: 'Optimal / Trained', variant: 'success' as const, color: theme.colors.success };
      case 'high_frequency':
        return { label: 'High Frequency', variant: 'warning' as const, color: theme.colors.orange };
      case 'recovery_needed':
        return { label: 'Fatigued / Rest', variant: 'error' as const, color: theme.colors.error };
      case 'not_trained':
      default:
        return { label: 'Not Trained Recently', variant: 'neutral' as const, color: theme.colors.textTertiary };
    }
  };

  const statusBadge = getStatusBadge(selectedData.status);

  return (
    <ScreenContainer scrollable>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text variant="caption" color={theme.colors.textTertiary} style={styles.eyebrow}>
            BIOMECHANICAL TARGETING
          </Text>
          <Text variant="headlineSmall" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
            Muscle Anatomy Map
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.angleToggleBtn, { backgroundColor: theme.colors.surfaceSecondary }]}
          onPress={() => setViewAngle((prev) => (prev === 'front' ? 'back' : 'front'))}
        >
          <RotateCcw size={16} color={theme.colors.primary} />
          <Text variant="labelSmall" color={theme.colors.primary} style={{ fontWeight: '700' }}>
            {viewAngle === 'front' ? 'Back' : 'Front'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Heatmap Legend */}
      <Card padding={3} style={[styles.legendCard, { marginTop: spacing[3] }]}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: MUSCLE_STATUS_COLORS.not_trained }]} />
            <Text variant="caption" color={theme.colors.textTertiary}>
              Untrained
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: MUSCLE_STATUS_COLORS.trained }]} />
            <Text variant="caption" color={theme.colors.textTertiary}>
              Optimal
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: MUSCLE_STATUS_COLORS.high_frequency }]} />
            <Text variant="caption" color={theme.colors.textTertiary}>
              High Freq
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: MUSCLE_STATUS_COLORS.recovery_needed }]} />
            <Text variant="caption" color={theme.colors.textTertiary}>
              Rest Due
            </Text>
          </View>
        </View>
      </Card>

      {/* Anatomy Canvas Area */}
      <View style={[styles.canvasContainer, { backgroundColor: theme.colors.surfaceSecondary }]}>
        <View style={styles.canvasHeader}>
          <Text variant="labelSmall" color={theme.colors.textTertiary}>
            TAP ANY MUSCLE GROUP TO INSPECT
          </Text>
          <Badge label={viewAngle.toUpperCase()} variant="primary" size="sm" />
        </View>

        {viewAngle === 'front' ? (
          <HumanAnatomyFront
            selectedMuscle={selectedMuscle}
            onSelectMuscle={setSelectedMuscle}
            muscleStatusMap={muscleStatusMap}
            width={260}
            height={390}
          />
        ) : (
          <HumanAnatomyBack
            selectedMuscle={selectedMuscle}
            onSelectMuscle={setSelectedMuscle}
            muscleStatusMap={muscleStatusMap}
            width={260}
            height={390}
          />
        )}
      </View>

      {/* Muscle Detailed Recovery Panel */}
      <Card padding={4} style={[styles.detailCard, { marginTop: spacing[4] }]}>
        <View style={styles.detailHeader}>
          <View style={{ flex: 1 }}>
            <Text variant="headlineSmall" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
              {selectedData.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginTop: 4 }}>
              <Badge label={statusBadge.label} variant={statusBadge.variant} size="sm" />
              <Text variant="caption" color={theme.colors.textTertiary}>
                Trained {selectedData.lastTrainedDaysAgo}d ago
              </Text>
            </View>
          </View>

          <View style={styles.recoveryStatBox}>
            <Text variant="displaySmall" color={statusBadge.color} style={{ fontWeight: '900' }}>
              {selectedData.recoveryPercentage}%
            </Text>
            <Text variant="caption" color={theme.colors.textTertiary}>
              Recovered
            </Text>
          </View>
        </View>

        <View style={{ marginTop: spacing[3] }}>
          <ProgressBar
            progress={selectedData.recoveryPercentage / 100}
            height={6}
            color={statusBadge.color}
          />
        </View>

        <View style={[styles.guidanceBox, { backgroundColor: theme.colors.surfaceSecondary, marginTop: spacing[3] }]}>
          <Activity size={18} color={theme.colors.primary} />
          <Text variant="bodySmall" color={theme.colors.textSecondary} style={{ flex: 1 }}>
            {selectedData.suggestedAction}
          </Text>
        </View>

        <View style={styles.volumeRow}>
          <Text variant="caption" color={theme.colors.textTertiary}>
            Weekly Training Volume:
          </Text>
          <Text variant="labelSmall" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
            {selectedData.weeklySets} sets logged this week
          </Text>
        </View>
      </Card>

      {/* Targeted Exercises for this Muscle */}
      <View style={{ marginTop: spacing[5], marginBottom: spacing[8] }}>
        <View style={styles.exerciseHeaderRow}>
          <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
            Exercises for {selectedMuscle.replace('_', ' ').toUpperCase()}
          </Text>
          <Text variant="caption" color={theme.colors.textTertiary}>
            {targetedExercises.length} Exercises
          </Text>
        </View>

        <View style={{ gap: spacing[3], marginTop: spacing[3] }}>
          {targetedExercises.map((exercise) => (
            <Card key={exercise.id} padding={3.5} style={styles.exerciseCard}>
              <View style={styles.exerciseLeft}>
                <View style={[styles.exerciseIconWrap, { backgroundColor: theme.colors.surfaceSecondary }]}>
                  <Dumbbell size={18} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="titleSmall" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
                    {exercise.name}
                  </Text>
                  <View style={styles.exerciseMetaRow}>
                    <Badge label={exercise.difficulty.toUpperCase()} variant="neutral" size="sm" />
                    <Text variant="caption" color={theme.colors.textTertiary}>
                      {exercise.equipment.join(', ')}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.addExBtn, { backgroundColor: theme.colors.primaryMuted }]}
                onPress={() => router.push('/(tabs)/workout')}
              >
                <Text variant="labelSmall" color={theme.colors.primary} style={{ fontWeight: '700' }}>
                  Train
                </Text>
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[2],
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  eyebrow: {
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  angleToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.lg,
  },
  legendCard: {
    borderRadius: borderRadius.lg,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  canvasContainer: {
    marginTop: spacing[3],
    borderRadius: borderRadius['2xl'],
    paddingVertical: spacing[4],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  canvasHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  detailCard: {
    borderRadius: borderRadius.xl,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recoveryStatBox: {
    alignItems: 'flex-end',
  },
  guidanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    borderRadius: borderRadius.lg,
  },
  volumeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[3],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  exerciseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  exerciseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  exerciseIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: 2,
  },
  addExBtn: {
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[3.5],
    borderRadius: borderRadius.md,
  },
});
