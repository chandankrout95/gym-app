import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  TrendingUp,
  Dumbbell,
  Layers,
  PieChart,
  UtensilsCrossed,
  Award,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAppSelector } from '../../store';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { LineChartSvg } from '../../components/charts/LineChartSvg';
import { BarChartSvg } from '../../components/charts/BarChartSvg';
import { MuscleSplitChart } from '../../components/charts/MuscleSplitChart';
import { spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

type AnalyticsTab = 'strength' | 'volume' | 'muscles' | 'nutrition';

export default function AnalyticsScreen() {
  const { theme } = useTheme();
  const {
    strengthRecords,
    volumeHistory,
    muscleDistributions,
    nutritionAdherence,
  } = useAppSelector((state) => state.analytics);

  const [activeTab, setActiveTab] = useState<AnalyticsTab>('strength');
  const [selectedLift, setSelectedLift] = useState<
    'bench_press' | 'squat' | 'deadlift' | 'overhead_press'
  >('bench_press');

  // Filter 1RM records for selected lift
  const filteredStrength = strengthRecords.filter(
    (r) => r.category === selectedLift
  );
  const currentPR = Math.max(...filteredStrength.map((r) => r.estimated1RM), 0);
  const earliest1RM = filteredStrength[0]?.estimated1RM || currentPR;
  const strengthGain = (currentPR - earliest1RM).toFixed(1);

  // Line chart data for 1RM
  const strengthChartData = filteredStrength.map((r) => ({
    label: r.date.slice(5),
    value: parseFloat(r.estimated1RM.toFixed(1)),
    sublabel: `${r.weight}kg x ${r.reps} reps`,
  }));

  // Volume chart data
  const volumeChartData = volumeHistory.map((v) => ({
    label: v.weekLabel,
    value: v.totalVolumeKg,
  }));

  // Nutrition chart data
  const nutritionChartData = nutritionAdherence.weeklyTrend.map((t) => ({
    label: t.day,
    value: t.calories,
  }));

  const liftNames: Record<string, string> = {
    bench_press: 'Barbell Bench Press',
    squat: 'Barbell Back Squat',
    deadlift: 'Conventional Deadlift',
    overhead_press: 'Overhead Press',
  };

  return (
    <ScreenContainer scrollable={false}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text variant="headlineMedium">Performance Analytics</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Long-term physiological & overload trends
          </Text>
        </View>
        <Badge label="VERIFIED" variant="primary" />
      </View>

      {/* Tabs Bar */}
      <View style={styles.tabBar}>
        {[
          { id: 'strength', label: '1RM Strength', icon: Dumbbell },
          { id: 'volume', label: 'Tonnage', icon: Layers },
          { id: 'muscles', label: 'Muscle Split', icon: PieChart },
          { id: 'nutrition', label: 'Adherence', icon: UtensilsCrossed },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <TouchableOpacity
              key={`tab-${tab.id}`}
              style={[
                styles.tabBtn,
                {
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.surfaceSecondary,
                },
              ]}
              onPress={() => setActiveTab(tab.id as AnalyticsTab)}
            >
              <Icon
                size={16}
                color={
                  isSelected
                    ? theme.colors.textInverse
                    : theme.colors.textSecondary
                }
              />
              <Text
                variant="caption"
                color={
                  isSelected
                    ? theme.colors.textInverse
                    : theme.colors.textSecondary
                }
                style={styles.tabBtnText}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= STRENGTH TAB ================= */}
        {activeTab === 'strength' && (
          <View style={styles.tabContent}>
            {/* Exercise Selector Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.liftSelectorRow}
            >
              {[
                { id: 'bench_press', label: 'Bench Press' },
                { id: 'squat', label: 'Back Squat' },
                { id: 'deadlift', label: 'Deadlift' },
                { id: 'overhead_press', label: 'OHP Press' },
              ].map((lift) => {
                const isSelected = selectedLift === lift.id;
                return (
                  <TouchableOpacity
                    key={`lift-${lift.id}`}
                    style={[
                      styles.liftChip,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.surfaceSecondary,
                      },
                    ]}
                    onPress={() => setSelectedLift(lift.id as any)}
                  >
                    <Text
                      variant="caption"
                      color={
                        isSelected
                          ? theme.colors.textInverse
                          : theme.colors.textSecondary
                      }
                      style={styles.liftChipText}
                    >
                      {lift.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* PR Hero Card */}
            <Card variant="default" style={styles.prHeroCard}>
              <View style={styles.prHeader}>
                <View>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    {liftNames[selectedLift]}
                  </Text>
                  <Text variant="headlineLarge" color={theme.colors.primary}>
                    {currentPR.toFixed(1)} kg
                  </Text>
                </View>

                <View style={styles.gainBadge}>
                  <ArrowUpRight size={16} color={theme.colors.success} />
                  <Text variant="labelLarge" color={theme.colors.success}>
                    +{strengthGain} kg
                  </Text>
                </View>
              </View>

              <Text variant="caption" color={theme.colors.textTertiary}>
                Calculated using Epley 1RM formula [Weight × (1 + Reps/30)]
              </Text>
            </Card>

            {/* 1RM Trend Line Chart */}
            <Card variant="default" style={styles.chartCard}>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium">1RM Progression Timeline</Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Over 8 weeks of training
                </Text>
              </View>

              <LineChartSvg
                data={strengthChartData}
                height={200}
                width={width - 56}
                unit="kg"
                lineColor={theme.colors.primary}
              />
            </Card>
          </View>
        )}

        {/* ================= VOLUME TAB ================= */}
        {activeTab === 'volume' && (
          <View style={styles.tabContent}>
            {/* Weekly Tonnage Hero */}
            <Card variant="default" style={styles.volumeHero}>
              <View style={styles.volumeHeader}>
                <View>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    Current Weekly Volume
                  </Text>
                  <Text variant="headlineLarge" color={theme.colors.primary}>
                    {(volumeHistory[volumeHistory.length - 1].totalVolumeKg / 1000).toFixed(1)} Tons
                  </Text>
                </View>

                <Badge label="+42.7% Q1 Overload" variant="success" />
              </View>

              <Text variant="caption" color={theme.colors.textSecondary} style={styles.mt2}>
                Progressive volume overload protects against plateau and stimulates myofibrillar hypertrophy.
              </Text>
            </Card>

            {/* Volume Bar Chart */}
            <Card variant="default" style={styles.chartCard}>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium">Weekly Volume Progression</Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Total kilograms moved across all exercises
                </Text>
              </View>

              <BarChartSvg
                data={volumeChartData}
                height={180}
                width={width - 56}
                unit="kg"
                highlightColor={theme.colors.primary}
              />
            </Card>
          </View>
        )}

        {/* ================= MUSCLE SPLIT TAB ================= */}
        {activeTab === 'muscles' && (
          <View style={styles.tabContent}>
            <Card variant="default" style={styles.splitCard}>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium">Muscle Volume Distribution</Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Set allocation across body quadrants
                </Text>
              </View>

              <MuscleSplitChart data={muscleDistributions} />
            </Card>

            <Card
              variant="default"
              style={[
                styles.balanceFeedbackCard,
                { backgroundColor: theme.colors.surfaceSecondary },
              ]}
            >
              <ShieldCheck size={20} color={theme.colors.primary} />
              <View style={styles.feedbackMeta}>
                <Text variant="labelLarge" color={theme.colors.primary}>
                  Balanced Kinetic Chain
                </Text>
                <Text
                  variant="caption"
                  color={theme.colors.textSecondary}
                  style={styles.mt1}
                >
                  Posterior chain (24% back + 28% legs) safely counterbalances anterior pressing volume (22% chest). Lower risk of shoulder impingement.
                </Text>
              </View>
            </Card>
          </View>
        )}

        {/* ================= NUTRITION ADHERENCE TAB ================= */}
        {activeTab === 'nutrition' && (
          <View style={styles.tabContent}>
            <Card variant="default" style={styles.adherenceHero}>
              <View style={styles.adherenceHeader}>
                <View>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    Calorie & Macro Consistency
                  </Text>
                  <Text variant="headlineLarge" color={theme.colors.primary}>
                    {nutritionAdherence.targetHitPercent}%
                  </Text>
                </View>

                <Badge label="ELITE DISCIPLINE" variant="primary" />
              </View>

              <View style={styles.macroAvgRow}>
                <View style={styles.macroAvgCell}>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    Avg Daily Calories
                  </Text>
                  <Text variant="titleMedium">
                    {nutritionAdherence.averageCalories} kcal
                  </Text>
                </View>

                <View style={styles.macroAvgCell}>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    Avg Daily Protein
                  </Text>
                  <Text variant="titleMedium" color={theme.colors.primary}>
                    {nutritionAdherence.averageProtein}g
                  </Text>
                </View>
              </View>
            </Card>

            {/* Daily Calorie Intake vs Target Line */}
            <Card variant="default" style={styles.chartCard}>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium">Weekly Calorie Adherence</Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Dashed line indicates 2,400 kcal target
                </Text>
              </View>

              <BarChartSvg
                data={nutritionChartData}
                height={170}
                width={width - 56}
                unit="kcal"
                targetValue={2400}
                highlightColor={theme.colors.primary}
              />
            </Card>
          </View>
        )}

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
  tabBar: {
    flexDirection: 'row',
    gap: spacing[1.5],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[1],
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    gap: spacing[4],
  },
  tabContent: {
    gap: spacing[4],
  },
  liftSelectorRow: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingBottom: spacing[1],
  },
  liftChip: {
    paddingHorizontal: spacing[3.5],
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.full,
  },
  liftChipText: {
    fontWeight: '600',
  },
  prHeroCard: {
    padding: spacing[4],
  },
  prHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  gainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  chartCard: {
    padding: spacing[4],
  },
  cardHeader: {
    marginBottom: spacing[2],
  },
  volumeHero: {
    padding: spacing[4],
  },
  volumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mt2: {
    marginTop: spacing[2],
  },
  splitCard: {
    padding: spacing[4],
  },
  balanceFeedbackCard: {
    flexDirection: 'row',
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    gap: spacing[3],
    alignItems: 'flex-start',
  },
  feedbackMeta: {
    flex: 1,
  },
  mt1: {
    marginTop: spacing[1],
  },
  adherenceHero: {
    padding: spacing[4],
  },
  adherenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  macroAvgRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: spacing[3],
  },
  macroAvgCell: {
    flex: 1,
  },
  bottomSpacer: {
    height: spacing[12],
  },
});
