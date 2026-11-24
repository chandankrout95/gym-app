import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Habit, HabitEntry } from '../../../types';

interface HabitsState {
  habits: Habit[];
  todayEntries: HabitEntry[];
  streaks: Record<string, number>;
  isLoading: boolean;
  error: string | null;
}

const mockDefaultHabits: Habit[] = [
  { id: 'h_wake', name: 'Wake Up 6:30 AM', icon: 'Sun', color: '#F59E0B', frequency: 'daily', streak: 12, isDefault: true, createdAt: '2026-01-01' },
  { id: 'h_water', name: 'Drink 3.5L Water', icon: 'Droplets', color: '#38BDF8', frequency: 'daily', streak: 18, isDefault: true, createdAt: '2026-01-01' },
  { id: 'h_workout', name: 'Complete Workout', icon: 'Dumbbell', color: '#A3E635', frequency: 'daily', streak: 5, isDefault: true, createdAt: '2026-01-01' },
  { id: 'h_meditate', name: '10m Mindfulness', icon: 'Smile', color: '#C084FC', frequency: 'daily', streak: 8, isDefault: true, createdAt: '2026-01-01' },
  { id: 'h_sleep', name: '8 Hours Sleep', icon: 'Moon', color: '#818CF8', frequency: 'daily', streak: 6, isDefault: true, createdAt: '2026-01-01' },
];

const today = new Date().toISOString().split('T')[0];

const mockTodayEntries: HabitEntry[] = [
  { id: 'e_1', habitId: 'h_wake', date: today, isCompleted: true },
  { id: 'e_2', habitId: 'h_water', date: today, isCompleted: true },
  { id: 'e_3', habitId: 'h_workout', date: today, isCompleted: false },
  { id: 'e_4', habitId: 'h_meditate', date: today, isCompleted: true },
  { id: 'e_5', habitId: 'h_sleep', date: today, isCompleted: true },
];

const initialState: HabitsState = {
  habits: mockDefaultHabits,
  todayEntries: mockTodayEntries,
  streaks: { h_wake: 12, h_water: 18, h_workout: 5, h_meditate: 8, h_sleep: 6 },
  isLoading: false,
  error: null,
};

export const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    toggleHabit: (state, action: PayloadAction<string>) => {
      const habitId = action.payload;
      const existing = state.todayEntries.find(e => e.habitId === habitId);
      if (existing) {
        existing.isCompleted = !existing.isCompleted;
      } else {
        state.todayEntries.push({
          id: `entry_${Date.now()}`,
          habitId,
          date: new Date().toISOString().split('T')[0],
          isCompleted: true,
        });
      }
    },
    addHabit: (state, action: PayloadAction<Habit>) => {
      state.habits.push(action.payload);
    },
  },
});

export const { toggleHabit, addHabit } = habitsSlice.actions;
export default habitsSlice.reducer;
