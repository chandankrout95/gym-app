import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from './Text';
import { borderRadius, spacing } from '../../theme';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'primary', size = 'md', style }: BadgeProps) {
  const { theme } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: theme.colors.primaryMuted, text: theme.colors.primary };
      case 'success':
        return { bg: 'rgba(74, 222, 128, 0.15)', text: theme.colors.success };
      case 'warning':
        return { bg: 'rgba(251, 191, 36, 0.15)', text: theme.colors.warning };
      case 'error':
        return { bg: 'rgba(248, 113, 113, 0.15)', text: theme.colors.error };
      case 'info':
        return { bg: 'rgba(96, 165, 250, 0.15)', text: theme.colors.info };
      case 'neutral':
        return { bg: theme.colors.surfaceSecondary, text: theme.colors.textSecondary };
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: spacing[0.5], paddingHorizontal: spacing[2] };
      case 'md':
        return { paddingVertical: spacing[1], paddingHorizontal: spacing[3] };
      case 'lg':
        return { paddingVertical: spacing[1.5], paddingHorizontal: spacing[4] };
    }
  };

  const { bg, text } = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg, borderRadius: borderRadius.full },
        getPadding(),
        style,
      ]}
    >
      <Text
        variant={size === 'lg' ? 'labelMedium' : 'labelSmall'}
        color={text}
        style={styles.text}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start' },
  text: { fontWeight: '600' },
});
