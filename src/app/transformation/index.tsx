import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import {
  Scale,
  TrendingDown,
  TrendingUp,
  Target,
  Plus,
  Eye,
  EyeOff,
  SplitSquareVertical,
  Calendar,
  Ruler,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../store';
import { togglePrivateMode } from '../../features/transformation/store/transformationSlice';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { LineChartSvg } from '../../components/charts/LineChartSvg';
import { spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

export default function TransformationScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const { measurements, photos, isPrivateMode, goals } = useAppSelector(
    (state) => state.transformation
  );

  const [activeTab, setActiveTab] = useState<'weight' | 'bodyFat'>('weight');
  const [photoAngleFilter, setPhotoAngleFilter] = useState<string>('all');

  // Compute progress toward goal
  const startWeight = goals.startingWeight;
  const currentWeight = goals.currentWeight;
  const targetWeight = goals.targetWeight;
  const totalChangeNeeded = Math.abs(startWeight - targetWeight);
  const currentProgressKg = Math.abs(startWeight - currentWeight);
  const progressPercent = Math.min(
    100,
    Math.round((currentProgressKg / (totalChangeNeeded || 1)) * 100)
  );
  const netWeightChange = (currentWeight - startWeight).toFixed(1);

  // Latest measurement data
  const latest = measurements[0];
  const previous = measurements[1];

  // Chart data
  const chartData = measurements
    .slice()
    .reverse()
    .map((m) => ({
      label: m.date.slice(5), // "01-15"
      value: activeTab === 'weight' ? (m.weight ?? 0) : (m.bodyFat ?? 0),
      sublabel: activeTab === 'weight' ? `${m.weight} kg` : `${m.bodyFat}%`,
    }));

  // Filter photos
  const filteredPhotos =
    photoAngleFilter === 'all'
      ? photos
      : photos.filter((p) => p.angle === photoAngleFilter);

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.headerRow}>
        <View>
          <Text variant="headlineMedium">Transformation Studio</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Body composition & physique timeline
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: isPrivateMode
                  ? theme.colors.primaryMuted
                  : theme.colors.surfaceSecondary,
              },
            ]}
            onPress={() => dispatch(togglePrivateMode())}
          >
            {isPrivateMode ? (
              <EyeOff size={18} color={theme.colors.primary} />
            ) : (
              <Eye size={18} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>

          <Button
            label="Log"
            size="sm"
            onPress={() => router.push('/transformation/log-measurement')}
            leftIcon={<Plus size={16} color={theme.colors.textInverse} />}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Goal Hero Card */}
        <Card variant="default" style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroTitleRow}>
              <Target size={18} color={theme.colors.primary} />
              <Text variant="labelLarge" style={styles.heroTitleText}>
                Target Transformation Goal
              </Text>
            </View>
            <Badge label={`${progressPercent}% Complete`} variant="primary" />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Starting
              </Text>
              <Text variant="titleMedium">
                {startWeight} kg
              </Text>
            </View>

            <View style={styles.arrowBox}>
              {Number(netWeightChange) < 0 ? (
                <TrendingDown size={20} color={theme.colors.success} />
              ) : (
                <TrendingUp size={20} color={theme.colors.warning} />
              )}
              <Text
                variant="caption"
                color={Number(netWeightChange) < 0 ? theme.colors.success : theme.colors.warning}
              >
                {netWeightChange} kg
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Current
              </Text>
              <Text variant="titleMedium" color={theme.colors.primary}>
                {currentWeight} kg
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Goal
              </Text>
              <Text variant="titleMedium">
                {targetWeight} kg
              </Text>
            </View>
          </View>

          <ProgressBar
            progress={progressPercent / 100}
            color={theme.colors.primary}
            backgroundColor={theme.colors.surfaceSecondary}
            style={styles.progressBar}
          />
        </Card>

        {/* Trend Chart Card */}
        <Card variant="default" style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text variant="titleMedium">Composition Trend</Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Bi-weekly tracking progression
              </Text>
            </View>

            <View style={styles.tabToggle}>
              <TouchableOpacity
                style={[
                  styles.tabToggleBtn,
                  activeTab === 'weight' && {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={() => setActiveTab('weight')}
              >
                <Text
                  variant="caption"
                  color={
                    activeTab === 'weight'
                      ? theme.colors.textInverse
                      : theme.colors.textSecondary
                  }
                >
                  Weight
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabToggleBtn,
                  activeTab === 'bodyFat' && {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={() => setActiveTab('bodyFat')}
              >
                <Text
                  variant="caption"
                  color={
                    activeTab === 'bodyFat'
                      ? theme.colors.textInverse
                      : theme.colors.textSecondary
                  }
                >
                  Body Fat %
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <LineChartSvg
            data={chartData}
            height={190}
            width={width - 56}
            unit={activeTab === 'weight' ? 'kg' : '%'}
            lineColor={
              activeTab === 'weight' ? theme.colors.primary : theme.colors.blue400
            }
          />
        </Card>

        {/* Latest Body Circumference Measurements */}
        {latest && (
          <Card variant="default" style={styles.measurementsCard}>
            <View style={styles.cardTitleRow}>
              <View style={styles.flexRow}>
                <Ruler size={18} color={theme.colors.primary} />
                <Text variant="titleMedium" style={styles.ml2}>
                  Body Measurements
                </Text>
              </View>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Updated {latest.date}
              </Text>
            </View>

            <View style={styles.metricsGrid}>
              {[
                {
                  label: 'Waist',
                  val: latest.waist,
                  prev: previous?.waist,
                  unit: 'cm',
                },
                {
                  label: 'Chest',
                  val: latest.chest,
                  prev: previous?.chest,
                  unit: 'cm',
                },
                {
                  label: 'Arms (R/L)',
                  val: `${latest.rightArm}/${latest.leftArm}`,
                  prev: previous ? `${previous.rightArm}/${previous.leftArm}` : undefined,
                  unit: 'cm',
                },
                {
                  label: 'Thighs',
                  val: latest.rightThigh,
                  prev: previous?.rightThigh,
                  unit: 'cm',
                },
                {
                  label: 'Hips',
                  val: latest.hips,
                  prev: previous?.hips,
                  unit: 'cm',
                },
                {
                  label: 'Neck',
                  val: latest.neck,
                  prev: previous?.neck,
                  unit: 'cm',
                },
              ].map((item, idx) => (
                <View
                  key={`metric-${idx}`}
                  style={[
                    styles.metricCell,
                    { backgroundColor: theme.colors.surfaceSecondary },
                  ]}
                >
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    {item.label}
                  </Text>
                  <Text variant="titleMedium" style={styles.metricVal}>
                    {item.val ?? '—'}{' '}
                    <Text variant="caption" color={theme.colors.textTertiary}>
                      {item.unit}
                    </Text>
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Progress Photos Section */}
        <Card variant="default" style={styles.photosCard}>
          <View style={styles.cardTitleRow}>
            <View>
              <Text variant="titleMedium">Progress Photos</Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {photos.length} logged milestones
              </Text>
            </View>

            <Button
              label="Compare"
              size="sm"
              variant="outline"
              onPress={() => router.push('/transformation/compare-photos')}
              leftIcon={<SplitSquareVertical size={16} color={theme.colors.textPrimary} />}
            />
          </View>

          {/* Angle filters */}
          <View style={styles.filterRow}>
            {['all', 'front', 'side', 'back'].map((ang) => (
              <TouchableOpacity
                key={`filter-${ang}`}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      photoAngleFilter === ang
                        ? theme.colors.primary
                        : theme.colors.surfaceSecondary,
                  },
                ]}
                onPress={() => setPhotoAngleFilter(ang)}
              >
                <Text
                  variant="caption"
                  color={
                    photoAngleFilter === ang
                      ? theme.colors.textInverse
                      : theme.colors.textSecondary
                  }
                  style={styles.capitalize}
                >
                  {ang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Photo Grid */}
          <View style={styles.photoGrid}>
            {filteredPhotos.map((photo) => (
              <View
                key={photo.id}
                style={[
                  styles.photoCard,
                  { backgroundColor: theme.colors.surfaceSecondary },
                ]}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: photo.imageUri }}
                    style={styles.photoImg}
                    contentFit="cover"
                    blurRadius={isPrivateMode ? 28 : 0}
                  />

                  {isPrivateMode && (
                    <View style={styles.blurOverlay}>
                      <ShieldAlert size={24} color={theme.colors.primary} />
                      <Text
                        variant="caption"
                        color={theme.colors.textInverse}
                        style={styles.mt1}
                      >
                        Privacy Blur
                      </Text>
                    </View>
                  )}

                  <View style={styles.angleTag}>
                    <Badge label={photo.angle.toUpperCase()} variant="neutral" size="sm" />
                  </View>
                </View>

                <View style={styles.photoMeta}>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    {photo.date}
                  </Text>
                  {photo.notes && (
                    <Text
                      variant="caption"
                      numberOfLines={1}
                      color={theme.colors.textTertiary}
                    >
                      {photo.notes}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    gap: spacing[4],
  },
  heroCard: {
    padding: spacing[4],
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  heroTitleText: {
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  statBox: {
    alignItems: 'center',
  },
  arrowBox: {
    alignItems: 'center',
  },
  progressBar: {
    marginTop: spacing[1],
  },
  chartCard: {
    padding: spacing[4],
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  tabToggle: {
    flexDirection: 'row',
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabToggleBtn: {
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  measurementsCard: {
    padding: spacing[4],
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ml2: {
    marginLeft: spacing[2],
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  metricCell: {
    width: (width - 64) / 3,
    padding: spacing[3],
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  metricVal: {
    marginTop: spacing[1],
  },
  photosCard: {
    padding: spacing[4],
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  filterChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2.5],
  },
  photoCard: {
    width: (width - 60) / 2,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  angleTag: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
  },
  photoMeta: {
    padding: spacing[2],
  },
  mt1: {
    marginTop: spacing[1],
  },
  bottomSpacer: {
    height: spacing[12],
  },
});
