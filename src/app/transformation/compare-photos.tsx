import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import {
  Columns2,
  Calendar,
  Sparkles,
  TrendingDown,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAppSelector } from '../../store';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

export default function ComparePhotosScreen() {
  const { theme } = useTheme();
  const { photos, measurements, isPrivateMode } = useAppSelector(
    (state) => state.transformation
  );

  const [selectedAngle, setSelectedAngle] = useState<'front' | 'side' | 'back'>(
    'front'
  );

  // Filter photos matching angle
  const anglePhotos = photos.filter((p) => p.angle === selectedAngle);

  // Default Before to oldest, After to newest
  const beforePhoto = anglePhotos[anglePhotos.length - 1];
  const afterPhoto = anglePhotos[0];

  // Calculate metrics diff
  const earliestM = measurements[measurements.length - 1];
  const latestM = measurements[0];
  const weightDiff =
    latestM && earliestM && latestM.weight && earliestM.weight
      ? (latestM.weight - earliestM.weight).toFixed(1)
      : null;
  const fatDiff =
    latestM && earliestM && latestM.bodyFat && earliestM.bodyFat
      ? (latestM.bodyFat - earliestM.bodyFat).toFixed(1)
      : null;
  const waistDiff =
    latestM && earliestM && latestM.waist && earliestM.waist
      ? (latestM.waist - earliestM.waist).toFixed(1)
      : null;

  return (
    <ScreenContainer scrollable={false}>
      {/* Angle Filter Chips */}
      <View style={styles.angleRow}>
        {(['front', 'side', 'back'] as const).map((angle) => (
          <TouchableOpacity
            key={`angle-${angle}`}
            style={[
              styles.angleChip,
              {
                backgroundColor:
                  selectedAngle === angle
                    ? theme.colors.primary
                    : theme.colors.surfaceSecondary,
              },
            ]}
            onPress={() => setSelectedAngle(angle)}
          >
            <Text
              variant="caption"
              color={
                selectedAngle === angle
                  ? theme.colors.textInverse
                  : theme.colors.textSecondary
              }
              style={styles.capitalize}
            >
              {angle} View
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Transformation Delta Summary Banner */}
        <Card variant="default" style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Sparkles size={18} color={theme.colors.primary} />
            <Text variant="titleMedium" style={styles.summaryTitle}>
              Verified Transformation Delta
            </Text>
          </View>

          <View style={styles.deltaGrid}>
            {weightDiff !== null && (
              <View style={styles.deltaBox}>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Weight Loss
                </Text>
                <Text variant="titleMedium" color={theme.colors.success}>
                  {weightDiff} kg
                </Text>
              </View>
            )}

            {fatDiff !== null && (
              <View style={styles.deltaBox}>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Body Fat
                </Text>
                <Text variant="titleMedium" color={theme.colors.success}>
                  {fatDiff}%
                </Text>
              </View>
            )}

            {waistDiff !== null && (
              <View style={styles.deltaBox}>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Waist Line
                </Text>
                <Text variant="titleMedium" color={theme.colors.primary}>
                  {waistDiff} cm
                </Text>
              </View>
            )}
          </View>
        </Card>

        {/* Side by Side Photos */}
        {beforePhoto && afterPhoto ? (
          <View style={styles.comparisonContainer}>
            {/* Before Photo */}
            <View
              style={[
                styles.photoCol,
                { backgroundColor: theme.colors.surfaceSecondary },
              ]}
            >
              <View style={styles.colHeader}>
                <Badge label="BEFORE" variant="neutral" size="sm" />
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {beforePhoto.date}
                </Text>
              </View>

              <View style={styles.imgWrapper}>
                <Image
                  source={{ uri: beforePhoto.imageUri }}
                  style={styles.comparisonImg}
                  contentFit="cover"
                  blurRadius={isPrivateMode ? 28 : 0}
                />
                {isPrivateMode && (
                  <View style={styles.blurCover}>
                    <ShieldAlert size={20} color={theme.colors.primary} />
                  </View>
                )}
              </View>

              {earliestM && (
                <View style={styles.photoStats}>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    {earliestM.weight} kg • {earliestM.bodyFat}% BF
                  </Text>
                </View>
              )}
            </View>

            {/* After Photo */}
            <View
              style={[
                styles.photoCol,
                { backgroundColor: theme.colors.surfaceSecondary },
              ]}
            >
              <View style={styles.colHeader}>
                <Badge label="AFTER" variant="primary" size="sm" />
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {afterPhoto.date}
                </Text>
              </View>

              <View style={styles.imgWrapper}>
                <Image
                  source={{ uri: afterPhoto.imageUri }}
                  style={styles.comparisonImg}
                  contentFit="cover"
                  blurRadius={isPrivateMode ? 28 : 0}
                />
                {isPrivateMode && (
                  <View style={styles.blurCover}>
                    <ShieldAlert size={20} color={theme.colors.primary} />
                  </View>
                )}
              </View>

              {latestM && (
                <View style={styles.photoStats}>
                  <Text variant="caption" color={theme.colors.primary}>
                    {latestM.weight} kg • {latestM.bodyFat}% BF
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <Card variant="default" style={styles.emptyCard}>
            <Text variant="bodyMedium" align="center" color={theme.colors.textSecondary}>
              You need at least 2 photos logged from the {selectedAngle} angle to compare.
            </Text>
          </Card>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  angleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  angleChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.full,
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[4],
  },
  summaryCard: {
    padding: spacing[4],
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  summaryTitle: {
    fontWeight: '600',
  },
  deltaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  deltaBox: {
    alignItems: 'center',
  },
  comparisonContainer: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  photoCol: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  colHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[2.5],
  },
  imgWrapper: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  comparisonImg: {
    width: '100%',
    height: '100%',
  },
  blurCover: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoStats: {
    padding: spacing[2.5],
    alignItems: 'center',
  },
  emptyCard: {
    padding: spacing[6],
    alignItems: 'center',
  },
  bottomSpacer: {
    height: spacing[10],
  },
});
