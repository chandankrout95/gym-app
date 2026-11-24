import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SleepRecord } from '../../../types';

interface SleepState {
  records: SleepRecord[];
  targetSleepHours: number;
  todayRecord: SleepRecord | null;
  isLoading: boolean;
  error: string | null;
}

const mockSleepRecords: SleepRecord[] = [
  {
    id: 'sl_1',
    date: '2026-03-01',
    bedtime: '23:15',
    wakeTime: '07:05',
    durationMinutes: 470, // 7h 50m
    deepSleepMinutes: 115, // 1h 55m
    remSleepMinutes: 110, // 1h 50m
    lightSleepMinutes: 215, // 3h 35m
    awakeMinutes: 30,
    qualityScore: 89,
    readinessScore: 92,
    restingHeartRate: 54,
    notes: 'Fell asleep immediately after chamomile tea & cold shower.',
  },
  {
    id: 'sl_2',
    date: '2026-02-28',
    bedtime: '23:45',
    wakeTime: '06:45',
    durationMinutes: 420, // 7h
    deepSleepMinutes: 85,
    remSleepMinutes: 95,
    lightSleepMinutes: 200,
    awakeMinutes: 40,
    qualityScore: 78,
    readinessScore: 81,
    restingHeartRate: 56,
    notes: 'Slightly sore from leg day squats.',
  },
  {
    id: 'sl_3',
    date: '2026-02-27',
    bedtime: '23:00',
    wakeTime: '07:30',
    durationMinutes: 510, // 8h 30m
    deepSleepMinutes: 130,
    remSleepMinutes: 125,
    lightSleepMinutes: 220,
    awakeMinutes: 35,
    qualityScore: 94,
    readinessScore: 96,
    restingHeartRate: 52,
    notes: 'Deep uninterrupted sleep, 100% recovered.',
  },
  {
    id: 'sl_4',
    date: '2026-02-26',
    bedtime: '00:15',
    wakeTime: '06:30',
    durationMinutes: 375, // 6h 15m
    deepSleepMinutes: 70,
    remSleepMinutes: 80,
    lightSleepMinutes: 185,
    awakeMinutes: 40,
    qualityScore: 68,
    readinessScore: 70,
    restingHeartRate: 58,
    notes: 'Late working on code, lower recovery.',
  },
  {
    id: 'sl_5',
    date: '2026-02-25',
    bedtime: '23:10',
    wakeTime: '07:10',
    durationMinutes: 480, // 8h
    deepSleepMinutes: 110,
    remSleepMinutes: 115,
    lightSleepMinutes: 225,
    awakeMinutes: 30,
    qualityScore: 87,
    readinessScore: 88,
    restingHeartRate: 53,
    notes: 'Great sleep sanctuary temperature (19C).',
  },
  {
    id: 'sl_6',
    date: '2026-02-24',
    bedtime: '23:30',
    wakeTime: '07:00',
    durationMinutes: 450, // 7h 30m
    deepSleepMinutes: 100,
    remSleepMinutes: 105,
    lightSleepMinutes: 215,
    awakeMinutes: 30,
    qualityScore: 84,
    readinessScore: 86,
    restingHeartRate: 55,
    notes: 'Magnesium glycinate taken 45m before bed.',
  },
  {
    id: 'sl_7',
    date: '2026-02-23',
    bedtime: '23:20',
    wakeTime: '07:15',
    durationMinutes: 475, // 7h 55m
    deepSleepMinutes: 115,
    remSleepMinutes: 110,
    lightSleepMinutes: 220,
    awakeMinutes: 30,
    qualityScore: 90,
    readinessScore: 91,
    restingHeartRate: 53,
    notes: 'Rest day recovery protocol.',
  },
];

const initialState: SleepState = {
  records: mockSleepRecords,
  targetSleepHours: 8,
  todayRecord: mockSleepRecords[0],
  isLoading: false,
  error: null,
};

export const sleepSlice = createSlice({
  name: 'sleep',
  initialState,
  reducers: {
    logSleepRecord: (state, action: PayloadAction<SleepRecord>) => {
      state.records.unshift(action.payload);
      state.todayRecord = action.payload;
    },
    setTargetSleepHours: (state, action: PayloadAction<number>) => {
      state.targetSleepHours = action.payload;
    },
  },
});

export const { logSleepRecord, setTargetSleepHours } = sleepSlice.actions;
export default sleepSlice.reducer;
