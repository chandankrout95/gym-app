import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DashboardStats {
  steps: number;
  stepsGoal: number;
  caloriesBurned: number;
  caloriesBurnGoal: number;
  activeMinutes: number;
  activeMinutesGoal: number;
  workoutsThisWeek: number;
  workoutsWeekGoal: number;
  waterCurrentMl: number;
  waterGoalMl: number;
  streakDays: number;
  consistencyScore: number; // 0-100 personal score
  weightKg: number;
  weightTargetKg: number;
}

interface DashboardState {
  stats: DashboardStats;
  weeklySteps: number[];
  weeklyCalories: number[];
  daysLabels: string[];
  lastUpdated: string;
}

const getInitialGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const initialState: DashboardState = {
  stats: {
    steps: 8420,
    stepsGoal: 10000,
    caloriesBurned: 540,
    caloriesBurnGoal: 650,
    activeMinutes: 52,
    activeMinutesGoal: 60,
    workoutsThisWeek: 4,
    workoutsWeekGoal: 5,
    waterCurrentMl: 2250,
    waterGoalMl: 3500,
    streakDays: 14,
    consistencyScore: 92,
    weightKg: 78.5,
    weightTargetKg: 75.0,
  },
  weeklySteps: [7200, 9100, 8400, 10500, 9800, 11200, 8420],
  weeklyCalories: [480, 620, 510, 710, 590, 680, 540],
  daysLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
  lastUpdated: new Date().toISOString(),
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateSteps: (state, action: PayloadAction<number>) => {
      state.stats.steps = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    logCaloriesBurned: (state, action: PayloadAction<number>) => {
      state.stats.caloriesBurned += action.payload;
    },
    updateWeight: (state, action: PayloadAction<number>) => {
      state.stats.weightKg = action.payload;
    },
  },
});

export const { updateSteps, logCaloriesBurned, updateWeight } = dashboardSlice.actions;
export default dashboardSlice.reducer;
