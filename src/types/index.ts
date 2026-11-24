// ============================================================
// Core User & Auth Types
// ============================================================

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
  subscription: SubscriptionTier;
}

export interface UserProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  height?: number;
  heightUnit?: 'cm' | 'ft';
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  fitnessGoal?: FitnessGoal;
  activityLevel?: ActivityLevel;
  trainingExperience?: 'beginner' | 'intermediate' | 'advanced';
  dietaryPreferences?: DietaryPreference[];
  equipment?: EquipmentType[];
  bio?: string;
  location?: string;
}

export type FitnessGoal = 'weight_loss' | 'muscle_building' | 'lean_muscle' | 'maintenance' | 'general_fitness' | 'endurance';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
export type DietaryPreference = 'vegetarian' | 'vegan' | 'non_vegetarian' | 'eggetarian' | 'gluten_free' | 'dairy_free' | 'keto' | 'paleo';
export type EquipmentType = 'barbell' | 'dumbbells' | 'machines' | 'cables' | 'bodyweight' | 'resistance_bands' | 'kettlebells';
export type SubscriptionTier = 'free' | 'premium' | 'elite';

// ============================================================
// Workout Types
// ============================================================

export interface Exercise {
  id: string;
  name: string;
  muscleGroups: string[];
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: EquipmentType[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'strength' | 'cardio' | 'flexibility' | 'balance';
  instructions: string[];
  tips: string[];
  videoUrl?: string;
  imageUrl?: string;
  isCustom?: boolean;
}

export interface WorkoutSet {
  id: string;
  reps?: number;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  duration?: number;
  distance?: number;
  restTime?: number;
  isCompleted: boolean;
  rpe?: number;
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
  restBetweenSets?: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  exercises: WorkoutExercise[];
  estimatedDuration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdBy?: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  id: string;
  planId?: string;
  name: string;
  exercises: WorkoutExercise[];
  startedAt: string;
  completedAt?: string;
  duration?: number; // seconds
  totalVolume?: number; // kg or lbs moved
  notes?: string;
  mood?: 1 | 2 | 3 | 4 | 5;
  status: 'in_progress' | 'completed' | 'cancelled';
}

// ============================================================
// Nutrition Types
// ============================================================

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  isIndian?: boolean;
  isVegetarian?: boolean;
  imageUrl?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealEntry {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  servingSize: number;
  mealType: MealType;
  loggedAt: string;
}

export interface DailyNutrition {
  date: string;
  meals: MealEntry[];
  waterMl: number;
  targets: NutritionTargets;
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  water?: number;
}

// ============================================================
// Transformation & Body Measurement Types
// ============================================================

export interface BodyMeasurement {
  id: string;
  date: string;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  bodyFat?: number;
  waist?: number;
  chest?: number;
  hips?: number;
  leftArm?: number;
  rightArm?: number;
  leftThigh?: number;
  rightThigh?: number;
  neck?: number;
  unit?: 'cm' | 'in';
  notes?: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  imageUri: string;
  angle: 'front' | 'back' | 'side' | 'left' | 'right';
  notes?: string;
  isPrivate: boolean;
}

// ============================================================
// Habit & Productivity Types
// ============================================================

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  category?: 'morning' | 'fitness' | 'nutrition' | 'wellness' | 'evening';
  targetValue?: number;
  unit?: string;
  frequency: 'daily' | 'weekly';
  reminder?: string;
  streak: number;
  isDefault: boolean;
  createdAt: string;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string;
  value?: number;
  isCompleted: boolean;
  notes?: string;
}

export type FocusMode = 'work' | 'short_break' | 'long_break' | 'workout_prep';

export interface FocusSession {
  id: string;
  mode: FocusMode;
  durationMinutes: number;
  taskTag?: string;
  completedAt: string;
}

// ============================================================
// Sleep & Recovery Types
// ============================================================

export interface SleepRecord {
  id: string;
  date: string;
  bedtime: string; // e.g. "23:15"
  wakeTime: string; // e.g. "07:15"
  durationMinutes: number;
  deepSleepMinutes: number;
  remSleepMinutes: number;
  lightSleepMinutes: number;
  awakeMinutes: number;
  qualityScore: number; // 0 - 100
  readinessScore: number; // 0 - 100
  restingHeartRate?: number;
  notes?: string;
}

// ============================================================
// Analytics & Strength Progression Types
// ============================================================

export interface StrengthRecord {
  id: string;
  exerciseName: string;
  category: 'bench_press' | 'squat' | 'deadlift' | 'overhead_press' | 'other';
  date: string;
  weight: number;
  reps: number;
  estimated1RM: number; // weight * (1 + reps / 30)
  isPR?: boolean;
}

export interface VolumeWeek {
  weekLabel: string;
  totalVolumeKg: number;
  workoutsCompleted: number;
}

export interface MuscleDistribution {
  muscleGroup: string;
  percentage: number;
  setsCount: number;
  color: string;
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
