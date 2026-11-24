import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import {
  Moon,
  Heart,
  Activity,
  Sparkles,
  Plus,
  Clock,
  Zap,
  ShieldCheck,
  TrendingUp,
  Bed,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAppSelector } from '../../store';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ProgressRingSvg } from '../../components/charts/ProgressRingSvg';
import { BarChartSvg } from '../../components/charts/BarChartSvg';
import { spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

export default function SleepScreen() {
  const { theme } = useTheme();
  const { records, todayRecord, targetSleepHours } = useAppSelector(
    (state) => state.sleep
  );

  const currentRecord = todayRecord || records[0];

  // 7-day sleep duration chart data (converted to hours)
  const chartData = records
    .slice(0, 7)
    .reverse()
    .map((r) => {
      const dateObj = new Date(r.date);
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][
        dateObj.getDay()
      ];
      return {
        label: dayName,
        value: parseFloat((r.durationMinutes / 60).toFixed(1)),
        highlight: r.id === currentRecord?.id,
      };
    });

  // Calculate hours & minutes for display
  const durationH = currentRecord
    ? Math.floor(currentRecord.durationMinutes / 60)
    : 7;
  const durationM = currentRecord
    ? currentRecord.durationMinutes % 60
    : 30;

  const deepH = currentRecord
    ? Math.floor(currentRecord.deepSleepMinutes / 60)
    : 1;
  const deepM = currentRecord
    ? currentRecord.deepSleepMinutes % 60
    : 45;

  const remH = currentRecord
    ? Math.floor(currentRecord.remSleepMinutes / 60)
    : 1;
  const remM = currentRecord
    ? currentRecord.remSleepMinutes % 60
    : 30;

  const lightH = currentRecord
    ? Math.floor(currentRecord.lightSleepMinutes / 60)
    : 3;
  const lightM = currentRecord
    ? currentRecord.lightSleepMinutes % 60
    : 30;

  const readinessScore = currentRecord?.readinessScore ?? 88;
  const qualityScore = currentRecord?.qualityScore ?? 85;

  const getReadinessStatus = (score: number) => {
    if (score >= 90) return { label: 'Optimal Output', color: theme.colors.primary, advice: 'Central nervous system is fully recharged. Push heavy compound sets and personal records today!' };
    if (score >= 75) return { label: 'Good Readiness', color: theme.colors.blue400, advice: 'Balanced recovery. Ideal for standard hypertrophy and moderate-intensity conditioning.' };
    return { label: 'Active Recovery', color: theme.colors.warning, advice: 'Elevated fatigue detected. Prioritize mobility, light cardio, and restorative sleep hygiene.' };
  };

  const status = getReadinessStatus(readinessScore);

  return (
    <ScreenContainer scrollable={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text variant="headlineMedium">Sleep & Recovery</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Autonomic restoration & CNS readiness
          </Text>
        </View>

        <Button
          label="Log Sleep"
          size="sm"
          onPress={() => router.push('/sleep/log-sleep')}
          leftIcon={<Plus size={16} color={theme.colors.textInverse} />}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Readiness Gauge Hero Card */}
        <Card variant="default" style={styles.readinessHero}>
          <View style={styles.heroHeader}>
            <View style={styles.flexRow}>
              <Zap size={18} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.ml2}>
                Daily Readiness Index
              </Text>
            </View>
            <Badge label={status.label} variant="primary" />
          </View>

          <View style={styles.gaugeContainer}>
            <ProgressRingSvg
              progress={readinessScore}
              size={190}
              strokeWidth={14}
              color={status.color}
              trackColor={theme.colors.surfaceSecondary}
            >
              <View style={styles.gaugeCenter}>
                <Text variant="displaySmall" style={styles.gaugeScore}>
                  {readinessScore}%
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Recovery Score
                </Text>
              </View>
            </ProgressRingSvg>
          </View>

          <View
            style={[
              styles.adviceCard,
              { backgroundColor: theme.colors.surfaceSecondary },
            ]}
          >
            <Sparkles size={16} color={theme.colors.primary} />
            <Text
              variant="caption"
              color={theme.colors.textSecondary}
              style={styles.adviceText}
            >
              {status.advice}
            </Text>
          </View>

          {/* Sub-metrics */}
          <View style={styles.subMetricsRow}>
            <View style={styles.subMetric}>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Sleep Quality
              </Text>
              <Text variant="titleMedium" color={theme.colors.primary}>
                {qualityScore}%
              </Text>
            </View>

            <View style={styles.subMetric}>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Resting HR
              </Text>
              <Text variant="titleMedium">
                {currentRecord?.restingHeartRate ?? 54} bpm
              </Text>
            </View>

            <View style={styles.subMetric}>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Target Met
              </Text>
              <Text variant="titleMedium" color={theme.colors.success}>
                {Math.round((durationH / targetSleepHours) * 100)}%
              </Text>
            </View>
          </View>
        </Card>

        {/* Last Night's Sleep Architecture */}
        <Card variant="default" style={styles.sleepArchCard}>
          <View style={styles.cardTitleRow}>
            <View style={styles.flexRow}>
              <Moon size={18} color={theme.colors.blue400} />
              <Text variant="titleMedium" style={styles.ml2}>
                Sleep Architecture
              </Text>
            </View>
            <Text variant="titleMedium" color={theme.colors.primary}>
              {durationH}h {durationM}m
            </Text>
          </View>

          <View style={styles.timeScheduleRow}>
            <View style={styles.scheduleItem}>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Bedtime
              </Text>
              <Text variant="bodyMedium">
                {currentRecord?.bedtime ?? '23:15'}
              </Text>
            </View>
            <View style={styles.scheduleDivider} />
            <View style={styles.scheduleItem}>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Wake Time
              </Text>
              <Text variant="bodyMedium">
                {currentRecord?.wakeTime ?? '07:05'}
              </Text>
            </View>
          </View>

          {/* Segmented Stages Bar */}
          <View style={styles.stagesBar}>
            <View
              style={[
                styles.stageSegment,
                {
                  flex: currentRecord?.deepSleepMinutes ?? 115,
                  backgroundColor: '#818CF8',
                },
              ]}
            />
            <View
              style={[
                styles.stageSegment,
                {
                  flex: currentRecord?.remSleepMinutes ?? 110,
                  backgroundColor: '#38BDF8',
                },
              ]}
            />
            <View
              style={[
                styles.stageSegment,
                {
                  flex: currentRecord?.lightSleepMinutes ?? 215,
                  backgroundColor: theme.colors.surfaceSecondary,
                },
              ]}
            />
            <View
              style={[
                styles.stageSegment,
                {
                  flex: currentRecord?.awakeMinutes ?? 30,
                  backgroundColor: '#F87171',
                },
              ]}
            />
          </View>

          {/* Stages Breakdown Grid */}
          <View style={styles.stagesGrid}>
            <View style={styles.stageCell}>
              <View style={[styles.stageDot, { backgroundColor: '#818CF8' }]} />
              <View>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Deep (Physical)
                </Text>
                <Text variant="labelLarge">
                  {deepH}h {deepM}m
                </Text>
              </View>
            </View>

            <View style={styles.stageCell}>
              <View style={[styles.stageDot, { backgroundColor: '#38BDF8' }]} />
              <View>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  REM (Mental)
                </Text>
                <Text variant="labelLarge">
                  {remH}h {remM}m
                </Text>
              </View>
            </View>

            <View style={styles.stageCell}>
              <View
                style={[
                  styles.stageDot,
                  { backgroundColor: theme.colors.border },
                ]}
              />
              <View>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Light Sleep
                </Text>
                <Text variant="labelLarge">
                  {lightH}h {lightM}m
                </Text>
              </View>
            </View>

            <View style={styles.stageCell}>
              <View style={[styles.stageDot, { backgroundColor: '#F87171' }]} />
              <View>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Awake Time
                </Text>
                <Text variant="labelLarge">
                  {currentRecord?.awakeMinutes ?? 30}m
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* 7-Day Sleep Duration Trend */}
        <Card variant="default" style={styles.chartCard}>
          <View style={styles.cardTitleRow}>
            <View>
              <Text variant="titleMedium">7-Day Duration Trend</Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Target: {targetSleepHours}.0 hrs per night
              </Text>
            </View>
            <Badge label="8.0h Goal" variant="neutral" />
          </View>

          <BarChartSvg
            data={chartData}
            height={160}
            width={width - 56}
            unit="h"
            targetValue={targetSleepHours}
            highlightColor={theme.colors.primary}
          />
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
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    gap: spacing[4],
  },
  readinessHero: {
    padding: spacing[4],
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ml2: {
    marginLeft: spacing[2],
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: spacing[3],
  },
  gaugeCenter: {
    alignItems: 'center',
  },
  gaugeScore: {
    fontWeight: '800',
  },
  adviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderRadius: borderRadius.md,
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  adviceText: {
    flex: 1,
    lineHeight: 18,
  },
  subMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: spacing[3],
  },
  subMetric: {
    alignItems: 'center',
  },
  sleepArchCard: {
    padding: spacing[4],
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  timeScheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing[3],
  },
  scheduleItem: {
    alignItems: 'center',
  },
  scheduleDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  stagesBar: {
    height: 12,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: spacing[3.5],
  },
  stageSegment: {
    height: '100%',
    marginRight: 2,
  },
  stagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  stageCell: {
    width: (width - 76) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  stageDot: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
  },
  chartCard: {
    padding: spacing[4],
  },
  bottomSpacer: {
    height: spacing[12],
  },
});
