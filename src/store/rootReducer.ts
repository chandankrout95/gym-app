import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import workoutReducer from '../features/workout/store/workoutSlice';
import nutritionReducer from '../features/nutrition/store/nutritionSlice';
import habitsReducer from '../features/habits/store/habitsSlice';
import dashboardReducer from '../features/dashboard/store/dashboardSlice';
import transformationReducer from '../features/transformation/store/transformationSlice';
import sleepReducer from '../features/sleep/store/sleepSlice';
import productivityReducer from '../features/productivity/store/productivitySlice';
import analyticsReducer from '../features/analytics/store/analyticsSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  workout: workoutReducer,
  nutrition: nutritionReducer,
  habits: habitsReducer,
  dashboard: dashboardReducer,
  transformation: transformationReducer,
  sleep: sleepReducer,
  productivity: productivityReducer,
  analytics: analyticsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
