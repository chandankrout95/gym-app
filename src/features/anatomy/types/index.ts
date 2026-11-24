export type MuscleId =
  | 'chest'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'traps'
  | 'lats'
  | 'lower_back'
  | 'glutes'
  | 'quadriceps'
  | 'hamstrings'
  | 'calves';

export type MuscleStatus = 'not_trained' | 'trained' | 'high_frequency' | 'recovery_needed';

export interface MuscleRecoveryState {
  id: MuscleId;
  name: string;
  status: MuscleStatus;
  lastTrainedDaysAgo: number;
  weeklySets: number;
  recoveryPercentage: number; // 0-100%
  suggestedAction: string;
}

export const MUSCLE_STATUS_COLORS: Record<MuscleStatus, string> = {
  not_trained: '#3F3F46',      // Grey: Not trained recently
  trained: '#4ADE80',          // Green: Trained / optimal recovery
  high_frequency: '#FB923C',   // Orange: High training frequency
  recovery_needed: '#EF4444',  // Red: Recovery attention / fatigue
};
