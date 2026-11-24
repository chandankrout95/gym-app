import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BodyMeasurement, ProgressPhoto } from '../../../types';

export interface TransformationGoals {
  startingWeight: number;
  currentWeight: number;
  targetWeight: number;
  targetBodyFat: number;
  startDate: string;
  targetDate: string;
}

interface TransformationState {
  measurements: BodyMeasurement[];
  photos: ProgressPhoto[];
  isPrivateMode: boolean;
  goals: TransformationGoals;
  isLoading: boolean;
  error: string | null;
}

const mockMeasurements: BodyMeasurement[] = [
  {
    id: 'm_1',
    date: '2026-01-01',
    weight: 84.5,
    weightUnit: 'kg',
    bodyFat: 21.5,
    waist: 88,
    chest: 104,
    hips: 99,
    leftArm: 36,
    rightArm: 36.5,
    leftThigh: 58,
    rightThigh: 58.5,
    neck: 39,
    unit: 'cm',
    notes: 'Starting baseline measurement',
  },
  {
    id: 'm_2',
    date: '2026-01-15',
    weight: 83.2,
    weightUnit: 'kg',
    bodyFat: 20.4,
    waist: 86.5,
    chest: 104.5,
    hips: 98,
    leftArm: 36.5,
    rightArm: 37,
    leftThigh: 58.5,
    rightThigh: 59,
    neck: 39,
    unit: 'cm',
    notes: '2 weeks into calorie deficit',
  },
  {
    id: 'm_3',
    date: '2026-02-01',
    weight: 81.8,
    weightUnit: 'kg',
    bodyFat: 19.2,
    waist: 85,
    chest: 105,
    hips: 97,
    leftArm: 37,
    rightArm: 37.5,
    leftThigh: 59,
    rightThigh: 59.5,
    neck: 38.5,
    unit: 'cm',
    notes: 'Solid strength preservation',
  },
  {
    id: 'm_4',
    date: '2026-02-15',
    weight: 80.4,
    weightUnit: 'kg',
    bodyFat: 18.0,
    waist: 83.5,
    chest: 106,
    hips: 96,
    leftArm: 37.5,
    rightArm: 38,
    leftThigh: 59.5,
    rightThigh: 60,
    neck: 38.5,
    unit: 'cm',
    notes: 'Abs beginning to show definition',
  },
  {
    id: 'm_5',
    date: '2026-03-01',
    weight: 79.2,
    weightUnit: 'kg',
    bodyFat: 16.8,
    waist: 82,
    chest: 106.5,
    hips: 95,
    leftArm: 38,
    rightArm: 38.5,
    leftThigh: 60,
    rightThigh: 60.5,
    neck: 38,
    unit: 'cm',
    notes: 'Peak vascularity & conditioning',
  },
];

const mockPhotos: ProgressPhoto[] = [
  {
    id: 'p_1',
    date: '2026-01-01',
    angle: 'front',
    imageUri: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
    notes: 'Day 1 baseline photo',
    isPrivate: true,
  },
  {
    id: 'p_2',
    date: '2026-01-01',
    angle: 'side',
    imageUri: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    notes: 'Day 1 profile view',
    isPrivate: true,
  },
  {
    id: 'p_3',
    date: '2026-01-01',
    angle: 'back',
    imageUri: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&auto=format&fit=crop&q=80',
    notes: 'Day 1 rear lat spread baseline',
    isPrivate: true,
  },
  {
    id: 'p_4',
    date: '2026-03-01',
    angle: 'front',
    imageUri: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=80',
    notes: 'Week 8 update - significant core definition',
    isPrivate: true,
  },
  {
    id: 'p_5',
    date: '2026-03-01',
    angle: 'side',
    imageUri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    notes: 'Week 8 profile view',
    isPrivate: true,
  },
  {
    id: 'p_6',
    date: '2026-03-01',
    angle: 'back',
    imageUri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    notes: 'Week 8 back definition & taper',
    isPrivate: true,
  },
];

const initialState: TransformationState = {
  measurements: mockMeasurements,
  photos: mockPhotos,
  isPrivateMode: false,
  goals: {
    startingWeight: 84.5,
    currentWeight: 79.2,
    targetWeight: 76.0,
    targetBodyFat: 14.0,
    startDate: '2026-01-01',
    targetDate: '2026-04-15',
  },
  isLoading: false,
  error: null,
};

export const transformationSlice = createSlice({
  name: 'transformation',
  initialState,
  reducers: {
    addMeasurement: (state, action: PayloadAction<BodyMeasurement>) => {
      state.measurements.unshift(action.payload);
      if (action.payload.weight) {
        state.goals.currentWeight = action.payload.weight;
      }
    },
    deleteMeasurement: (state, action: PayloadAction<string>) => {
      state.measurements = state.measurements.filter((m) => m.id !== action.payload);
    },
    addPhoto: (state, action: PayloadAction<ProgressPhoto>) => {
      state.photos.unshift(action.payload);
    },
    deletePhoto: (state, action: PayloadAction<string>) => {
      state.photos = state.photos.filter((p) => p.id !== action.payload);
    },
    togglePrivateMode: (state) => {
      state.isPrivateMode = !state.isPrivateMode;
    },
    setGoals: (state, action: PayloadAction<TransformationGoals>) => {
      state.goals = action.payload;
    },
  },
});

export const {
  addMeasurement,
  deleteMeasurement,
  addPhoto,
  deletePhoto,
  togglePrivateMode,
  setGoals,
} = transformationSlice.actions;

export default transformationSlice.reducer;
