import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from './Text';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps {
  uri?: string;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  online?: boolean;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 54,
  xl: 68,
  '2xl': 88,
};

export function Avatar({ uri, name, size = 'md', style, online }: AvatarProps) {
  const { theme } = useTheme();
  const dim = sizeMap[size];
  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('')
    : 'FV';

  return (
    <View style={[{ width: dim, height: dim }, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: dim, height: dim, borderRadius: dim / 2 }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: dim,
              height: dim,
              borderRadius: dim / 2,
              backgroundColor: theme.colors.surfaceSecondary,
              borderWidth: 1.5,
              borderColor: theme.colors.primary,
            },
          ]}
        >
          <Text
            variant={
              size === 'xs' || size === 'sm'
                ? 'labelSmall'
                : size === 'md'
                ? 'labelMedium'
                : 'titleMedium'
            }
            color={theme.colors.primary}
            style={{ fontWeight: '700' }}
          >
            {initials}
          </Text>
        </View>
      )}
      {online && (
        <View
          style={[
            styles.onlineDot,
            {
              width: dim * 0.28,
              height: dim * 0.28,
              borderRadius: (dim * 0.28) / 2,
              backgroundColor: theme.colors.success,
              borderWidth: 2,
              borderColor: theme.colors.background,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0 },
});
