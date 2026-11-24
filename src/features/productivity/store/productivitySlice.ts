import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FocusMode, FocusSession } from '../../../types';

interface TimerSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  workoutPrepDuration: number;
}

interface ProductivityState {
  currentMode: FocusMode;
  timerSettings: TimerSettings;
  activeTaskTag: string;
  completedRoundsToday: number;
  totalFocusMinutesToday: number;
  ambientSound: 'none' | 'gym_focus' | 'alpha_waves' | 'white_noise';
  sessionHistory: FocusSession[];
}

const mockSessions: FocusSession[] = [
  {
    id: 'fs_1',
    mode: 'work',
    durationMinutes: 25,
    taskTag: 'Deep Code Review & Architecture',
    completedAt: '2026-03-01T09:30:00.000Z',
  },
  {
    id: 'fs_2',
    mode: 'short_break',
    durationMinutes: 5,
    taskTag: 'Hydration & Posture Reset',
    completedAt: '2026-03-01T09:55:00.000Z',
  },
  {
    id: 'fs_3',
    mode: 'work',
    durationMinutes: 25,
    taskTag: 'Cardio & Mobility Routine Prep',
    completedAt: '2026-03-01T10:25:00.000Z',
  },
  {
    id: 'fs_4',
    mode: 'workout_prep',
    durationMinutes: 10,
    taskTag: 'Pre-Workout Mental Visualization',
    completedAt: '2026-03-01T17:00:00.000Z',
  },
];

const initialState: ProductivityState = {
  currentMode: 'work',
  timerSettings: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    workoutPrepDuration: 10,
  },
  activeTaskTag: 'Heavy Compound Lift Focus',
  completedRoundsToday: 3,
  totalFocusMinutesToday: 60,
  ambientSound: 'gym_focus',
  sessionHistory: mockSessions,
};

export const productivitySlice = createSlice({
  name: 'productivity',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<FocusMode>) => {
      state.currentMode = action.payload;
    },
    setActiveTaskTag: (state, action: PayloadAction<string>) => {
      state.activeTaskTag = action.payload;
    },
    setAmbientSound: (
      state,
      action: PayloadAction<'none' | 'gym_focus' | 'alpha_waves' | 'white_noise'>
    ) => {
      state.ambientSound = action.payload;
    },
    recordSession: (state, action: PayloadAction<FocusSession>) => {
      state.sessionHistory.unshift(action.payload);
      if (action.payload.mode === 'work' || action.payload.mode === 'workout_prep') {
        state.completedRoundsToday += 1;
        state.totalFocusMinutesToday += action.payload.durationMinutes;
      }
    },
    updateTimerSettings: (state, action: PayloadAction<Partial<TimerSettings>>) => {
      state.timerSettings = { ...state.timerSettings, ...action.payload };
    },
  },
});

export const {
  setMode,
  setActiveTaskTag,
  setAmbientSound,
  recordSession,
  updateTimerSettings,
} = productivitySlice.actions;

export default productivitySlice.reducer;
