import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isOnboardingComplete: boolean;
}

const mockInitialUser: User = {
  id: 'usr_001',
  email: 'alex.fitness@fitverse.app',
  username: 'alexfit',
  fullName: 'Alex Vance',
  avatarUrl: undefined,
  createdAt: '2026-01-15T08:00:00Z',
  updatedAt: '2026-11-20T10:00:00Z',
  subscription: 'premium',
  profile: {
    age: 28,
    gender: 'male',
    height: 180,
    heightUnit: 'cm',
    weight: 78.5,
    weightUnit: 'kg',
    fitnessGoal: 'muscle_building',
    activityLevel: 'very_active',
    trainingExperience: 'intermediate',
    dietaryPreferences: ['high_protein', 'non_vegetarian'] as any,
    bio: 'Pushing daily limits. Consistency over perfection.',
    location: 'Bangalore, India',
  },
};

const initialState: AuthState = {
  user: mockInitialUser,
  token: 'mock_jwt_token_fitverse_pro',
  refreshToken: 'mock_refresh_token_fitverse',
  isAuthenticated: true,
  isLoading: false,
  error: null,
  isOnboardingComplete: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User['profile']>>) => {
      if (state.user) {
        state.user.profile = { ...state.user.profile, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
      state.isOnboardingComplete = action.payload;
    },
    logout: () => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isOnboardingComplete: false,
    }),
  },
});

export const {
  setCredentials,
  updateUser,
  updateUserProfile,
  setLoading,
  setError,
  setOnboardingComplete,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
