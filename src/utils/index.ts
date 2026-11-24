import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

// ============================================================
// Date Utilities
// ============================================================

export const formatDate = (date: string | Date, pattern = 'MMM dd, yyyy'): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, pattern);
  } catch {
    return String(date);
  }
};

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (isToday(d)) return 'Today';
    if (isYesterday(d)) return 'Yesterday';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return 'Recently';
  }
};

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

// ============================================================
// Fitness Calculations
// ============================================================

export const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  if (heightM <= 0) return 0;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateTDEE = (
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  activityMultiplier: number
): number => {
  // Mifflin-St Jeor Equation
  const bmr =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  return Math.round(bmr * activityMultiplier);
};

export const calculateMacros = (
  calories: number,
  goal: string
): { protein: number; carbs: number; fat: number } => {
  switch (goal) {
    case 'muscle_building':
      return {
        protein: Math.round((calories * 0.3) / 4),
        carbs: Math.round((calories * 0.45) / 4),
        fat: Math.round((calories * 0.25) / 9),
      };
    case 'weight_loss':
      return {
        protein: Math.round((calories * 0.35) / 4),
        carbs: Math.round((calories * 0.35) / 4),
        fat: Math.round((calories * 0.3) / 9),
      };
    default:
      return {
        protein: Math.round((calories * 0.3) / 4),
        carbs: Math.round((calories * 0.4) / 4),
        fat: Math.round((calories * 0.3) / 9),
      };
  }
};

export const kgToLbs = (kg: number): number => Math.round(kg * 2.20462 * 10) / 10;
export const lbsToKg = (lbs: number): number => Math.round(lbs * 0.453592 * 10) / 10;
export const cmToFt = (cm: number): string => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
};

// ============================================================
// Formatting & Number Utilities
// ============================================================

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const truncate = (str: string, maxLength: number): string =>
  str.length <= maxLength ? str : `${str.slice(0, maxLength - 3)}...`;

export const formatNumber = (num: number, decimals = 0): string =>
  num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const hexToRgba = (hex: string, alpha: number): string => {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return hex;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
