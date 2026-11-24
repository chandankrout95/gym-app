import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Utensils,
  RefreshCw,
  ShoppingCart,
  CheckCircle2,
  Bookmark,
  ShieldCheck,
  ChevronRight,
  Flame,
  Clock,
} from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { EVIDENCE_INFORMED_DIET_PLANS, DietPlan } from '../../features/nutrition/data/dietPlans';
import { spacing, borderRadius } from '../../theme';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MealPlannerScreen() {
  const { theme } = useTheme();

  const [activePlan, setActivePlan] = useState<DietPlan>(EVIDENCE_INFORMED_DIET_PLANS[0]);
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [activeTab, setActiveTab] = useState<'schedule' | 'grocery'>('schedule');
  const [checkedGrocery, setCheckedGrocery] = useState<Record<string, boolean>>({});
  const [bookmarkedMeals, setBookmarkedMeals] = useState<Record<string, boolean>>({});

  const toggleGroceryItem = (item: string) => {
    setCheckedGrocery((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const toggleBookmark = (mealName: string) => {
    setBookmarkedMeals((prev) => {
      const next = !prev[mealName];
      Alert.alert(next ? 'Saved to Favorites' : 'Removed from Favorites', mealName);
      return { ...prev, [mealName]: next };
    });
  };

  const handleSwapMeal = (mealIndex: number) => {
    Alert.alert(
      'Replace Meal',
      'Choose an evidence-informed equivalent replacement for this macro window:',
      [
        {
          text: 'Sprouts & Paneer Salad (380 kcal, 32g P)',
          onPress: () => Alert.alert('Meal Replaced!', 'Schedule updated for ' + selectedDay),
        },
        {
          text: 'Whey & Oatmeal Bowl (410 kcal, 35g P)',
          onPress: () => Alert.alert('Meal Replaced!', 'Schedule updated for ' + selectedDay),
        },
        {
          text: 'Tandoori Chicken & Brown Rice (520 kcal, 45g P)',
          onPress: () => Alert.alert('Meal Replaced!', 'Schedule updated for ' + selectedDay),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <ScreenContainer scrollable>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: spacing[3] }}>
          <Text variant="caption" color={theme.colors.textTertiary} style={styles.eyebrow}>
            PERIODIZED NUTRITION
          </Text>
          <Text variant="headlineSmall" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
            Smart Meal Planner
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.marketLink, { backgroundColor: theme.colors.primaryMuted }]}
          onPress={() => router.push('/nutrition/diet-marketplace')}
        >
          <Text variant="labelSmall" color={theme.colors.primary} style={{ fontWeight: '700' }}>
            Diet Market
          </Text>
        </TouchableOpacity>
      </View>

      {/* Plan Selector Header Card */}
      <Card padding={4} style={[styles.planCard, { marginTop: spacing[4] }]}>
        <View style={styles.planTopRow}>
          <View style={{ flex: 1 }}>
            <Badge
              label={activePlan.category.replace('_', ' ').toUpperCase()}
              variant="primary"
              size="sm"
            />
            <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ fontWeight: '800', marginTop: 4 }}>
              {activePlan.name}
            </Text>
            <Text variant="caption" color={theme.colors.textTertiary}>
              Authored by {activePlan.authorName} ({activePlan.authorTitle})
            </Text>
          </View>
        </View>

        {/* Macro targets breakdown */}
        <View style={styles.macroPillRow}>
          <Text variant="caption" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
            {activePlan.targetCalories} kcal
          </Text>
          <Text variant="caption" color={theme.colors.textTertiary}>•</Text>
          <Text variant="caption" color={theme.colors.primary} style={{ fontWeight: '700' }}>
            {activePlan.macros.proteinG}g P
          </Text>
          <Text variant="caption" color={theme.colors.textTertiary}>•</Text>
          <Text variant="caption" color={theme.colors.orange} style={{ fontWeight: '700' }}>
            {activePlan.macros.carbsG}g C
          </Text>
          <Text variant="caption" color={theme.colors.textTertiary}>•</Text>
          <Text variant="caption" color={theme.colors.blue400} style={{ fontWeight: '700' }}>
            {activePlan.macros.fatG}g F
          </Text>
        </View>
      </Card>

      {/* Schedule / Grocery View Switcher */}
      <View style={styles.tabToggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleTab,
            activeTab === 'schedule' && {
              backgroundColor: theme.colors.primary,
            },
          ]}
          onPress={() => setActiveTab('schedule')}
        >
          <Utensils
            size={16}
            color={activeTab === 'schedule' ? theme.colors.textOnPrimary : theme.colors.textSecondary}
          />
          <Text
            variant="labelSmall"
            color={activeTab === 'schedule' ? theme.colors.textOnPrimary : theme.colors.textSecondary}
            style={{ fontWeight: '700' }}
          >
            Daily Meal Schedule
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleTab,
            activeTab === 'grocery' && {
              backgroundColor: theme.colors.primary,
            },
          ]}
          onPress={() => setActiveTab('grocery')}
        >
          <ShoppingCart
            size={16}
            color={activeTab === 'grocery' ? theme.colors.textOnPrimary : theme.colors.textSecondary}
          />
          <Text
            variant="labelSmall"
            color={activeTab === 'grocery' ? theme.colors.textOnPrimary : theme.colors.textSecondary}
            style={{ fontWeight: '700' }}
          >
            Auto Grocery List
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'schedule' ? (
        <View style={{ marginTop: spacing[4] }}>
          {/* Days of Week Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text
                    variant="labelSmall"
                    color={isSelected ? theme.colors.textOnPrimary : theme.colors.textSecondary}
                    style={{ fontWeight: '700' }}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Meals List for this day */}
          <View style={{ gap: spacing[3.5], marginTop: spacing[4] }}>
            {activePlan.dailySchedule.map((meal, index) => {
              const isSaved = !!bookmarkedMeals[meal.description];
              return (
                <Card key={meal.mealType} padding={4} style={styles.mealCard}>
                  <View style={styles.mealCardTop}>
                    <View style={styles.mealBadgeGroup}>
                      <Badge
                        label={meal.mealType.toUpperCase()}
                        variant="primary"
                        size="sm"
                      />
                      <View style={styles.timeTag}>
                        <Clock size={13} color={theme.colors.textTertiary} />
                        <Text variant="caption" color={theme.colors.textTertiary}>
                          {meal.timeSuggestion}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardActions}>
                      <TouchableOpacity onPress={() => toggleBookmark(meal.description)}>
                        <Bookmark
                          size={18}
                          color={isSaved ? theme.colors.primary : theme.colors.textTertiary}
                          fill={isSaved ? theme.colors.primary : 'transparent'}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleSwapMeal(index)}>
                        <RefreshCw size={17} color={theme.colors.textTertiary} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text variant="titleSmall" color={theme.colors.textPrimary} style={{ fontWeight: '700', marginTop: spacing[2] }}>
                    {meal.description}
                  </Text>

                  <View style={styles.mealMacroFooter}>
                    <Text variant="caption" color={theme.colors.textTertiary}>
                      Est: <Text variant="caption" color={theme.colors.primary} style={{ fontWeight: '700' }}>{meal.approxCalories} kcal</Text> •{' '}
                      <Text variant="caption" color={theme.colors.primary} style={{ fontWeight: '700' }}>{meal.proteinG}g Protein</Text>
                    </Text>

                    <TouchableOpacity
                      style={[styles.quickLogBtn, { backgroundColor: theme.colors.primaryMuted }]}
                      onPress={() => {
                        Alert.alert('Meal Logged!', `Recorded into ${meal.mealType}.`);
                      }}
                    >
                      <Text variant="labelSmall" color={theme.colors.primary} style={{ fontWeight: '700' }}>
                        + Log This Meal
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })}
          </View>
        </View>
      ) : (
        /* Grocery List View */
        <View style={{ marginTop: spacing[4] }}>
          <Card padding={4} style={styles.groceryCard}>
            <View style={styles.groceryHeader}>
              <View>
                <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
                  Smart Weekly Grocery Checklist
                </Text>
                <Text variant="caption" color={theme.colors.textTertiary}>
                  Auto-calculated for your 7-day meal plan
                </Text>
              </View>
              <Badge
                label={`${Object.values(checkedGrocery).filter(Boolean).length}/${activePlan.groceryItems.length} Bought`}
                variant="neutral"
                size="sm"
              />
            </View>

            <View style={{ gap: spacing[2.5], marginTop: spacing[4] }}>
              {activePlan.groceryItems.map((item) => {
                const isChecked = !!checkedGrocery[item];
                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.8}
                    onPress={() => toggleGroceryItem(item)}
                    style={[
                      styles.groceryItemRow,
                      isChecked && { backgroundColor: 'rgba(74, 222, 128, 0.08)' },
                    ]}
                  >
                    <View
                      style={[
                        styles.checkCircle,
                        {
                          borderColor: isChecked ? theme.colors.success : theme.colors.borderStrong,
                          backgroundColor: isChecked ? theme.colors.success : 'transparent',
                        },
                      ]}
                    >
                      {isChecked && <CheckCircle2 size={16} color={theme.colors.black} />}
                    </View>

                    <Text
                      variant="bodySmall"
                      color={isChecked ? theme.colors.textTertiary : theme.colors.textPrimary}
                      style={{
                        flex: 1,
                        textDecorationLine: isChecked ? 'line-through' : 'none',
                        fontWeight: '500',
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </View>
      )}

      {/* Evidence-informed Safety Banner */}
      <View style={[styles.disclaimerBox, { backgroundColor: theme.colors.surfaceSecondary, marginTop: spacing[6], marginBottom: spacing[8] }]}>
        <ShieldCheck size={20} color={theme.colors.primary} />
        <Text variant="caption" color={theme.colors.textSecondary} style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700' }}>Evidence-Informed Protocol:</Text> FITVERSE diet recommendations do not prescribe crash diets or unsafe caloric restrictions below BMR. Always consult licensed clinical professionals for medical conditions.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing[2],
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  marketLink: {
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
  },
  planCard: {
    borderRadius: borderRadius.xl,
  },
  planTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  macroPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[3],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  tabToggleRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[4],
  },
  toggleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing[2.5],
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  daysRow: {
    gap: spacing[2],
  },
  dayChip: {
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  mealCard: {
    borderRadius: borderRadius.xl,
  },
  mealCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2.5],
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  mealMacroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[3],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  quickLogBtn: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2.5],
    borderRadius: borderRadius.md,
  },
  groceryCard: {
    borderRadius: borderRadius.xl,
  },
  groceryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  groceryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.md,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    padding: spacing[3.5],
    borderRadius: borderRadius.xl,
  },
});
