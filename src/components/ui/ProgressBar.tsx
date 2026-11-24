import React, { useEffect } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { borderRadius } from '../../theme';

export interface ProgressBarProps {
  progress: number; // 0–1
  height?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  height = 8,
  color,
  backgroundColor,
  animated = true,
  style,
}: ProgressBarProps) {
  const { theme } = useTheme();
  const width = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.min(Math.max(progress, 0), 1);
    if (animated) {
      width.value = withTiming(clamped * 100, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      width.value = clamped * 100;
    }
  }, [progress, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: backgroundColor ?? theme.colors.surfaceSecondary,
          borderRadius: borderRadius.full,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          animatedStyle,
          {
            height,
            backgroundColor: color ?? theme.colors.primary,
            borderRadius: borderRadius.full,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { overflow: 'hidden', width: '100%' },
  fill: { height: '100%' },
});
