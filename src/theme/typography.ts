import { TextStyle } from 'react-native';

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
  '4xl': 40,
  '5xl': 48,
} as const;

export const fontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
  black: '900' as const,
};

export const lineHeights = {
  tight: 1.1,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.7,
  loose: 2,
} as const;

export const letterSpacings = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;

export const typography: Record<string, TextStyle> = {
  // Display
  displayLarge: { fontSize: fontSizes['5xl'], fontWeight: fontWeights.black, lineHeight: 54 },
  displayMedium: { fontSize: fontSizes['4xl'], fontWeight: fontWeights.bold, lineHeight: 46 },
  displaySmall: { fontSize: fontSizes['3xl'], fontWeight: fontWeights.bold, lineHeight: 40 },

  // Headlines
  headlineLarge: { fontSize: fontSizes['2xl'], fontWeight: fontWeights.bold, lineHeight: 34 },
  headlineMedium: { fontSize: fontSizes.xl, fontWeight: fontWeights.semibold, lineHeight: 30 },
  headlineSmall: { fontSize: fontSizes.lg, fontWeight: fontWeights.semibold, lineHeight: 26 },

  // Titles
  titleLarge: { fontSize: fontSizes.md, fontWeight: fontWeights.semibold, lineHeight: 24 },
  titleMedium: { fontSize: fontSizes.base, fontWeight: fontWeights.medium, lineHeight: 22 },
  titleSmall: { fontSize: fontSizes.sm, fontWeight: fontWeights.medium, lineHeight: 18 },

  // Body
  bodyLarge: { fontSize: fontSizes.md, fontWeight: fontWeights.regular, lineHeight: 24 },
  bodyMedium: { fontSize: fontSizes.base, fontWeight: fontWeights.regular, lineHeight: 22 },
  bodySmall: { fontSize: fontSizes.sm, fontWeight: fontWeights.regular, lineHeight: 18 },

  // Labels
  labelLarge: { fontSize: fontSizes.base, fontWeight: fontWeights.medium, lineHeight: 20 },
  labelMedium: { fontSize: fontSizes.sm, fontWeight: fontWeights.medium, lineHeight: 16 },
  labelSmall: { fontSize: fontSizes.xs, fontWeight: fontWeights.medium, lineHeight: 14, letterSpacing: letterSpacings.wide },

  // Caption
  caption: { fontSize: fontSizes.xs, fontWeight: fontWeights.regular, lineHeight: 14 },
};
