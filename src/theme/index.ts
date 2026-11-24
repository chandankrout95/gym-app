import { TextStyle } from 'react-native';
import { palette } from './colors';
import { typography, fontSizes, fontWeights } from './typography';
import { spacing, borderRadius, borderWidth } from './spacing';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceSecondary: string;
  surfaceTertiary: string;

  // Brand
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryMuted: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  textInverse: string;
  textOnPrimary: string;

  // Borders
  border: string;
  borderLight: string;
  borderStrong: string;

  // Status
  success: string;
  warning: string;
  error: string;
  info: string;

  // Accents
  orange: string;
  orange400: string;
  red: string;
  red400: string;
  blue: string;
  blue400: string;
  purple: string;
  purple400: string;
  yellow: string;
  yellow400: string;
  teal: string;
  teal400: string;

  // Navigation Tabs
  tabActive: string;
  tabInactive: string;
  tabBackground: string;

  // Cards
  cardBackground: string;
  cardBorder: string;

  // Input
  inputBackground: string;
  inputBorder: string;
  inputBorderFocused: string;
  inputText: string;
  inputPlaceholder: string;

  // Overlay
  overlay: string;
  overlayLight: string;

  // Misc
  skeleton: string;
  divider: string;
  white: string;
  black: string;
  transparent: string;
}

export interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  typography: Record<string, TextStyle>;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  borderWidth: typeof borderWidth;
}

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: palette.charcoal950,
    backgroundSecondary: palette.charcoal900,
    surface: palette.charcoal850,
    surfaceSecondary: palette.charcoal800,
    surfaceTertiary: palette.charcoal700,

    primary: palette.lime400,
    primaryLight: palette.lime300,
    primaryDark: palette.lime500,
    primaryMuted: 'rgba(163, 230, 53, 0.12)',

    textPrimary: palette.white,
    textSecondary: palette.charcoal200,
    textTertiary: palette.charcoal400,
    textDisabled: palette.charcoal600,
    textInverse: palette.charcoal950,
    textOnPrimary: palette.charcoal950,

    border: palette.charcoal700,
    borderLight: palette.charcoal800,
    borderStrong: palette.charcoal600,

    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,

    orange: palette.orange400,
    orange400: palette.orange400,
    red: palette.red400,
    red400: palette.red400,
    blue: palette.blue400,
    blue400: palette.blue400,
    purple: palette.purple400,
    purple400: palette.purple400,
    yellow: palette.yellow400,
    yellow400: palette.yellow400,
    teal: palette.teal400,
    teal400: palette.teal400,

    tabActive: palette.lime400,
    tabInactive: palette.charcoal400,
    tabBackground: palette.charcoal900,

    cardBackground: palette.charcoal850,
    cardBorder: palette.charcoal700,

    inputBackground: palette.charcoal800,
    inputBorder: palette.charcoal700,
    inputBorderFocused: palette.lime400,
    inputText: palette.white,
    inputPlaceholder: palette.charcoal400,

    overlay: 'rgba(0,0,0,0.7)',
    overlayLight: 'rgba(0,0,0,0.3)',

    skeleton: palette.charcoal800,
    divider: palette.charcoal700,
    white: palette.white,
    black: palette.black,
    transparent: palette.transparent,
  },
  typography,
  spacing,
  borderRadius,
  borderWidth,
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#FAFAFA',
    backgroundSecondary: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceSecondary: '#F4F4F5',
    surfaceTertiary: '#E4E4E7',

    primary: palette.lime500,
    primaryLight: palette.lime400,
    primaryDark: palette.lime600,
    primaryMuted: 'rgba(132, 204, 22, 0.12)',

    textPrimary: '#09090B',
    textSecondary: '#27272A',
    textTertiary: '#71717A',
    textDisabled: '#A1A1AA',
    textInverse: palette.white,
    textOnPrimary: palette.charcoal950,

    border: '#E4E4E7',
    borderLight: '#F4F4F5',
    borderStrong: '#D4D4D8',

    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,

    orange: palette.orange500,
    orange400: palette.orange400,
    red: palette.red500,
    red400: palette.red400,
    blue: palette.blue500,
    blue400: palette.blue400,
    purple: palette.purple500,
    purple400: palette.purple400,
    yellow: palette.yellow500,
    yellow400: palette.yellow400,
    teal: palette.teal500,
    teal400: palette.teal400,

    tabActive: palette.lime600,
    tabInactive: '#71717A',
    tabBackground: '#FFFFFF',

    cardBackground: '#FFFFFF',
    cardBorder: '#E4E4E7',

    inputBackground: '#F4F4F5',
    inputBorder: '#E4E4E7',
    inputBorderFocused: palette.lime500,
    inputText: '#09090B',
    inputPlaceholder: '#A1A1AA',

    overlay: 'rgba(0,0,0,0.5)',
    overlayLight: 'rgba(0,0,0,0.2)',

    skeleton: '#E4E4E7',
    divider: '#F4F4F5',
    white: palette.white,
    black: palette.black,
    transparent: palette.transparent,
  },
  typography,
  spacing,
  borderRadius,
  borderWidth,
};

export { palette, typography, fontSizes, fontWeights, spacing, borderRadius, borderWidth };
