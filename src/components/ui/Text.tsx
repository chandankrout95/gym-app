import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { typography } from '../../theme';

type TypographyVariant = keyof typeof typography;

export interface FVTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  opacity?: number;
}

export function Text({
  variant = 'bodyMedium',
  color,
  align = 'left',
  opacity,
  style,
  children,
  ...props
}: FVTextProps) {
  const { theme } = useTheme();
  const variantStyle = typography[variant] || typography.bodyMedium;

  return (
    <RNText
      style={[
        variantStyle,
        { color: color ?? theme.colors.textPrimary, textAlign: align, opacity },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}
