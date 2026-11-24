import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DailyNutrition, MealEntry, NutritionTargets } from '../../../types';

interface NutritionState {
  today: DailyNutrition | null;
  history: DailyNutrition[];
  targets: NutritionTargets;
  waterMl: number;
  waterGoalMl: number;
  isLoading: boolean;
  error: string | null;
}

const defaultTargets: NutritionTargets = {
  calories: 2400,
  protein: 180,
  carbs: 260,
  fat: 70,
  fiber: 30,
  water: 3500,
};

const mockTodayMeals: MealEntry[] = [
  {
    id: 'meal_1',
    foodItem: {
      id: 'f_eggs',
      name: 'Boiled Eggs & Whole Wheat Toast',
      brand: 'Home Prep',
      servingSize: 1,
      servingUnit: 'portion',
      calories: 360,
      protein: 24,
      carbs: 32,
      fat: 14,
      fiber: 4,
      isVegetarian: false,
    },
    quantity: 1,
    servingSize: 1,
    mealType: 'breakfast',
    loggedAt: '2026-11-24T08:30:00Z',
  },
  {
    id: 'meal_2',
    foodItem: {
      id: 'f_paneer_rice',
      name: 'Grilled Paneer Tikka with Brown Rice & Dal',
      brand: 'FITVERSE Kitchen',
      servingSize: 1,
      servingUnit: 'bowl',
      calories: 620,
      protein: 38,
      carbs: 72,
      fat: 20,
      fiber: 8,
      isIndian: true,
      isVegetarian: true,
    },
    quantity: 1,
    servingSize: 1,
    mealType: 'lunch',
    loggedAt: '2026-11-24T13:15:00Z',
  },
];

const initialState: NutritionState = {
  today: {
    date: new Date().toISOString().split('T')[0],
    meals: mockTodayMeals,
    waterMl: 2250,
    targets: defaultTargets,
  },
  history: [],
  targets: defaultTargets,
  waterMl: 2250,
  waterGoalMl: 3500,
  isLoading: false,
  error: null,
};

export const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    setTodayNutrition: (state, action: PayloadAction<DailyNutrition>) => {
      state.today = action.payload;
      state.waterMl = action.payload.waterMl;
    },
    addMealEntry: (state, action: PayloadAction<MealEntry>) => {
      if (!state.today) {
        state.today = {
          date: new Date().toISOString().split('T')[0],
          meals: [],
          waterMl: state.waterMl,
          targets: state.targets,
        };
      }
      state.today.meals.push(action.payload);
    },
    removeMealEntry: (state, action: PayloadAction<string>) => {
      if (state.today) {
        state.today.meals = state.today.meals.filter(m => m.id !== action.payload);
      }
    },
    logWater: (state, action: PayloadAction<number>) => {
      state.waterMl = Math.min(state.waterMl + action.payload, 6000);
      if (state.today) state.today.waterMl = state.waterMl;
    },
    setWater: (state, action: PayloadAction<number>) => {
      state.waterMl = action.payload;
      if (state.today) state.today.waterMl = action.payload;
    },
    setTargets: (state, action: PayloadAction<NutritionTargets>) => {
      state.targets = action.payload;
      if (state.today) state.today.targets = action.payload;
    },
  },
});

export const {
  setTodayNutrition,
  addMealEntry,
  removeMealEntry,
  logWater,
  setWater,
  setTargets,
} = nutritionSlice.actions;

export default nutritionSlice.reducer;
