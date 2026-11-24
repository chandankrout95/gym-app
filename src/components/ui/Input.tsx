import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from './Text';
import { borderRadius, spacing, fontSizes } from '../../theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusProgress = useSharedValue(0);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [
        error ? theme.colors.error : theme.colors.inputBorder,
        error ? theme.colors.error : theme.colors.inputBorderFocused,
      ]
    ),
  }));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusProgress.value = withTiming(1, { duration: 180 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusProgress.value = withTiming(0, { duration: 180 });
    onBlur?.(e);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text
          variant="labelMedium"
          color={error ? theme.colors.error : theme.colors.textSecondary}
          style={styles.label}
        >
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.inputBackground,
            borderRadius: borderRadius.lg,
            borderWidth: 1.5,
          },
          animatedBorderStyle,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.inputText,
              fontSize: fontSizes.base,
              flex: 1,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.inputPlaceholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </Animated.View>
      {(error || hint) && (
        <Text
          variant="caption"
          color={error ? theme.colors.error : theme.colors.textTertiary}
          style={styles.helperText}
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { marginBottom: 2 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    minHeight: 52,
  },
  input: {
    paddingVertical: spacing[3],
  },
  leftIcon: { marginRight: spacing[3] },
  rightIcon: { marginLeft: spacing[3], padding: 2 },
  helperText: { marginTop: 4 },
});
