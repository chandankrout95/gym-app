import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../ui/Text';
import { spacing } from '../../theme';

export interface BarDataPoint {
  label: string;
  value: number;
  highlight?: boolean;
}

interface BarChartSvgProps {
  data: BarDataPoint[];
  height?: number;
  width?: number;
  barColor?: string;
  highlightColor?: string;
  unit?: string;
  targetValue?: number;
}

export function BarChartSvg({
  data,
  height = 160,
  width = 320,
  barColor,
  highlightColor,
  unit = '',
  targetValue,
}: BarChartSvgProps) {
  const { theme } = useTheme();

  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text variant="caption" color={theme.colors.textSecondary}>
          No records found
        </Text>
      </View>
    );
  }

  const defaultBarColor = barColor || theme.colors.surfaceSecondary;
  const activeBarColor = highlightColor || theme.colors.primary;

  const maxVal = Math.max(...data.map((d) => d.value), targetValue || 0);
  const paddingTop = 20;
  const paddingBottom = 26;
  const paddingHorizontal = 16;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingHorizontal * 2;
  const barWidth = Math.min(28, (chartWidth / data.length) * 0.65);
  const step = chartWidth / data.length;

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Baseline */}
        <Line
          x1={paddingHorizontal}
          y1={height - paddingBottom}
          x2={width - paddingHorizontal}
          y2={height - paddingBottom}
          stroke={theme.colors.border}
          strokeWidth={1}
        />

        {/* Optional Target line */}
        {targetValue !== undefined && maxVal > 0 && (
          <Line
            x1={paddingHorizontal}
            y1={paddingTop + chartHeight - (targetValue / maxVal) * chartHeight}
            x2={width - paddingHorizontal}
            y2={paddingTop + chartHeight - (targetValue / maxVal) * chartHeight}
            stroke={theme.colors.warning}
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        )}

        {/* Bars */}
        {data.map((d, index) => {
          const barHeight = maxVal > 0 ? (d.value / maxVal) * chartHeight : 0;
          const x = paddingHorizontal + index * step + (step - barWidth) / 2;
          const y = paddingTop + chartHeight - barHeight;
          const isHighlight = d.highlight ?? index === data.length - 1;

          return (
            <React.Fragment key={`bar-${index}`}>
              {/* Value on top of bar */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 4}
                fill={isHighlight ? activeBarColor : theme.colors.textSecondary}
                fontSize={9}
                fontWeight={isHighlight ? '700' : '500'}
                textAnchor="middle"
              >
                {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : `${Math.round(d.value)}`}
              </SvgText>

              {/* Bar Rect */}
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(2, barHeight)}
                rx={barWidth / 3}
                fill={isHighlight ? activeBarColor : defaultBarColor}
              />

              {/* X label */}
              <SvgText
                x={x + barWidth / 2}
                y={height - 8}
                fill={isHighlight ? theme.colors.textPrimary : theme.colors.textSecondary}
                fontSize={10}
                fontWeight={isHighlight ? '600' : '400'}
                textAnchor="middle"
              >
                {d.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing[2],
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
