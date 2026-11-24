import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from './Text';
import { spacing } from '../../theme';

export interface DividerProps {
  label?: string;
  style?: ViewStyle;
  color?: string;
}

export function Divider({ label, style, color }: DividerProps) {
  const { theme } = useTheme();
  const lineColor = color ?? theme.colors.divider;

  if (label) {
    return (
      <View style={[styles.labelContainer, style]}>
        <View style={[styles.line, { backgroundColor: lineColor }]} />
        <Text variant="labelSmall" color={theme.colors.textTertiary} style={styles.labelText}>
          {label}
        </Text>
        <View style={[styles.line, { backgroundColor: lineColor }]} />
      </View>
    );
  }

  return <View style={[styles.divider, { backgroundColor: lineColor }, style]} />;
}

const styles = StyleSheet.create({
  divider: { height: 1, width: '100%' },
  labelContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  line: { flex: 1, height: 1 },
  labelText: { paddingHorizontal: spacing[2] },
});
