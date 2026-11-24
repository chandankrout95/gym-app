export const palette = {
  // Primary - Electric / Lime Green
  lime50: '#f7fee7',
  lime100: '#ecfccb',
  lime200: '#d9f99d',
  lime300: '#bef264',
  lime400: '#a3e635',
  lime500: '#84cc16',
  lime600: '#65a30d',
  lime700: '#4d7c0f',
  lime800: '#3f6212',
  lime900: '#365314',

  // Deep Charcoal & Dark Graphite
  charcoal950: '#0A0A0A',
  charcoal900: '#121214',
  charcoal850: '#18181B',
  charcoal800: '#202024',
  charcoal700: '#27272A',
  charcoal600: '#3F3F46',
  charcoal500: '#52525B',
  charcoal400: '#71717A',
  charcoal300: '#A1A1AA',
  charcoal200: '#D4D4D8',
  charcoal100: '#E4E4E7',
  charcoal50: '#F4F4F5',

  // Accent Colors
  orange400: '#FB923C',
  orange500: '#F97316',
  red400: '#F87171',
  red500: '#EF4444',
  blue400: '#60A5FA',
  blue500: '#3B82F6',
  purple400: '#C084FC',
  purple500: '#A855F7',
  yellow400: '#FACC15',
  yellow500: '#EAB308',
  teal400: '#2DD4BF',
  teal500: '#14B8A6',

  // Semantic
  success: '#4ADE80',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',

  // Pure
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type PaletteKey = keyof typeof palette;
