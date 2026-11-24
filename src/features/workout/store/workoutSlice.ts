import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkoutSession, WorkoutExercise, WorkoutSet, WorkoutPlan } from '../../../types';

interface WorkoutState {
  activeSession: WorkoutSession | null;
  sessionStartTime: number | null;
  restTimerActive: boolean;
  restTimerDuration: number;
  restTimerRemaining: number;
  recentSessions: WorkoutSession[];
  workoutPlans: WorkoutPlan[];
  selectedPlan: WorkoutPlan | null;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isLoading: boolean;
  error: string | null;
}

const mockDefaultPlan: WorkoutPlan = {
  id: 'plan_ppl_push',
  name: 'Upper Body Hypertrophy (Push)',
  description: 'Targeting Chest, Front Delts & Triceps with compound & isolation movements',
  difficulty: 'intermediate',
  estimatedDuration: 55,
  tags: ['Hypertrophy', 'Chest', 'Triceps', 'Push'],
  createdAt: '2026-02-01T00:00:00Z',
  updatedAt: '2026-02-01T00:00:00Z',
  exercises: [
    {
      id: 'we_01',
      exercise: {
        id: 'ex_bench',
        name: 'Incline Dumbbell Press',
        muscleGroups: ['chest', 'shoulders', 'triceps'],
        primaryMuscle: 'chest',
        secondaryMuscles: ['shoulders', 'triceps'],
        equipment: ['dumbbells'],
        difficulty: 'intermediate',
        category: 'strength',
        instructions: [
          'Set bench to 30-45 degree incline.',
          'Lower dumbbells controlled until chest level.',
          'Drive up through the chest squeezing at the top.',
        ],
        tips: ['Keep shoulder blades retracted and core braced'],
      },
      sets: [
        { id: 'set_1', reps: 10, weight: 30, weightUnit: 'kg', isCompleted: true },
        { id: 'set_2', reps: 10, weight: 32, weightUnit: 'kg', isCompleted: true },
        { id: 'set_3', reps: 8, weight: 34, weightUnit: 'kg', isCompleted: false },
        { id: 'set_4', reps: 8, weight: 34, weightUnit: 'kg', isCompleted: false },
      ],
    },
    {
      id: 'we_02',
      exercise: {
        id: 'ex_cable_fly',
        name: 'Standing Cable Fly',
        muscleGroups: ['chest'],
        primaryMuscle: 'chest',
        secondaryMuscles: ['shoulders'],
        equipment: ['cables'],
        difficulty: 'beginner',
        category: 'strength',
        instructions: ['Maintain a slight elbow bend and bring hands together in an arc.'],
        tips: ['Focus on constant tension throughout the contraction'],
      },
      sets: [
        { id: 'set_2_1', reps: 12, weight: 15, weightUnit: 'kg', isCompleted: false },
        { id: 'set_2_2', reps: 12, weight: 15, weightUnit: 'kg', isCompleted: false },
        { id: 'set_2_3', reps: 12, weight: 15, weightUnit: 'kg', isCompleted: false },
      ],
    },
  ],
};

const initialState: WorkoutState = {
  activeSession: null,
  sessionStartTime: null,
  restTimerActive: false,
  restTimerDuration: 60,
  restTimerRemaining: 0,
  recentSessions: [
    {
      id: 'sess_prev_1',
      planId: 'plan_ppl_pull',
      name: 'Pull & Back Power',
      startedAt: '2026-11-23T07:30:00Z',
      completedAt: '2026-11-23T08:25:00Z',
      duration: 3300,
      totalVolume: 8450,
      status: 'completed',
      exercises: [],
    },
  ],
  workoutPlans: [mockDefaultPlan],
  selectedPlan: mockDefaultPlan,
  currentExerciseIndex: 0,
  currentSetIndex: 0,
  isLoading: false,
  error: null,
};

export const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    startSession: (
      state,
      action: PayloadAction<Omit<WorkoutSession, 'id' | 'startedAt' | 'status'>>
    ) => {
      state.activeSession = {
        ...action.payload,
        id: `sess_${Date.now()}`,
        startedAt: new Date().toISOString(),
        status: 'in_progress',
      };
      state.sessionStartTime = Date.now();
      state.currentExerciseIndex = 0;
      state.currentSetIndex = 0;
    },
    completeSet: (
      state,
      action: PayloadAction<{
        exerciseIndex: number;
        setIndex: number;
        setData: Partial<WorkoutSet>;
      }>
    ) => {
      if (!state.activeSession) return;
      const { exerciseIndex, setIndex, setData } = action.payload;
      const exercise = state.activeSession.exercises[exerciseIndex];
      if (exercise && exercise.sets[setIndex]) {
        exercise.sets[setIndex] = {
          ...exercise.sets[setIndex],
          ...setData,
          isCompleted: true,
        };
      }
    },
    addExerciseToSession: (state, action: PayloadAction<WorkoutExercise>) => {
      if (state.activeSession) {
        state.activeSession.exercises.push(action.payload);
      }
    },
    finishSession: (state, action: PayloadAction<{ duration: number; notes?: string }>) => {
      if (state.activeSession) {
        state.activeSession.status = 'completed';
        state.activeSession.completedAt = new Date().toISOString();
        state.activeSession.duration = action.payload.duration;
        if (action.payload.notes) state.activeSession.notes = action.payload.notes;
        state.recentSessions.unshift(state.activeSession);
        if (state.recentSessions.length > 50) state.recentSessions.pop();
        state.activeSession = null;
        state.sessionStartTime = null;
        state.restTimerActive = false;
      }
    },
    cancelSession: (state) => {
      state.activeSession = null;
      state.sessionStartTime = null;
      state.restTimerActive = false;
    },
    startRestTimer: (state, action: PayloadAction<number>) => {
      state.restTimerDuration = action.payload;
      state.restTimerRemaining = action.payload;
      state.restTimerActive = true;
    },
    tickRestTimer: (state) => {
      if (state.restTimerRemaining > 0) {
        state.restTimerRemaining -= 1;
      } else {
        state.restTimerActive = false;
      }
    },
    stopRestTimer: (state) => {
      state.restTimerActive = false;
      state.restTimerRemaining = 0;
    },
    setWorkoutPlans: (state, action: PayloadAction<WorkoutPlan[]>) => {
      state.workoutPlans = action.payload;
    },
    setSelectedPlan: (state, action: PayloadAction<WorkoutPlan | null>) => {
      state.selectedPlan = action.payload;
    },
  },
});

export const {
  startSession,
  completeSet,
  addExerciseToSession,
  finishSession,
  cancelSession,
  startRestTimer,
  tickRestTimer,
  stopRestTimer,
  setWorkoutPlans,
  setSelectedPlan,
} = workoutSlice.actions;

export default workoutSlice.reducer;
