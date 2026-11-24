import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import {
  UtensilsCrossed,
  Plus,
  Droplets,
  Sparkles,
  ChevronRight,
  Search,
  X,
  CheckCircle2,
  Flame,
  Sun,
  Sunset,
  Coffee,
  Apple,
  Filter,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../store';
import { logWater, addMealEntry } from '../../features/nutrition/store/nutritionSlice';
import { VERIFIED_FOOD_DATABASE } from '../../features/nutrition/data/foodDatabase';
import { FoodItem, MealType } from '../../types';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');
const SNAP_CARD_WIDTH = width * 0.82;
const SNAP_INTERVAL = SNAP_CARD_WIDTH + spacing[3];

export default function NutritionTab() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const nutrition = useAppSelector((state) => state.nutrition);
  const targets = nutrition.targets;
  const meals = nutrition.today?.meals ?? [];

  // Caloric calculations
  const totalCalories = meals.reduce(
    (acc, m) => acc + m.foodItem.calories * m.quantity,
    0
  );
  const totalProtein = meals.reduce(
    (acc, m) => acc + m.foodItem.protein * m.quantity,
    0
  );
  const totalCarbs = meals.reduce(
    (acc, m) => acc + m.foodItem.carbs * m.quantity,
    0
  );
  const totalFat = meals.reduce(
    (acc, m) => acc + m.foodItem.fat * m.quantity,
    0
  );
  const totalFiber = meals.reduce(
    (acc, m) => acc + (m.foodItem.fiber ?? 0) * m.quantity,
    0
  );

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  // Search & Filter State for Food Database
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<
    'all' | 'veg' | 'non_veg' | 'indian' | 'high_protein'
  >('all');

  // Quick Log Modal State
  const [selectedFoodForLog, setSelectedFoodForLog] = useState<FoodItem | null>(null);
  const [logMealType, setLogMealType] = useState<MealType>('lunch');
  const [logQuantity, setLogQuantity] = useState<number>(1);

  // Filter food items
  const filteredFoodItems = VERIFIED_FOOD_DATABASE.filter((food) => {
    // Search match
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (food.brand && food.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Filter match
    if (selectedFilter === 'veg') return food.isVegetarian === true;
    if (selectedFilter === 'non_veg') return food.isVegetarian === false;
    if (selectedFilter === 'indian') return food.isIndian === true;
    if (selectedFilter === 'high_protein') return food.protein >= 20;

    return true;
  });

  const handleConfirmLog = () => {
    if (!selectedFoodForLog) return;

    dispatch(
      addMealEntry({
        id: `meal_${Date.now()}`,
        foodItem: selectedFoodForLog,
        quantity: logQuantity,
        servingSize: selectedFoodForLog.servingSize * logQuantity,
        mealType: logMealType,
        loggedAt: new Date().toISOString(),
      })
    );

    setSelectedFoodForLog(null);
    setLogQuantity(1);
  };

  const getMealIcon = (type: MealType) => {
    switch (type) {
      case 'breakfast':
        return <Coffee size={18} color={theme.colors.orange} />;
      case 'lunch':
        return <Sun size={18} color={theme.colors.primary} />;
      case 'dinner':
        return <Sunset size={18} color={theme.colors.purple400} />;
      case 'snack':
        return <Apple size={18} color={theme.colors.blue400} />;
    }
  };

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="caption" color={theme.colors.textTertiary} style={styles.eyebrow}>
            DAILY FUEL & MACRONUTRIENTS
          </Text>
          <Text variant="headlineLarge" color={theme.colors.textPrimary} style={styles.mainTitle}>
            Nutrition
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.addFoodBtn, { backgroundColor: theme.colors.primary }]}
          activeOpacity={0.8}
          onPress={() => router.push('/nutrition/log-food')}
        >
          <Plus size={18} color={theme.colors.textInverse} />
          <Text variant="labelSmall" color={theme.colors.textInverse} style={styles.btnLabel}>
            Custom Log
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1. Caloric & Macronutrient Overview Container */}
      <Card padding={4} style={[styles.macroCard, { marginTop: spacing[4] }]}>
        <View style={styles.caloricRow}>
          <View>
            <Text variant="caption" color={theme.colors.textTertiary}>
              CALORIC BUDGET
            </Text>
            <View style={styles.caloricValues}>
              <Text variant="displaySmall" color={theme.colors.textPrimary} style={styles.boldFont}>
                {totalCalories}
              </Text>
              <Text variant="headlineSmall" color={theme.colors.textTertiary} style={styles.totalKcalText}>
                / {targets.calories} kcal
              </Text>
            </View>
          </View>
          <Badge
            label={`${Math.max(0, targets.calories - totalCalories)} kcal left`}
            variant="primary"
            size="md"
          />
        </View>

        {/* 4 Macro Bars: Protein, Carbs, Fats, Fiber */}
        <View style={styles.macroBarsContainer}>
          {/* Protein */}
          <View style={styles.macroCol}>
            <View style={styles.macroLabelRow}>
              <Text variant="caption" color={theme.colors.textTertiary}>
                Protein
              </Text>
              <Text variant="caption" color={theme.colors.primary} style={styles.boldFont}>
                {totalProtein}/{targets.protein}g
              </Text>
            </View>
            <ProgressBar
              progress={totalProtein / targets.protein}
              height={6}
              color={theme.colors.primary}
            />
          </View>

          {/* Carbs */}
          <View style={styles.macroCol}>
            <View style={styles.macroLabelRow}>
              <Text variant="caption" color={theme.colors.textTertiary}>
                Carbs
              </Text>
              <Text variant="caption" color={theme.colors.blue400} style={styles.boldFont}>
                {totalCarbs}/{targets.carbs}g
              </Text>
            </View>
            <ProgressBar
              progress={totalCarbs / targets.carbs}
              height={6}
              color={theme.colors.blue400}
            />
          </View>

          {/* Fats */}
          <View style={styles.macroCol}>
            <View style={styles.macroLabelRow}>
              <Text variant="caption" color={theme.colors.textTertiary}>
                Fats
              </Text>
              <Text variant="caption" color={theme.colors.orange} style={styles.boldFont}>
                {totalFat}/{targets.fat}g
              </Text>
            </View>
            <ProgressBar
              progress={totalFat / targets.fat}
              height={6}
              color={theme.colors.orange}
            />
          </View>

          {/* Fiber */}
          <View style={styles.macroCol}>
            <View style={styles.macroLabelRow}>
              <Text variant="caption" color={theme.colors.textTertiary}>
                Fiber
              </Text>
              <Text variant="caption" color={theme.colors.success} style={styles.boldFont}>
                {totalFiber}/{targets.fiber ?? 30}g
              </Text>
            </View>
            <ProgressBar
              progress={totalFiber / (targets.fiber ?? 30)}
              height={6}
              color={theme.colors.success}
            />
          </View>
        </View>

        {/* Hydration Tracker Inline */}
        <View style={styles.hydrationInline}>
          <View style={styles.hydrationLeft}>
            <Droplets size={18} color={theme.colors.blue400} />
            <Text variant="caption" color={theme.colors.textSecondary}>
              Hydration: {nutrition.waterMl} / {nutrition.waterGoalMl} ml
            </Text>
          </View>
          <View style={styles.hydrationActions}>
            <TouchableOpacity
              style={[styles.waterPill, { backgroundColor: theme.colors.surfaceSecondary }]}
              onPress={() => dispatch(logWater(250))}
            >
              <Text variant="caption" color={theme.colors.primary} style={styles.boldFont}>
                +250ml
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.waterPill, { backgroundColor: theme.colors.surfaceSecondary }]}
              onPress={() => dispatch(logWater(500))}
            >
              <Text variant="caption" color={theme.colors.primary} style={styles.boldFont}>
                +500ml
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* 2. Today's Meals in Horizontal Scroll with Snap */}
      <View style={styles.carouselSection}>
        <View style={styles.sectionTitleRow}>
          <View>
            <Text variant="titleMedium" color={theme.colors.textPrimary} style={styles.boldFont}>
              Today's Meals
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Swipe horizontally to view meal slots
            </Text>
          </View>
          <Badge label="4 SLOTS" variant="neutral" size="sm" />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          contentContainerStyle={styles.snapScrollContainer}
        >
          {mealTypes.map((type) => {
            const typeMeals = meals.filter((m) => m.mealType === type);
            const typeCal = typeMeals.reduce((acc, m) => acc + m.foodItem.calories * m.quantity, 0);
            const typeProt = typeMeals.reduce((acc, m) => acc + m.foodItem.protein * m.quantity, 0);
            const typeCarbs = typeMeals.reduce((acc, m) => acc + m.foodItem.carbs * m.quantity, 0);
            const typeFat = typeMeals.reduce((acc, m) => acc + m.foodItem.fat * m.quantity, 0);

            return (
              <Card
                key={type}
                padding={3.5}
                style={[
                  styles.snapMealCard,
                  {
                    width: SNAP_CARD_WIDTH,
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                {/* Meal Header */}
                <View style={styles.snapMealHeader}>
                  <View style={styles.snapMealTitleLeft}>
                    <View style={[styles.mealIconCircle, { backgroundColor: theme.colors.surfaceSecondary }]}>
                      {getMealIcon(type)}
                    </View>
                    <View>
                      <Text
                        variant="titleSmall"
                        color={theme.colors.textPrimary}
                        style={styles.capitalize}
                      >
                        {type}
                      </Text>
                      <Text variant="caption" color={theme.colors.textTertiary}>
                        {typeCal} kcal • {typeProt}g P
                      </Text>
                    </View>
                  </View>

                  <Badge
                    label={`${typeMeals.length} ITEMS`}
                    variant={typeMeals.length > 0 ? 'primary' : 'neutral'}
                    size="sm"
                  />
                </View>

                {/* Logged Items in this slot */}
                <View style={styles.snapItemsList}>
                  {typeMeals.length > 0 ? (
                    typeMeals.map((entry) => (
                      <View key={entry.id} style={styles.snapItemRow}>
                        <View style={{ flex: 1 }}>
                          <Text
                            variant="bodySmall"
                            color={theme.colors.textPrimary}
                            style={styles.semiBold}
                            numberOfLines={1}
                          >
                            {entry.quantity > 1 ? `${entry.quantity}x ` : ''}
                            {entry.foodItem.name}
                          </Text>
                          <Text variant="caption" color={theme.colors.textTertiary}>
                            {entry.foodItem.protein * entry.quantity}g P •{' '}
                            {entry.foodItem.carbs * entry.quantity}g C •{' '}
                            {entry.foodItem.calories * entry.quantity} kcal
                          </Text>
                        </View>
                        {entry.foodItem.isIndian && (
                          <Badge label="🇮🇳" variant="neutral" size="sm" />
                        )}
                      </View>
                    ))
                  ) : (
                    <View style={styles.emptyMealSlot}>
                      <Text variant="caption" color={theme.colors.textTertiary}>
                        No {type} logged yet today.
                      </Text>
                    </View>
                  )}
                </View>

                {/* Bottom Macro Bar for Slot */}
                <View style={styles.slotMacrosFooter}>
                  <View style={styles.macroPillRow}>
                    <Text variant="caption" color={theme.colors.primary} style={styles.macroChip}>
                      P: {typeProt}g
                    </Text>
                    <Text variant="caption" color={theme.colors.blue400} style={styles.macroChip}>
                      C: {typeCarbs}g
                    </Text>
                    <Text variant="caption" color={theme.colors.orange} style={styles.macroChip}>
                      F: {typeFat}g
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.addSlotBtn, { backgroundColor: theme.colors.surfaceSecondary }]}
                    onPress={() => {
                      setLogMealType(type);
                      // Scroll user focus down to food database
                    }}
                  >
                    <Plus size={14} color={theme.colors.primary} />
                    <Text variant="caption" color={theme.colors.primary} style={styles.boldFont}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. All Food Database with Images, Nutrition & Veg/Non-Veg Filter */}
      <View style={styles.foodDatabaseSection}>
        <View style={styles.sectionTitleRow}>
          <View>
            <Text variant="titleMedium" color={theme.colors.textPrimary} style={styles.boldFont}>
              Explore Food & Nutrition
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Indian cuisine, verified macros & quick logging
            </Text>
          </View>
          <Badge label={`${filteredFoodItems.length} FOODS`} variant="primary" size="sm" />
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: theme.colors.surfaceSecondary, borderColor: theme.colors.border }]}>
          <Search size={18} color={theme.colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.textPrimary }]}
            placeholder="Search paneer, chicken, dal, roti, eggs..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsRow}
        >
          {[
            { id: 'all', label: 'All Foods' },
            { id: 'veg', label: '🟢 Pure Veg' },
            { id: 'non_veg', label: '🔴 Non-Veg' },
            { id: 'indian', label: '🇮🇳 Indian Food' },
            { id: 'high_protein', label: '⚡ High Protein' },
          ].map((item) => {
            const isSelected = selectedFilter === item.id;
            return (
              <TouchableOpacity
                key={`filter-${item.id}`}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.surfaceSecondary,
                  },
                ]}
                onPress={() => setSelectedFilter(item.id as any)}
              >
                <Text
                  variant="caption"
                  color={isSelected ? theme.colors.textInverse : theme.colors.textSecondary}
                  style={styles.boldFont}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Food List Cards */}
        <View style={styles.foodList}>
          {filteredFoodItems.map((food) => {
            return (
              <Card
                key={food.id}
                padding={3}
                style={[
                  styles.foodCard,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                ]}
              >
                <View style={styles.foodMainRow}>
                  {/* Food Image with Veg/Non-Veg Badge */}
                  <View style={styles.imageWrap}>
                    <Image
                      source={{
                        uri:
                          food.imageUrl ||
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
                      }}
                      style={styles.foodImage}
                      contentFit="cover"
                    />

                    {/* Standard Indian Veg (🟢) / Non-Veg (🔴) Stamp */}
                    <View
                      style={[
                        styles.dietStamp,
                        {
                          borderColor: food.isVegetarian ? '#22C55E' : '#EF4444',
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.dietCircle,
                          {
                            backgroundColor: food.isVegetarian ? '#22C55E' : '#EF4444',
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Food Info & Nutrition Breakdown */}
                  <View style={styles.foodDetails}>
                    <View style={styles.foodTitleRow}>
                      <View style={{ flex: 1 }}>
                        <Text
                          variant="titleSmall"
                          color={theme.colors.textPrimary}
                          style={styles.boldFont}
                          numberOfLines={1}
                        >
                          {food.name}
                        </Text>
                        <Text variant="caption" color={theme.colors.textTertiary} numberOfLines={1}>
                          {food.brand ? `${food.brand} • ` : ''}
                          {food.servingSize} {food.servingUnit}
                        </Text>
                      </View>

                      {/* Quick Log Action */}
                      <TouchableOpacity
                        style={[styles.quickAddBtn, { backgroundColor: theme.colors.primaryMuted, borderColor: theme.colors.primary }]}
                        activeOpacity={0.7}
                        onPress={() => setSelectedFoodForLog(food)}
                      >
                        <Plus size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </View>

                    {/* Detailed Nutrition Badges */}
                    <View style={styles.nutrientsRow}>
                      <View style={[styles.macroBadge, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                        <Text variant="caption" color={theme.colors.textPrimary} style={styles.boldFont}>
                          {food.calories} kcal
                        </Text>
                      </View>

                      <View style={[styles.macroBadge, { backgroundColor: theme.colors.primaryMuted }]}>
                        <Text variant="caption" color={theme.colors.primary} style={styles.boldFont}>
                          {food.protein}g P
                        </Text>
                      </View>

                      <View style={[styles.macroBadge, { backgroundColor: 'rgba(96, 165, 250, 0.12)' }]}>
                        <Text variant="caption" color={theme.colors.blue400} style={styles.boldFont}>
                          {food.carbs}g C
                        </Text>
                      </View>

                      <View style={[styles.macroBadge, { backgroundColor: 'rgba(251, 146, 60, 0.12)' }]}>
                        <Text variant="caption" color={theme.colors.orange} style={styles.boldFont}>
                          {food.fat}g F
                        </Text>
                      </View>

                      {food.fiber !== undefined && food.fiber > 0 && (
                        <View style={[styles.macroBadge, { backgroundColor: 'rgba(74, 222, 128, 0.12)' }]}>
                          <Text variant="caption" color={theme.colors.success} style={styles.boldFont}>
                            {food.fiber}g Fib
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>
      </View>

      {/* Shortcuts: Meal Planner & Marketplace */}
      <View style={{ gap: spacing[3], marginTop: spacing[5], marginBottom: spacing[8] }}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/nutrition/meal-planner')}>
          <Card padding={3.5} style={[styles.shortcutCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.shortcutLeft}>
              <View style={[styles.shortcutIcon, { backgroundColor: theme.colors.primaryMuted }]}>
                <UtensilsCrossed size={20} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall" color={theme.colors.textPrimary} style={styles.boldFont}>
                  Smart Meal Planner & Grocery List
                </Text>
                <Text variant="caption" color={theme.colors.textTertiary}>
                  7-day schedule, swap meals & auto grocery checklist
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={theme.colors.primary} />
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/nutrition/diet-marketplace')}>
          <Card padding={3.5} style={[styles.shortcutCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.shortcutLeft}>
              <View style={[styles.shortcutIcon, { backgroundColor: 'rgba(251, 146, 60, 0.12)' }]}>
                <Sparkles size={20} color={theme.colors.orange} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall" color={theme.colors.textPrimary} style={styles.boldFont}>
                  Verified Diet Plan Marketplace
                </Text>
                <Text variant="caption" color={theme.colors.textTertiary}>
                  Evidence-based plans by certified clinical nutritionists
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={theme.colors.orange} />
          </Card>
        </TouchableOpacity>
      </View>

      {/* Quick Log Meal Modal */}
      <Modal visible={selectedFoodForLog !== null} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: theme.colors.background }]}>
            {selectedFoodForLog && (
              <>
                <View style={styles.modalHeader}>
                  <Text variant="titleMedium" color={theme.colors.textPrimary} style={styles.boldFont}>
                    Log to Today's Meals
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedFoodForLog(null)}>
                    <X size={20} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Food Item Summary */}
                <View style={styles.modalFoodSummary}>
                  <Image
                    source={{ uri: selectedFoodForLog.imageUrl }}
                    style={styles.modalFoodImage}
                    contentFit="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text variant="titleSmall" color={theme.colors.textPrimary} style={styles.boldFont}>
                      {selectedFoodForLog.name}
                    </Text>
                    <Text variant="caption" color={theme.colors.textSecondary}>
                      {selectedFoodForLog.calories * logQuantity} kcal •{' '}
                      {selectedFoodForLog.protein * logQuantity}g Protein
                    </Text>
                  </View>
                </View>

                {/* Meal Slot Selector */}
                <Text variant="caption" color={theme.colors.textSecondary} style={styles.modalSectionLabel}>
                  SELECT MEAL SLOT:
                </Text>
                <View style={styles.mealSlotRow}>
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => {
                    const isSelected = logMealType === type;
                    return (
                      <TouchableOpacity
                        key={`slot-${type}`}
                        style={[
                          styles.slotButton,
                          {
                            backgroundColor: isSelected
                              ? theme.colors.primary
                              : theme.colors.surfaceSecondary,
                          },
                        ]}
                        onPress={() => setLogMealType(type)}
                      >
                        <Text
                          variant="caption"
                          color={isSelected ? theme.colors.textInverse : theme.colors.textSecondary}
                          style={styles.capitalize}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Quantity Multiplier */}
                <Text variant="caption" color={theme.colors.textSecondary} style={styles.modalSectionLabel}>
                  SERVING QUANTITY:
                </Text>
                <View style={styles.quantityRow}>
                  {[0.5, 1, 1.5, 2, 3].map((qty) => {
                    const isSelected = logQuantity === qty;
                    return (
                      <TouchableOpacity
                        key={`qty-${qty}`}
                        style={[
                          styles.qtyButton,
                          {
                            backgroundColor: isSelected
                              ? theme.colors.primary
                              : theme.colors.surfaceSecondary,
                          },
                        ]}
                        onPress={() => setLogQuantity(qty)}
                      >
                        <Text
                          variant="caption"
                          color={isSelected ? theme.colors.textInverse : theme.colors.textSecondary}
                          style={styles.boldFont}
                        >
                          {qty}x
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Button
                  label={`Confirm & Log (${selectedFoodForLog.calories * logQuantity} kcal)`}
                  variant="primary"
                  size="lg"
                  fullWidth
                  leftIcon={<CheckCircle2 size={18} color={theme.colors.textInverse} />}
                  onPress={handleConfirmLog}
                  style={styles.confirmLogBtn}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[4],
  },
  eyebrow: {
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  mainTitle: {
    fontWeight: '900',
  },
  addFoodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3.5],
    borderRadius: borderRadius.lg,
  },
  btnLabel: {
    fontWeight: '700',
  },
  macroCard: {
    borderRadius: borderRadius.xl,
  },
  caloricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caloricValues: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginTop: 2,
  },
  boldFont: {
    fontWeight: '700',
  },
  totalKcalText: {
    marginBottom: 4,
  },
  macroBarsContainer: {
    gap: spacing[2.5],
    marginTop: spacing[4],
  },
  macroCol: {
    gap: 4,
  },
  macroLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hydrationInline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    marginTop: spacing[3.5],
    paddingTop: spacing[3],
  },
  hydrationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  hydrationActions: {
    flexDirection: 'row',
    gap: spacing[1.5],
  },
  waterPill: {
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  carouselSection: {
    marginTop: spacing[5],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2.5],
  },
  snapScrollContainer: {
    gap: spacing[3],
    paddingRight: spacing[4],
  },
  snapMealCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  snapMealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snapMealTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  mealIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capitalize: {
    textTransform: 'capitalize',
    fontWeight: '700',
  },
  snapItemsList: {
    marginVertical: spacing[2],
    gap: spacing[1.5],
  },
  snapItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  semiBold: {
    fontWeight: '600',
  },
  emptyMealSlot: {
    paddingVertical: spacing[2],
  },
  slotMacrosFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: spacing[2],
  },
  macroPillRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  macroChip: {
    fontWeight: '600',
  },
  addSlotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing[2.5],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  foodDatabaseSection: {
    marginTop: spacing[5],
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    height: 46,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    marginBottom: spacing[2.5],
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[3.5],
  },
  filterChip: {
    paddingHorizontal: spacing[3.5],
    paddingVertical: spacing[1.5],
    borderRadius: borderRadius.full,
  },
  foodList: {
    gap: spacing[2.5],
  },
  foodCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  foodMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  imageWrap: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  dietStamp: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 14,
    height: 14,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  dietCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  foodDetails: {
    flex: 1,
  },
  foodTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  quickAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutrientsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
    marginTop: spacing[1.5],
  },
  macroBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0.5],
    borderRadius: borderRadius.sm,
  },
  shortcutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  shortcutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  shortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing[5],
    paddingBottom: spacing[8],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3.5],
  },
  modalFoodSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  modalFoodImage: {
    width: 54,
    height: 54,
    borderRadius: borderRadius.md,
  },
  modalSectionLabel: {
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: spacing[2],
  },
  mealSlotRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  slotButton: {
    flex: 1,
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  quantityRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  qtyButton: {
    flex: 1,
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  confirmLogBtn: {
    marginTop: spacing[1],
  },
});
