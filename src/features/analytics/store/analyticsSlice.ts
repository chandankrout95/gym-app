import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StrengthRecord, VolumeWeek, MuscleDistribution } from '../../../types';

interface NutritionTrendDay {
  day: string;
  calories: number;
  protein: number;
  targetCalories: number;
  targetProtein: number;
}

interface AnalyticsState {
  strengthRecords: StrengthRecord[];
  volumeHistory: VolumeWeek[];
  muscleDistributions: MuscleDistribution[];
  nutritionAdherence: {
    targetHitPercent: number;
    averageCalories: number;
    averageProtein: number;
    weeklyTrend: NutritionTrendDay[];
  };
}

const mockStrengthRecords: StrengthRecord[] = [
  // Bench Press
  { id: 'sr_1', exerciseName: 'Barbell Bench Press', category: 'bench_press', date: '2026-01-05', weight: 80, reps: 5, estimated1RM: 93.3 },
  { id: 'sr_2', exerciseName: 'Barbell Bench Press', category: 'bench_press', date: '2026-01-19', weight: 85, reps: 5, estimated1RM: 99.2 },
  { id: 'sr_3', exerciseName: 'Barbell Bench Press', category: 'bench_press', date: '2026-02-02', weight: 90, reps: 4, estimated1RM: 102.0 },
  { id: 'sr_4', exerciseName: 'Barbell Bench Press', category: 'bench_press', date: '2026-02-16', weight: 95, reps: 3, estimated1RM: 104.5 },
  { id: 'sr_5', exerciseName: 'Barbell Bench Press', category: 'bench_press', date: '2026-03-01', weight: 100, reps: 3, estimated1RM: 110.0, isPR: true },

  // Barbell Squat
  { id: 'sr_6', exerciseName: 'Barbell Back Squat', category: 'squat', date: '2026-01-07', weight: 110, reps: 5, estimated1RM: 128.3 },
  { id: 'sr_7', exerciseName: 'Barbell Back Squat', category: 'squat', date: '2026-01-21', weight: 117.5, reps: 5, estimated1RM: 137.1 },
  { id: 'sr_8', exerciseName: 'Barbell Back Squat', category: 'squat', date: '2026-02-04', weight: 125, reps: 5, estimated1RM: 145.8 },
  { id: 'sr_9', exerciseName: 'Barbell Back Squat', category: 'squat', date: '2026-02-18', weight: 132.5, reps: 4, estimated1RM: 150.2 },
  { id: 'sr_10', exerciseName: 'Barbell Back Squat', category: 'squat', date: '2026-03-01', weight: 140, reps: 3, estimated1RM: 154.0, isPR: true },

  // Conventional Deadlift
  { id: 'sr_11', exerciseName: 'Conventional Deadlift', category: 'deadlift', date: '2026-01-09', weight: 130, reps: 5, estimated1RM: 151.7 },
  { id: 'sr_12', exerciseName: 'Conventional Deadlift', category: 'deadlift', date: '2026-01-23', weight: 140, reps: 5, estimated1RM: 163.3 },
  { id: 'sr_13', exerciseName: 'Conventional Deadlift', category: 'deadlift', date: '2026-02-06', weight: 150, reps: 4, estimated1RM: 170.0 },
  { id: 'sr_14', exerciseName: 'Conventional Deadlift', category: 'deadlift', date: '2026-02-20', weight: 160, reps: 3, estimated1RM: 176.0 },
  { id: 'sr_15', exerciseName: 'Conventional Deadlift', category: 'deadlift', date: '2026-03-01', weight: 170, reps: 2, estimated1RM: 181.3, isPR: true },

  // Overhead Press
  { id: 'sr_16', exerciseName: 'Standing Overhead Press', category: 'overhead_press', date: '2026-01-06', weight: 50, reps: 5, estimated1RM: 58.3 },
  { id: 'sr_17', exerciseName: 'Standing Overhead Press', category: 'overhead_press', date: '2026-01-20', weight: 55, reps: 5, estimated1RM: 64.2 },
  { id: 'sr_18', exerciseName: 'Standing Overhead Press', category: 'overhead_press', date: '2026-02-03', weight: 57.5, reps: 5, estimated1RM: 67.1 },
  { id: 'sr_19', exerciseName: 'Standing Overhead Press', category: 'overhead_press', date: '2026-02-17', weight: 62.5, reps: 4, estimated1RM: 70.8 },
  { id: 'sr_20', exerciseName: 'Standing Overhead Press', category: 'overhead_press', date: '2026-03-01', weight: 67.5, reps: 3, estimated1RM: 74.3, isPR: true },
];

const mockVolumeHistory: VolumeWeek[] = [
  { weekLabel: 'Jan W1', totalVolumeKg: 18500, workoutsCompleted: 4 },
  { weekLabel: 'Jan W2', totalVolumeKg: 19800, workoutsCompleted: 4 },
  { weekLabel: 'Jan W3', totalVolumeKg: 21200, workoutsCompleted: 5 },
  { weekLabel: 'Jan W4', totalVolumeKg: 22600, workoutsCompleted: 5 },
  { weekLabel: 'Feb W1', totalVolumeKg: 21900, workoutsCompleted: 4 },
  { weekLabel: 'Feb W2', totalVolumeKg: 23800, workoutsCompleted: 5 },
  { weekLabel: 'Feb W3', totalVolumeKg: 25100, workoutsCompleted: 5 },
  { weekLabel: 'Feb W4', totalVolumeKg: 26400, workoutsCompleted: 5 },
];

const mockMuscleDistributions: MuscleDistribution[] = [
  { muscleGroup: 'Legs & Glutes', percentage: 28, setsCount: 32, color: '#A3E635' },
  { muscleGroup: 'Back & Lats', percentage: 24, setsCount: 28, color: '#38BDF8' },
  { muscleGroup: 'Chest & Pecs', percentage: 22, setsCount: 26, color: '#F97316' },
  { muscleGroup: 'Shoulders & Delts', percentage: 14, setsCount: 16, color: '#C084FC' },
  { muscleGroup: 'Arms (Biceps/Triceps)', percentage: 12, setsCount: 14, color: '#F43F5E' },
];

const mockNutritionTrend: NutritionTrendDay[] = [
  { day: 'Mon', calories: 2380, protein: 178, targetCalories: 2400, targetProtein: 180 },
  { day: 'Tue', calories: 2420, protein: 182, targetCalories: 2400, targetProtein: 180 },
  { day: 'Wed', calories: 2350, protein: 175, targetCalories: 2400, targetProtein: 180 },
  { day: 'Thu', calories: 2410, protein: 185, targetCalories: 2400, targetProtein: 180 },
  { day: 'Fri', calories: 2450, protein: 180, targetCalories: 2400, targetProtein: 180 },
  { day: 'Sat', calories: 2490, protein: 176, targetCalories: 2400, targetProtein: 180 },
  { day: 'Sun', calories: 2390, protein: 182, targetCalories: 2400, targetProtein: 180 },
];

const initialState: AnalyticsState = {
  strengthRecords: mockStrengthRecords,
  volumeHistory: mockVolumeHistory,
  muscleDistributions: mockMuscleDistributions,
  nutritionAdherence: {
    targetHitPercent: 94,
    averageCalories: 2412,
    averageProtein: 180,
    weeklyTrend: mockNutritionTrend,
  },
};

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    addStrengthRecord: (state, action: PayloadAction<StrengthRecord>) => {
      state.strengthRecords.push(action.payload);
    },
    updateVolumeHistory: (state, action: PayloadAction<VolumeWeek[]>) => {
      state.volumeHistory = action.payload;
    },
  },
});

export const { addStrengthRecord, updateVolumeHistory } = analyticsSlice.actions;
export default analyticsSlice.reducer;
