import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Line,
  Text as SvgText,
} from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../ui/Text';
import { spacing } from '../../theme';

export interface DataPoint {
  label: string;
  value: number;
  sublabel?: string;
}

interface LineChartSvgProps {
  data: DataPoint[];
  height?: number;
  width?: number;
  lineColor?: string;
  fillColor?: string;
  unit?: string;
  showDots?: boolean;
  showGradient?: boolean;
}

export function LineChartSvg({
  data,
  height = 180,
  width = 320,
  lineColor,
  fillColor,
  unit = '',
  showDots = true,
  showGradient = true,
}: LineChartSvgProps) {
  const { theme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    data.length > 0 ? data.length - 1 : null
  );

  const activeColor = lineColor || theme.colors.primary;
  const gradientColor = fillColor || activeColor;

  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text variant="caption" color={theme.colors.textSecondary}>
          No data recorded yet
        </Text>
      </View>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const paddingBottom = 28;
  const paddingTop = 24;
  const paddingHorizontal = 24;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingHorizontal * 2;
  const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const points = data.map((d, index) => {
    const x =
      paddingHorizontal +
      (index / (data.length - 1 === 0 ? 1 : data.length - 1)) * chartWidth;
    const y =
      paddingTop +
      chartHeight -
      ((d.value - minVal) / range) * chartHeight;
    return { x, y, ...d };
  });

  // Build SVG path
  let pathD = '';
  if (points.length === 1) {
    pathD = `M ${points[0].x - 10} ${points[0].y} L ${points[0].x + 10} ${points[0].y}`;
  } else {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
  }

  // Area path for gradient fill
  const areaPathD =
    points.length > 1
      ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
      : '';

  const activePoint = selectedIndex !== null ? points[selectedIndex] : points[points.length - 1];

  return (
    <View style={styles.container}>
      {activePoint && (
        <View style={styles.tooltipRow}>
          <Text variant="caption" color={theme.colors.textSecondary}>
            {activePoint.label} {activePoint.sublabel ? `• ${activePoint.sublabel}` : ''}
          </Text>
          <Text variant="titleMedium" color={activeColor}>
            {activePoint.value.toFixed(1)} {unit}
          </Text>
        </View>
      )}

      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={gradientColor} stopOpacity="0.35" />
            <Stop offset="100%" stopColor={gradientColor} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Horizontal grid lines */}
        <Line
          x1={paddingHorizontal}
          y1={paddingTop}
          x2={width - paddingHorizontal}
          y2={paddingTop}
          stroke={theme.colors.border}
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <Line
          x1={paddingHorizontal}
          y1={paddingTop + chartHeight / 2}
          x2={width - paddingHorizontal}
          y2={paddingTop + chartHeight / 2}
          stroke={theme.colors.border}
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <Line
          x1={paddingHorizontal}
          y1={height - paddingBottom}
          x2={width - paddingHorizontal}
          y2={height - paddingBottom}
          stroke={theme.colors.border}
          strokeWidth={1}
        />

        {/* Gradient fill */}
        {showGradient && areaPathD ? (
          <Path d={areaPathD} fill="url(#chartGradient)" />
        ) : null}

        {/* Trend line */}
        <Path
          d={pathD}
          fill="none"
          stroke={activeColor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Active vertical guide line */}
        {activePoint && (
          <Line
            x1={activePoint.x}
            y1={paddingTop}
            x2={activePoint.x}
            y2={height - paddingBottom}
            stroke={activeColor}
            strokeDasharray="3 3"
            strokeWidth={1.5}
            opacity={0.6}
          />
        )}

        {/* Dots */}
        {showDots &&
          points.map((pt, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <Circle
                key={`dot-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 6 : 4}
                fill={isSelected ? theme.colors.background : activeColor}
                stroke={activeColor}
                strokeWidth={isSelected ? 3 : 1.5}
                onPress={() => setSelectedIndex(idx)}
              />
            );
          })}

        {/* X-axis labels */}
        {points.map((pt, idx) => {
          if (
            points.length <= 5 ||
            idx === 0 ||
            idx === Math.floor(points.length / 2) ||
            idx === points.length - 1
          ) {
            return (
              <SvgText
                key={`lbl-${idx}`}
                x={pt.x}
                y={height - 8}
                fill={theme.colors.textTertiary}
                fontSize={10}
                fontWeight="500"
                textAnchor="middle"
              >
                {pt.label}
              </SvgText>
            );
          }
          return null;
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
  tooltipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[2],
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
