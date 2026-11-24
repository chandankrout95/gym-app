import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus, Trash2, Dumbbell, Clock, Check } from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeContext';
import { useAppDispatch } from '../../store';
import { setWorkoutPlans } from '../../features/workout/store/workoutSlice';
import { useAppSelector } from '../../store';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { EXERCISE_LIBRARY } from '../../features/exercises/data/exerciseLibrary';
import { WorkoutPlan, WorkoutExercise } from '../../types';
import { spacing, borderRadius } from '../../theme';

export default function CreateWorkoutPlanScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const existingPlans = useAppSelector((state) => state.workout.workoutPlans);

  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleAddExercise = (exerciseId: string) => {
    const found = EXERCISE_LIBRARY.find((e) => e.id === exerciseId);
    if (!found) return;

    const newEx: WorkoutExercise = {
      id: `plan_ex_${Date.now()}_${Math.random()}`,
      exercise: found,
      sets: [
        { id: 's1', reps: 10, weight: 20, isCompleted: false },
        { id: 's2', reps: 10, weight: 20, isCompleted: false },
        { id: 's3', reps: 10, weight: 20, isCompleted: false },
      ],
    };

    setSelectedExercises((prev) => [...prev, newEx]);
    setShowPicker(false);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSavePlan = () => {
    if (!planName.trim()) {
      Alert.alert('Required', 'Please enter a routine name.');
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert('Required', 'Please add at least 1 exercise to the plan.');
      return;
    }

    const newPlan: WorkoutPlan = {
      id: `plan_${Date.now()}`,
      name: planName.trim(),
      description: description.trim() || 'Custom user training routine',
      difficulty,
      estimatedDuration: selectedExercises.length * 12,
      tags: [difficulty, 'Custom'],
      exercises: selectedExercises,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(setWorkoutPlans([newPlan, ...existingPlans]));
    Alert.alert('Success', 'Your custom workout routine has been saved!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: spacing[3] }}>
          <Text variant="caption" color={theme.colors.textTertiary} style={styles.eyebrow}>
            ROUTINE BUILDER
          </Text>
          <Text variant="headlineSmall" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
            Create Workout Plan
          </Text>
        </View>
      </View>

      {/* Routine Metadata Form */}
      <View style={{ gap: spacing[3.5], marginTop: spacing[4] }}>
        <Input
          label="Routine Title"
          placeholder="e.g. Back & Biceps Hypertrophy"
          value={planName}
          onChangeText={setPlanName}
        />

        <Input
          label="Focus / Notes (Optional)"
          placeholder="e.g. Focus on lat width and controlled negatives"
          value={description}
          onChangeText={setDescription}
        />

        {/* Difficulty Selector */}
        <View>
          <Text variant="labelMedium" color={theme.colors.textSecondary} style={{ marginBottom: spacing[2] }}>
            Target Difficulty
          </Text>
          <View style={styles.diffRow}>
            {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => {
              const isSelected = difficulty === lvl;
              return (
                <TouchableOpacity
                  key={lvl}
                  onPress={() => setDifficulty(lvl)}
                  style={[
                    styles.diffBtn,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                >
                  <Text
                    variant="labelSmall"
                    color={isSelected ? theme.colors.textOnPrimary : theme.colors.textSecondary}
                    style={{ fontWeight: '700', textTransform: 'capitalize' }}
                  >
                    {lvl}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Exercises in this Plan */}
      <View style={{ marginTop: spacing[5] }}>
        <View style={styles.sectionHeaderRow}>
          <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
            Exercises ({selectedExercises.length})
          </Text>
          <TouchableOpacity
            style={[styles.addExChip, { backgroundColor: theme.colors.primaryMuted }]}
            onPress={() => setShowPicker((prev) => !prev)}
          >
            <Plus size={16} color={theme.colors.primary} />
            <Text variant="labelSmall" color={theme.colors.primary} style={{ fontWeight: '700' }}>
              Add Exercise
            </Text>
          </TouchableOpacity>
        </View>

        {/* Exercise Quick Picker List (when open) */}
        {showPicker && (
          <Card padding={3.5} style={[styles.pickerCard, { marginTop: spacing[3] }]}>
            <Text variant="labelSmall" color={theme.colors.textTertiary} style={{ marginBottom: spacing[2] }}>
              Select from verified library:
            </Text>
            <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
              {EXERCISE_LIBRARY.map((ex) => (
                <TouchableOpacity
                  key={ex.id}
                  style={[styles.pickerItem, { borderBottomColor: theme.colors.border }]}
                  onPress={() => handleAddExercise(ex.id)}
                >
                  <Text variant="bodySmall" color={theme.colors.textPrimary} style={{ fontWeight: '600' }}>
                    {ex.name}
                  </Text>
                  <Text variant="caption" color={theme.colors.primary}>
                    + Add
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Card>
        )}

        {/* Selected Exercise Cards */}
        <View style={{ gap: spacing[3], marginTop: spacing[3] }}>
          {selectedExercises.map((item, idx) => (
            <Card key={item.id} padding={3.5} style={styles.selectedExCard}>
              <View style={styles.selectedExTop}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleSmall" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
                    {idx + 1}. {item.exercise.name}
                  </Text>
                  <Text variant="caption" color={theme.colors.textTertiary}>
                    {item.sets.length} Target Sets • {item.exercise.primaryMuscle.toUpperCase()}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => handleRemoveExercise(idx)}>
                  <Trash2 size={18} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            </Card>
          ))}

          {selectedExercises.length === 0 && !showPicker && (
            <Card padding={4} style={{ alignItems: 'center', marginTop: spacing[2] }}>
              <Dumbbell size={28} color={theme.colors.textTertiary} />
              <Text variant="bodySmall" color={theme.colors.textTertiary} style={{ marginTop: spacing[2] }}>
                No exercises added yet. Tap "+ Add Exercise" above.
              </Text>
            </Card>
          )}
        </View>
      </View>

      {/* Save Plan Button */}
      <View style={{ marginTop: spacing[6], marginBottom: spacing[8] }}>
        <Button
          label="Save Routine"
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSavePlan}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
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
  eyebrow: {
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  diffRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  diffBtn: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addExChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.full,
  },
  pickerCard: {
    borderRadius: borderRadius.xl,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2.5],
    borderBottomWidth: 1,
  },
  selectedExCard: {
    borderRadius: borderRadius.lg,
  },
  selectedExTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
