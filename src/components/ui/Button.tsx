import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from './Text';
import { borderRadius, spacing } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  onPress?: ((event?: any) => void | Promise<any>) | undefined;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  onPress,
  style,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const getVariantStyles = (): ViewStyle => {
    const c = theme.colors;
    switch (variant) {
      case 'primary':
        return { backgroundColor: c.primary, borderColor: 'transparent' };
      case 'secondary':
        return { backgroundColor: c.surfaceSecondary, borderColor: 'transparent' };
      case 'outline':
        return { backgroundColor: 'transparent', borderColor: c.primary, borderWidth: 1.5 };
      case 'ghost':
        return { backgroundColor: 'transparent', borderColor: 'transparent' };
      case 'danger':
        return { backgroundColor: c.error, borderColor: 'transparent' };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.textOnPrimary;
      case 'danger':
        return theme.colors.white;
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.textPrimary;
    }
  };

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingVertical: spacing[2], paddingHorizontal: spacing[3], borderRadius: borderRadius.md };
      case 'md':
        return { paddingVertical: spacing[3], paddingHorizontal: spacing[5], borderRadius: borderRadius.lg };
      case 'lg':
        return { paddingVertical: spacing[3.5], paddingHorizontal: spacing[6], borderRadius: borderRadius.xl };
      case 'xl':
        return { paddingVertical: spacing[4], paddingHorizontal: spacing[8], borderRadius: borderRadius['2xl'] };
    }
  };

  const getTextVariant = () => {
    switch (size) {
      case 'sm':
        return 'labelSmall';
      case 'md':
        return 'labelMedium';
      case 'lg':
        return 'labelLarge';
      case 'xl':
        return 'titleMedium';
    }
  };

  const isDisabled = disabled || isLoading;

  return (
    <AnimatedTouchable
      style={[
        animatedStyle,
        getVariantStyles(),
        getSizeStyles(),
        styles.base,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={0.9}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text variant={getTextVariant() as any} color={getTextColor()} style={styles.label}>
            {label}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  content: { flexDirection: 'row', alignItems: 'center' },
  label: { fontWeight: '700' },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
});
