import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../ui/Text';
import { MuscleDistribution } from '../../types';
import { spacing, borderRadius } from '../../theme';

interface MuscleSplitChartProps {
  data: MuscleDistribution[];
}

export function MuscleSplitChart({ data }: MuscleSplitChartProps) {
  const { theme } = useTheme();

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="caption" color={theme.colors.textSecondary}>
          No workout distribution data yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Horizontal Stacked Bar */}
      <View
        style={[
          styles.stackedBar,
          { backgroundColor: theme.colors.surfaceSecondary },
        ]}
      >
        {data.map((item, idx) => (
          <View
            key={`segment-${idx}`}
            style={{
              flex: item.percentage,
              backgroundColor: item.color,
              height: '100%',
              marginRight: idx < data.length - 1 ? 2 : 0,
            }}
          />
        ))}
      </View>

      {/* Legend Grid */}
      <View style={styles.legendContainer}>
        {data.map((item, idx) => (
          <View key={`legend-${idx}`} style={styles.legendRow}>
            <View style={styles.legendLeft}>
              <View style={[styles.colorDot, { backgroundColor: item.color }]} />
              <Text variant="bodyMedium">
                {item.muscleGroup}
              </Text>
            </View>
            <View style={styles.legendRight}>
              <Text variant="labelLarge">
                {item.percentage}%
              </Text>
              <Text
                variant="caption"
                color={theme.colors.textSecondary}
                style={styles.setsText}
              >
                ({item.setsCount} sets)
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  stackedBar: {
    height: 12,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: spacing[3],
  },
  legendContainer: {
    marginTop: spacing[2],
    gap: spacing[2],
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[1],
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  setsText: {
    marginLeft: 4,
  },
  emptyContainer: {
    padding: spacing[4],
    alignItems: 'center',
  },
});
