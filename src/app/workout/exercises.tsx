import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Search,
  Dumbbell,
  Filter,
  CheckCircle2,
  X,
  Plus,
  Play,
  Info,
} from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { EXERCISE_LIBRARY } from '../../features/exercises/data/exerciseLibrary';
import { Exercise } from '../../types';
import { spacing, borderRadius } from '../../theme';

const MUSCLE_FILTER_CHIPS = [
  'All',
  'chest',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'abs',
  'obliques',
  'traps',
  'lats',
  'lower_back',
  'glutes',
  'quadriceps',
  'hamstrings',
  'calves',
];

export default function ExerciseLibraryScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filteredExercises = useMemo(() => {
    return EXERCISE_LIBRARY.filter((ex) => {
      const matchesSearch =
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.primaryMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.equipment.some((eq) => eq.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMuscle =
        selectedMuscle === 'All' ||
        ex.primaryMuscle === selectedMuscle ||
        ex.muscleGroups.includes(selectedMuscle);

      return matchesSearch && matchesMuscle;
    });
  }, [searchQuery, selectedMuscle]);

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
            VERIFIED DIRECTORY
          </Text>
          <Text variant="headlineSmall" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
            Exercise Library
          </Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={{ marginTop: spacing[4] }}>
        <Input
          placeholder="Search exercise, muscle, equipment..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={18} color={theme.colors.inputPlaceholder} />}
        />
      </View>

      {/* Muscle Group Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.chipsContainer, { marginTop: spacing[3] }]}
      >
        {MUSCLE_FILTER_CHIPS.map((muscle) => {
          const isActive = selectedMuscle === muscle;
          return (
            <TouchableOpacity
              key={muscle}
              onPress={() => setSelectedMuscle(muscle)}
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
                style={{ fontWeight: '600', textTransform: 'capitalize' }}
              >
                {muscle.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Exercise Count */}
      <View style={styles.countRow}>
        <Text variant="caption" color={theme.colors.textTertiary}>
          Showing {filteredExercises.length} Exercises
        </Text>
      </View>

      {/* Exercise List */}
      <View style={{ gap: spacing[3], marginTop: spacing[2], marginBottom: spacing[8] }}>
        {filteredExercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            activeOpacity={0.8}
            onPress={() => setSelectedExercise(exercise)}
          >
            <Card padding={3.5} style={styles.exerciseCard}>
              <View style={styles.exerciseRow}>
                <View style={[styles.exIconWrap, { backgroundColor: theme.colors.surfaceSecondary }]}>
                  <Dumbbell size={20} color={theme.colors.primary} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text variant="titleSmall" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
                    {exercise.name}
                  </Text>
                  <View style={styles.metaRow}>
                    <Badge
                      label={exercise.primaryMuscle.replace('_', ' ').toUpperCase()}
                      variant="primary"
                      size="sm"
                    />
                    <Badge label={exercise.difficulty.toUpperCase()} variant="neutral" size="sm" />
                    <Text variant="caption" color={theme.colors.textTertiary}>
                      {exercise.equipment.join(', ')}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.infoBtn, { backgroundColor: theme.colors.surfaceSecondary }]}
                  onPress={() => setSelectedExercise(exercise)}
                >
                  <Info size={18} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Exercise Detail Instructions Modal */}
      <Modal
        visible={!!selectedExercise}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedExercise(null)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Badge
                  label={selectedExercise?.primaryMuscle.replace('_', ' ').toUpperCase() ?? ''}
                  variant="primary"
                  size="sm"
                />
                <Text variant="titleLarge" color={theme.colors.textPrimary} style={{ fontWeight: '800', marginTop: 4 }}>
                  {selectedExercise?.name}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.closeBtn, { backgroundColor: theme.colors.surfaceSecondary }]}
                onPress={() => setSelectedExercise(null)}
              >
                <X size={18} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400, marginTop: spacing[3] }}>
              <Text variant="labelMedium" color={theme.colors.textPrimary} style={{ fontWeight: '700', marginBottom: spacing[2] }}>
                Execution Instructions:
              </Text>

              <View style={{ gap: spacing[2] }}>
                {selectedExercise?.instructions.map((step, idx) => (
                  <View key={idx} style={styles.stepRow}>
                    <Text variant="labelSmall" color={theme.colors.primary} style={styles.stepNum}>
                      {idx + 1}.
                    </Text>
                    <Text variant="bodySmall" color={theme.colors.textSecondary} style={{ flex: 1 }}>
                      {step}
                    </Text>
                  </View>
                ))}
              </View>

              {selectedExercise?.tips && selectedExercise.tips.length > 0 && (
                <View style={[styles.tipsBox, { backgroundColor: theme.colors.surfaceSecondary, marginTop: spacing[4] }]}>
                  <Text variant="labelSmall" color={theme.colors.orange} style={{ fontWeight: '700', marginBottom: 4 }}>
                    Coach Tip:
                  </Text>
                  {selectedExercise.tips.map((tip, i) => (
                    <Text key={i} variant="caption" color={theme.colors.textSecondary}>
                      • {tip}
                    </Text>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={{ marginTop: spacing[4] }}>
              <Button
                label="Add Exercise to Session"
                variant="primary"
                size="lg"
                fullWidth
                onPress={() => {
                  setSelectedExercise(null);
                  router.push('/workout/session');
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  chipsContainer: {
    gap: spacing[2],
  },
  chip: {
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[3.5],
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  countRow: {
    marginTop: spacing[3],
    marginBottom: spacing[1],
  },
  exerciseCard: {
    borderRadius: borderRadius.xl,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  exIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: 4,
  },
  infoBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
  },
  stepNum: {
    fontWeight: '800',
    width: 18,
  },
  tipsBox: {
    padding: spacing[3.5],
    borderRadius: borderRadius.lg,
  },
});
