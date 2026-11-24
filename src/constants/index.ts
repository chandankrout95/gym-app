export const APP_NAME = 'FITVERSE';
export const APP_VERSION = '1.0.0';

// API
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.fitverse.app/v1';
export const API_TIMEOUT = 15000;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'fitverse_auth_token',
  REFRESH_TOKEN: 'fitverse_refresh_token',
  USER_PROFILE: 'fitverse_user_profile',
  THEME_MODE: 'fitverse_theme_mode',
  ONBOARDING_COMPLETE: 'fitverse_onboarding_complete',
  WORKOUT_DRAFT: 'fitverse_workout_draft',
} as const;

// Fitness Goals
export const FITNESS_GOALS = [
  { id: 'weight_loss', label: 'Weight Loss', icon: 'TrendingDown', description: 'Burn fat and get leaner' },
  { id: 'muscle_building', label: 'Muscle Building', icon: 'Dumbbell', description: 'Hypertrophy and strength gains' },
  { id: 'lean_muscle', label: 'Lean Muscle Gain', icon: 'Zap', description: 'Build muscle with minimal fat' },
  { id: 'maintenance', label: 'Weight Maintenance', icon: 'Target', description: 'Stay fit, healthy and active' },
  { id: 'general_fitness', label: 'General Fitness', icon: 'Activity', description: 'Overall health & longevity' },
  { id: 'endurance', label: 'Endurance', icon: 'Timer', description: 'Stamina, cardio and resilience' },
] as const;

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', multiplier: 1.2, description: 'Little or no exercise' },
  { id: 'light', label: 'Lightly Active', multiplier: 1.375, description: '1-3 days/week' },
  { id: 'moderate', label: 'Moderately Active', multiplier: 1.55, description: '3-5 days/week' },
  { id: 'very_active', label: 'Very Active', multiplier: 1.725, description: '6-7 days/week' },
  { id: 'extra_active', label: 'Extra Active', multiplier: 1.9, description: 'Hard exercise & physical work' },
] as const;

export const MUSCLE_GROUPS = [
  'chest', 'shoulders', 'biceps', 'triceps', 'forearms',
  'abs', 'obliques', 'traps', 'lats', 'lower_back',
  'glutes', 'quadriceps', 'hamstrings', 'calves',
] as const;

export type MuscleGroup = typeof MUSCLE_GROUPS[number];

// Nutrition
export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
export type MealType = typeof MEAL_TYPES[number];

// Units
export const WEIGHT_UNITS = ['kg', 'lbs'] as const;
export const HEIGHT_UNITS = ['cm', 'ft'] as const;
export const DISTANCE_UNITS = ['km', 'miles'] as const;

// Workout
export const REST_TIMER_OPTIONS = [30, 45, 60, 90, 120, 180, 240, 300] as const;
export const DEFAULT_REST_TIME = 60;
export const MAX_SETS = 20;
export const MAX_REPS = 100;

// Habits
export const DEFAULT_WATER_GOAL_ML = 2500;
export const DEFAULT_STEPS_GOAL = 10000;
export const DEFAULT_CALORIES_BURN_GOAL = 600;
export const DEFAULT_SLEEP_GOAL_HOURS = 8;

// Charts
export const CHART_PERIODS = ['1W', '1M', '3M', '6M', '1Y'] as const;
export type ChartPeriod = typeof CHART_PERIODS[number];
