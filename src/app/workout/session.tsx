import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  X,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  Timer,
  Sparkles,
  Flame,
  Award,
  RotateCcw,
} from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  finishSession,
  cancelSession,
  startRestTimer,
  tickRestTimer,
  stopRestTimer,
} from '../../features/workout/store/workoutSlice';
import { logCaloriesBurned } from '../../features/dashboard/store/dashboardSlice';

import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { WorkoutExercise, WorkoutSet } from '../../types';
import { formatDuration } from '../../utils';
import { spacing, borderRadius } from '../../theme';

export default function ActiveWorkoutSessionScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  // Redux active workout or fallback template
  const defaultWorkoutPlan = useAppSelector((state) => state.workout.workoutPlans[0]);

  // Session state
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    defaultWorkoutPlan?.exercises ?? []
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(720); // 12 mins in
  const [isPaused, setIsPaused] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);
  const [isRestActive, setIsRestActive] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Timer loop for workout elapsed time
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Rest Timer loop
  useEffect(() => {
    if (!isRestActive || restSecondsRemaining === null) return;
    if (restSecondsRemaining <= 0) {
      setIsRestActive(false);
      setRestSecondsRemaining(null);
      return;
    }
    const interval = setInterval(() => {
      setRestSecondsRemaining((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRestActive, restSecondsRemaining]);

  // Handle set values change
  const handleUpdateSet = (
    exIndex: number,
    setIndex: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    const num = parseFloat(value) || 0;
    setExercises((prev) => {
      const copy = [...prev];
      const ex = { ...copy[exIndex] };
      const sets = [...ex.sets];
      sets[setIndex] = { ...sets[setIndex], [field]: num };
      ex.sets = sets;
      copy[exIndex] = ex;
      return copy;
    });
  };

  // Toggle set completed & trigger rest timer
  const handleToggleSetComplete = (exIndex: number, setIndex: number) => {
    setExercises((prev) => {
      const copy = [...prev];
      const ex = { ...copy[exIndex] };
      const sets = [...ex.sets];
      const currentDone = sets[setIndex].isCompleted;
      sets[setIndex] = { ...sets[setIndex], isCompleted: !currentDone };
      ex.sets = sets;
      copy[exIndex] = ex;
      return copy;
    });

    // Auto-trigger rest timer if marking as complete
    const currentDone = exercises[exIndex]?.sets[setIndex]?.isCompleted;
    if (!currentDone) {
      setRestSecondsRemaining(60);
      setIsRestActive(true);
    }
  };

  // Add new set to exercise
  const handleAddSet = (exIndex: number) => {
    setExercises((prev) => {
      const copy = [...prev];
      const ex = { ...copy[exIndex] };
      const prevSet = ex.sets[ex.sets.length - 1];
      const newSet: WorkoutSet = {
        id: `set_${Date.now()}`,
        reps: prevSet?.reps ?? 10,
        weight: prevSet?.weight ?? 20,
        weightUnit: 'kg',
        isCompleted: false,
      };
      ex.sets = [...ex.sets, newSet];
      copy[exIndex] = ex;
      return copy;
    });
  };

  // Remove set
  const handleRemoveSet = (exIndex: number, setIndex: number) => {
    setExercises((prev) => {
      const copy = [...prev];
      const ex = { ...copy[exIndex] };
      ex.sets = ex.sets.filter((_, i) => i !== setIndex);
      copy[exIndex] = ex;
      return copy;
    });
  };

  // Computed workout stats
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.isCompleted).length,
    0
  );
  const totalVolumeKg = exercises.reduce((acc, ex) => {
    return (
      acc +
      ex.sets.reduce((sAcc, s) => {
        return s.isCompleted ? sAcc + (s.weight ?? 0) * (s.reps ?? 0) : sAcc;
      }, 0)
    );
  }, 0);

  // Complete session action
  const handleFinishWorkout = () => {
    const caloriesBurned = Math.round((elapsedSeconds / 60) * 8.5); // ~8.5 kcal/min for resistance
    dispatch(finishSession({ duration: elapsedSeconds, notes: 'Great hypertrophy push session' }));
    dispatch(logCaloriesBurned(caloriesBurned));
    setShowFinishModal(false);
    router.replace('/(tabs)/workout');
  };

  return (
    <ScreenContainer scrollable>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.closeBtn, { backgroundColor: theme.colors.surface }]}
          onPress={() => {
            Alert.alert('Cancel Workout?', 'Progress for this session will be discarded.', [
              { text: 'Keep Training', style: 'cancel' },
              { text: 'Discard', style: 'destructive', onPress: () => router.back() },
            ]);
          }}
        >
          <X size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        {/* Live Elapsed Duration */}
        <View style={[styles.timerBadge, { backgroundColor: theme.colors.surfaceSecondary }]}>
          <Clock size={16} color={theme.colors.primary} />
          <Text variant="titleSmall" color={theme.colors.primary} style={{ fontWeight: '800' }}>
            {formatDuration(elapsedSeconds)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.pauseBtn, { backgroundColor: theme.colors.surface }]}
          onPress={() => setIsPaused((prev) => !prev)}
        >
          {isPaused ? (
            <Play size={18} color={theme.colors.primary} />
          ) : (
            <Pause size={18} color={theme.colors.orange} />
          )}
        </TouchableOpacity>
      </View>

      {/* Floating Rest Timer Widget (When active) */}
      {isRestActive && restSecondsRemaining !== null && (
        <Card
          padding={3.5}
          style={[
            styles.restWidget,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary },
          ]}
        >
          <View style={styles.restWidgetTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Timer size={18} color={theme.colors.primary} />
              <Text variant="labelMedium" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
                Rest Countdown:
              </Text>
            </View>
            <Text variant="headlineSmall" color={theme.colors.primary} style={{ fontWeight: '900' }}>
              {restSecondsRemaining}s
            </Text>
          </View>

          <ProgressBar
            progress={1 - restSecondsRemaining / 90}
            height={4}
            color={theme.colors.primary}
            style={{ marginTop: spacing[2] }}
          />

          <View style={styles.restControls}>
            <TouchableOpacity
              style={[styles.restAddBtn, { backgroundColor: theme.colors.surfaceSecondary }]}
              onPress={() => setRestSecondsRemaining((r) => (r ?? 0) + 30)}
            >
              <Text variant="caption" color={theme.colors.textPrimary}>
                +30s
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.restAddBtn, { backgroundColor: theme.colors.surfaceSecondary }]}
              onPress={() => setRestSecondsRemaining((r) => (r ?? 0) + 60)}
            >
              <Text variant="caption" color={theme.colors.textPrimary}>
                +60s
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.restSkipBtn, { backgroundColor: theme.colors.primaryMuted }]}
              onPress={() => {
                setIsRestActive(false);
                setRestSecondsRemaining(null);
              }}
            >
              <Text variant="caption" color={theme.colors.primary} style={{ fontWeight: '700' }}>
                Skip Rest
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Routine Title & Volume Bar */}
      <View style={{ marginTop: spacing[3] }}>
        <Text variant="caption" color={theme.colors.textTertiary} style={styles.eyebrow}>
          ACTIVE SESSION
        </Text>
        <Text variant="headlineMedium" color={theme.colors.textPrimary} style={{ fontWeight: '900' }}>
          {defaultWorkoutPlan?.name ?? 'Hypertrophy Push Routine'}
        </Text>

        <View style={styles.sessionStatsBar}>
          <Text variant="caption" color={theme.colors.textTertiary}>
            Completed Sets: <Text variant="labelSmall" color={theme.colors.primary}>{completedSets}/{totalSets}</Text>
          </Text>
          <Text variant="caption" color={theme.colors.textTertiary}>
            Total Volume: <Text variant="labelSmall" color={theme.colors.primary}>{totalVolumeKg.toLocaleString()} kg</Text>
          </Text>
        </View>
      </View>

      {/* Exercises & Set Logs */}
      <View style={{ gap: spacing[4], marginTop: spacing[4] }}>
        {exercises.map((item, exIndex) => (
          <Card key={item.id} padding={4} style={styles.exerciseCard}>
            <View style={styles.exHeader}>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
                  {item.exercise.name}
                </Text>
                <Text variant="caption" color={theme.colors.textTertiary} style={{ marginTop: 2 }}>
                  Primary Target: {item.exercise.primaryMuscle.toUpperCase()}
                </Text>
              </View>

              <Badge
                label={`${item.sets.filter((s) => s.isCompleted).length}/${item.sets.length} Sets`}
                variant={
                  item.sets.every((s) => s.isCompleted) ? 'success' : 'neutral'
                }
                size="sm"
              />
            </View>

            {/* Set Table Headers */}
            <View style={styles.tableHeaderRow}>
              <Text variant="caption" color={theme.colors.textTertiary} style={styles.colSet}>
                SET
              </Text>
              <Text variant="caption" color={theme.colors.textTertiary} style={styles.colPrev}>
                PREV
              </Text>
              <Text variant="caption" color={theme.colors.textTertiary} style={styles.colInput}>
                KG
              </Text>
              <Text variant="caption" color={theme.colors.textTertiary} style={styles.colInput}>
                REPS
              </Text>
              <Text variant="caption" color={theme.colors.textTertiary} style={styles.colCheck}>
                DONE
              </Text>
            </View>

            {/* Set Rows */}
            <View style={{ gap: spacing[2], marginTop: spacing[1] }}>
              {item.sets.map((set, setIndex) => (
                <View
                  key={set.id}
                  style={[
                    styles.setRow,
                    set.isCompleted && {
                      backgroundColor: 'rgba(74, 222, 128, 0.08)',
                      borderRadius: borderRadius.md,
                    },
                  ]}
                >
                  <Text variant="labelSmall" color={theme.colors.primary} style={styles.colSet}>
                    {setIndex + 1}
                  </Text>

                  <Text variant="caption" color={theme.colors.textTertiary} style={styles.colPrev}>
                    {(set.weight ?? 20) - 2}kg × {set.reps ?? 10}
                  </Text>

                  {/* Weight Input */}
                  <View style={styles.colInput}>
                    <TextInput
                      style={[
                        styles.numInput,
                        {
                          backgroundColor: theme.colors.inputBackground,
                          color: theme.colors.textPrimary,
                          borderColor: theme.colors.inputBorder,
                        },
                      ]}
                      keyboardType="numeric"
                      value={set.weight !== undefined ? String(set.weight) : ''}
                      onChangeText={(val) => handleUpdateSet(exIndex, setIndex, 'weight', val)}
                    />
                  </View>

                  {/* Reps Input */}
                  <View style={styles.colInput}>
                    <TextInput
                      style={[
                        styles.numInput,
                        {
                          backgroundColor: theme.colors.inputBackground,
                          color: theme.colors.textPrimary,
                          borderColor: theme.colors.inputBorder,
                        },
                      ]}
                      keyboardType="numeric"
                      value={set.reps !== undefined ? String(set.reps) : ''}
                      onChangeText={(val) => handleUpdateSet(exIndex, setIndex, 'reps', val)}
                    />
                  </View>

                  {/* Checkmark Button */}
                  <TouchableOpacity
                    style={styles.colCheck}
                    onPress={() => handleToggleSetComplete(exIndex, setIndex)}
                  >
                    <View
                      style={[
                        styles.checkCircle,
                        {
                          borderColor: set.isCompleted
                            ? theme.colors.success
                            : theme.colors.borderStrong,
                          backgroundColor: set.isCompleted
                            ? theme.colors.success
                            : 'transparent',
                        },
                      ]}
                    >
                      {set.isCompleted && <CheckCircle2 size={16} color={theme.colors.black} />}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Add Set Button */}
            <TouchableOpacity
              style={[styles.addSetBtn, { borderColor: theme.colors.border }]}
              onPress={() => handleAddSet(exIndex)}
            >
              <Plus size={16} color={theme.colors.primary} />
              <Text variant="labelSmall" color={theme.colors.primary} style={{ fontWeight: '600' }}>
                Add Set
              </Text>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      {/* Add Exercise from Library & Finish Session Controls */}
      <View style={{ gap: spacing[3], marginTop: spacing[5], marginBottom: spacing[8] }}>
        <Button
          label="Add More Exercises"
          variant="secondary"
          size="lg"
          fullWidth
          leftIcon={<Plus size={18} color={theme.colors.primary} />}
          onPress={() => router.push('/workout/exercises')}
        />

        <Button
          label="Finish Workout"
          variant="primary"
          size="xl"
          fullWidth
          onPress={() => setShowFinishModal(true)}
        />
      </View>

      {/* Finish Workout Summary Modal */}
      <Modal visible={showFinishModal} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <Card padding={5} style={[styles.finishModalCard, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.modalAwardWrap}>
              <View style={[styles.awardCircle, { backgroundColor: theme.colors.primaryMuted }]}>
                <Award size={40} color={theme.colors.primary} />
              </View>
              <Text variant="headlineMedium" color={theme.colors.textPrimary} style={{ fontWeight: '900', marginTop: spacing[2] }}>
                Workout Crushed!
              </Text>
              <Text variant="bodySmall" color={theme.colors.textTertiary} align="center">
                High intensity maintained. Excellent progressive overload logging.
              </Text>
            </View>

            {/* 3 Summary Badges */}
            <View style={styles.summaryStatsRow}>
              <View style={styles.statCol}>
                <Text variant="caption" color={theme.colors.textTertiary}>
                  DURATION
                </Text>
                <Text variant="titleLarge" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
                  {formatDuration(elapsedSeconds)}
                </Text>
              </View>

              <View style={styles.statCol}>
                <Text variant="caption" color={theme.colors.textTertiary}>
                  VOLUME
                </Text>
                <Text variant="titleLarge" color={theme.colors.primary} style={{ fontWeight: '800' }}>
                  {totalVolumeKg.toLocaleString()} kg
                </Text>
              </View>

              <View style={styles.statCol}>
                <Text variant="caption" color={theme.colors.textTertiary}>
                  SETS
                </Text>
                <Text variant="titleLarge" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
                  {completedSets}/{totalSets}
                </Text>
              </View>
            </View>

            <View style={{ gap: spacing[3], marginTop: spacing[6] }}>
              <Button
                label="Save & Log Session"
                variant="primary"
                size="lg"
                fullWidth
                onPress={handleFinishWorkout}
              />
              <Button
                label="Continue Workout"
                variant="ghost"
                size="md"
                fullWidth
                onPress={() => setShowFinishModal(false)}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[2],
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.full,
  },
  pauseBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restWidget: {
    marginTop: spacing[3],
    borderWidth: 1.5,
    borderRadius: borderRadius.xl,
  },
  restWidgetTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[2.5],
  },
  restAddBtn: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2.5],
    borderRadius: borderRadius.md,
  },
  restSkipBtn: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
  },
  eyebrow: {
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  sessionStatsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  exerciseCard: {
    borderRadius: borderRadius.xl,
  },
  exHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[1],
  },
  colSet: { width: 36, textAlign: 'center', fontWeight: '700' },
  colPrev: { width: 90, textAlign: 'center' },
  colInput: { flex: 1, paddingHorizontal: 4, alignItems: 'center' },
  colCheck: { width: 44, alignItems: 'center', justifyContent: 'center' },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[1.5],
  },
  numInput: {
    width: '100%',
    textAlign: 'center',
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: spacing[3],
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[5],
  },
  finishModalCard: {
    borderRadius: borderRadius['2xl'],
  },
  modalAwardWrap: {
    alignItems: 'center',
  },
  awardCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  statCol: {
    alignItems: 'center',
    gap: 2,
  },
});
