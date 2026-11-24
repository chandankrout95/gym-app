import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../ui/Text';

interface ProgressRingSvgProps {
  progress: number; // 0 to 1 (or 0 to 100)
  size?: number;
  strokeWidth?: number;
  color?: string;
  gradientColors?: [string, string];
  trackColor?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function ProgressRingSvg({
  progress,
  size = 180,
  strokeWidth = 14,
  color,
  gradientColors,
  trackColor,
  title,
  subtitle,
  children,
}: ProgressRingSvgProps) {
  const { theme } = useTheme();

  // Normalize progress between 0 and 1
  const normalizedProgress = Math.min(1, Math.max(0, progress > 1 ? progress / 100 : progress));

  const center = size / 2;
  const radius = center - strokeWidth / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - normalizedProgress * circumference;

  const defaultColor = color || theme.colors.primary;
  const bgTrackColor = trackColor || theme.colors.surfaceSecondary;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          {gradientColors ? (
            <LinearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={gradientColors[0]} />
              <Stop offset="100%" stopColor={gradientColors[1]} />
            </LinearGradient>
          ) : null}
        </Defs>

        {/* Background Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={bgTrackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Active Progress */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={gradientColors ? 'url(#ringGradient)' : defaultColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      {/* Center Content */}
      <View style={styles.centerContent}>
        {children ? (
          children
        ) : (
          <>
            {title && (
              <Text variant="headlineLarge" align="center">
                {title}
              </Text>
            )}
            {subtitle && (
              <Text variant="caption" color={theme.colors.textSecondary} align="center" style={styles.subtitleText}>
                {subtitle}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  subtitleText: {
    marginTop: 2,
  },
});
