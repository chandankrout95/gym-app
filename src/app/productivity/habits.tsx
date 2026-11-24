import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Sun,
  Droplets,
  Dumbbell,
  Smile,
  Moon,
  Sparkles,
  Calendar,
  X,
  Target,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../store';
import { toggleHabit, addHabit } from '../../features/habits/store/habitsSlice';
import { Habit } from '../../types';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { spacing, borderRadius } from '../../theme';

export default function HabitsScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const { habits, todayEntries, streaks } = useAppSelector((state) => state.habits);

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newHabitName, setNewHabitName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<
    'morning' | 'fitness' | 'nutrition' | 'wellness' | 'evening'
  >('fitness');

  // Compute daily completion
  const completedCount = todayEntries.filter((e) => e.isCompleted).length;
  const totalCount = habits.length;
  const completionRatio = totalCount > 0 ? completedCount / totalCount : 0;
  const completionPercent = Math.round(completionRatio * 100);

  // Filter habits
  const filteredHabits =
    categoryFilter === 'all'
      ? habits
      : habits.filter((h) => h.category === categoryFilter);

  const handleCreateHabit = () => {
    if (!newHabitName.trim()) {
      Alert.alert('Missing Name', 'Please enter a habit title.');
      return;
    }

    const newHabit: Habit = {
      id: `h_${Date.now()}`,
      name: newHabitName.trim(),
      icon: 'Target',
      color: theme.colors.primary,
      category: selectedCategory,
      frequency: 'daily',
      streak: 1,
      isDefault: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    dispatch(addHabit(newHabit));
    setNewHabitName('');
    setModalVisible(false);
  };

  const getHabitIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun size={20} color={color} />;
      case 'Droplets':
        return <Droplets size={20} color={color} />;
      case 'Dumbbell':
        return <Dumbbell size={20} color={color} />;
      case 'Smile':
        return <Smile size={20} color={color} />;
      case 'Moon':
        return <Moon size={20} color={color} />;
      default:
        return <Target size={20} color={color} />;
    }
  };

  return (
    <ScreenContainer scrollable={false}>
      {/* Daily Progress Hero Card */}
      <View style={styles.topSection}>
        <Card variant="default" style={styles.progressHero}>
          <View style={styles.heroTop}>
            <View>
              <Text variant="titleMedium">Today's Discipline</Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {completedCount} of {totalCount} completed
              </Text>
            </View>
            <Badge label={`${completionPercent}%`} variant="primary" />
          </View>

          <ProgressBar
            progress={completionRatio}
            color={theme.colors.primary}
            backgroundColor={theme.colors.surfaceSecondary}
            style={styles.progressBar}
          />
        </Card>

        {/* Categories Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {[
            { id: 'all', label: 'All Habits' },
            { id: 'morning', label: 'Morning' },
            { id: 'fitness', label: 'Fitness' },
            { id: 'nutrition', label: 'Nutrition' },
            { id: 'wellness', label: 'Recovery' },
            { id: 'evening', label: 'Evening' },
          ].map((cat) => {
            const isSelected = categoryFilter === cat.id;
            return (
              <TouchableOpacity
                key={`cat-${cat.id}`}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.surfaceSecondary,
                  },
                ]}
                onPress={() => setCategoryFilter(cat.id)}
              >
                <Text
                  variant="caption"
                  color={
                    isSelected
                      ? theme.colors.textInverse
                      : theme.colors.textSecondary
                  }
                  style={styles.categoryText}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Habits List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredHabits.map((habit) => {
          const entry = todayEntries.find((e) => e.habitId === habit.id);
          const isDone = !!entry?.isCompleted;
          const streakDays = streaks[habit.id] ?? habit.streak;

          return (
            <Card
              key={habit.id}
              variant="default"
              style={[
                styles.habitCard,
                isDone && {
                  borderColor: theme.colors.primary,
                  backgroundColor: 'rgba(163, 230, 53, 0.04)',
                },
              ]}
            >
              <TouchableOpacity
                style={styles.habitMainRow}
                onPress={() => dispatch(toggleHabit(habit.id))}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: theme.colors.surfaceSecondary },
                  ]}
                >
                  {getHabitIcon(habit.icon, habit.color || theme.colors.primary)}
                </View>

                <View style={styles.habitMeta}>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.habitTitle,
                      isDone && {
                        textDecorationLine: 'line-through',
                        color: theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {habit.name}
                  </Text>

                  <View style={styles.streakRow}>
                    <Flame size={14} color={theme.colors.orange} />
                    <Text variant="caption" color={theme.colors.orange}>
                      {streakDays} day streak
                    </Text>
                  </View>
                </View>

                {/* Checkbox toggle */}
                <View style={styles.checkWrapper}>
                  {isDone ? (
                    <CheckCircle2 size={26} color={theme.colors.primary} />
                  ) : (
                    <Circle size={26} color={theme.colors.border} />
                  )}
                </View>
              </TouchableOpacity>

              {/* 7-Day Consistency Micro-Dots */}
              <View style={styles.dotsRow}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, dIdx) => {
                  const isDayDone = dIdx <= 4 || (dIdx === 5 && isDone);
                  return (
                    <View key={`dot-${habit.id}-${dIdx}`} style={styles.dotCol}>
                      <View
                        style={[
                          styles.consistencyDot,
                          {
                            backgroundColor: isDayDone
                              ? theme.colors.primary
                              : theme.colors.surfaceSecondary,
                          },
                        ]}
                      />
                      <Text
                        variant="caption"
                        color={theme.colors.textTertiary}
                        style={styles.dayLabel}
                      >
                        {day}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </Card>
          );
        })}

        <Button
          label="Add Custom Habit"
          variant="outline"
          size="md"
          onPress={() => setModalVisible(true)}
          leftIcon={<Plus size={18} color={theme.colors.textPrimary} />}
          style={styles.addBtn}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Add Custom Habit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text variant="titleMedium">Create Custom Habit</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.modalInput,
                {
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="e.g. 5g Creatine Monohydrate Post-Workout"
              placeholderTextColor={theme.colors.textTertiary}
              value={newHabitName}
              onChangeText={setNewHabitName}
            />

            <Text variant="caption" color={theme.colors.textSecondary} style={styles.mt3}>
              Category
            </Text>
            <View style={styles.modalCategoryGrid}>
              {[
                { id: 'morning', label: 'Morning' },
                { id: 'fitness', label: 'Fitness' },
                { id: 'nutrition', label: 'Nutrition' },
                { id: 'wellness', label: 'Recovery' },
                { id: 'evening', label: 'Evening' },
              ].map((c) => (
                <TouchableOpacity
                  key={`mcat-${c.id}`}
                  style={[
                    styles.modalCatChip,
                    {
                      backgroundColor:
                        selectedCategory === c.id
                          ? theme.colors.primary
                          : theme.colors.surfaceSecondary,
                    },
                  ]}
                  onPress={() => setSelectedCategory(c.id as any)}
                >
                  <Text
                    variant="caption"
                    color={
                      selectedCategory === c.id
                        ? theme.colors.textInverse
                        : theme.colors.textSecondary
                    }
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              label="Save Habit"
              variant="primary"
              size="lg"
              onPress={handleCreateHabit}
              style={styles.modalSaveBtn}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topSection: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  progressHero: {
    padding: spacing[4],
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2.5],
  },
  progressBar: {
    marginTop: spacing[1],
  },
  categoriesRow: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingVertical: spacing[3],
  },
  categoryChip: {
    paddingHorizontal: spacing[3.5],
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.full,
  },
  categoryText: {
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  habitCard: {
    padding: spacing[3.5],
  },
  habitMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitMeta: {
    flex: 1,
    marginLeft: spacing[3],
  },
  habitTitle: {
    fontWeight: '600',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[1],
  },
  checkWrapper: {
    padding: spacing[1],
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    marginTop: spacing[3],
    paddingTop: spacing[2],
  },
  dotCol: {
    alignItems: 'center',
  },
  consistencyDot: {
    width: 14,
    height: 14,
    borderRadius: borderRadius.full,
    marginBottom: spacing[1],
  },
  dayLabel: {
    fontSize: 9,
  },
  addBtn: {
    marginTop: spacing[2],
  },
  bottomSpacer: {
    height: spacing[12],
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  modalInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
    fontSize: 15,
  },
  mt3: {
    marginTop: spacing[3],
    marginBottom: spacing[1.5],
  },
  modalCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  modalCatChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.full,
  },
  modalSaveBtn: {
    marginTop: spacing[5],
  },
});
