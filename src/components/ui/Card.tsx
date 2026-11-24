import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { borderRadius, spacing } from '../../theme';

export interface CardProps extends ViewProps {
  padding?: keyof typeof spacing;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
}

export function Card({
  padding = 4,
  variant = 'default',
  style,
  children,
  ...props
}: CardProps) {
  const { theme } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 4,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'flat':
        return {
          backgroundColor: theme.colors.surfaceSecondary,
        };
      default:
        return {
          backgroundColor: theme.colors.cardBackground,
          borderWidth: 1,
          borderColor: theme.colors.cardBorder,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        { padding: spacing[padding] },
        getVariantStyle(),
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
});
