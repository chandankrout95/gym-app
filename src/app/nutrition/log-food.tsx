import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Search,
  Plus,
  Utensils,
  Check,
  X,
  Flame,
  Sparkles,
  Filter,
} from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeContext';
import { useAppDispatch } from '../../store';
import { addMealEntry } from '../../features/nutrition/store/nutritionSlice';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { VERIFIED_FOOD_DATABASE } from '../../features/nutrition/data/foodDatabase';
import { FoodItem, MealType, MealEntry } from '../../types';
import { spacing, borderRadius } from '../../theme';

export default function LogFoodScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'indian' | 'veg' | 'non_veg'>('all');

  // Active selected food item for logging
  const [activeFood, setActiveFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Custom Food Modal state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customServing, setCustomServing] = useState('1 serving');
  const [customCal, setCustomCal] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');

  const filteredFoods = useMemo(() => {
    return VERIFIED_FOOD_DATABASE.filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.brand && f.brand.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchFilter = true;
      if (filterType === 'indian') matchFilter = !!f.isIndian;
      if (filterType === 'veg') matchFilter = !!f.isVegetarian;
      if (filterType === 'non_veg') matchFilter = !f.isVegetarian;

      return matchSearch && matchFilter;
    });
  }, [searchQuery, filterType]);

  const handleSelectFood = (food: FoodItem) => {
    setActiveFood(food);
    setQuantity(1);
  };

  const handleLogFood = () => {
    if (!activeFood) return;

    const newEntry: MealEntry = {
      id: `meal_entry_${Date.now()}`,
      foodItem: activeFood,
      quantity,
      servingSize: activeFood.servingSize,
      mealType: selectedMealType,
      loggedAt: new Date().toISOString(),
    };

    dispatch(addMealEntry(newEntry));
    Alert.alert('Food Logged!', `${activeFood.name} added to ${selectedMealType}.`, [
      { text: 'Log More', onPress: () => setActiveFood(null) },
      { text: 'Done', onPress: () => router.back() },
    ]);
  };

  const handleSaveCustomFood = () => {
    if (!customName.trim()) {
      Alert.alert('Required', 'Please enter food name.');
      return;
    }
    const cal = parseFloat(customCal) || 0;
    const protein = parseFloat(customProtein) || 0;
    const carbs = parseFloat(customCarbs) || 0;
    const fat = parseFloat(customFat) || 0;

    const newFood: FoodItem = {
      id: `custom_${Date.now()}`,
      name: customName.trim(),
      brand: 'Custom Entry',
      servingSize: 1,
      servingUnit: customServing.trim() || 'portion',
      calories: cal,
      protein,
      carbs,
      fat,
      isIndian: true,
      isVegetarian: true,
    };

    setActiveFood(newFood);
    setShowCustomModal(false);
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
            NUTRITION JOURNAL
          </Text>
          <Text variant="headlineSmall" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
            Log Meal & Calories
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.customFoodBtn, { backgroundColor: theme.colors.primaryMuted }]}
          onPress={() => setShowCustomModal(true)}
        >
          <Plus size={16} color={theme.colors.primary} />
          <Text variant="labelSmall" color={theme.colors.primary} style={{ fontWeight: '700' }}>
            Custom
          </Text>
        </TouchableOpacity>
      </View>

      {/* Meal Type Tabs */}
      <View style={[styles.mealTypeRow, { marginTop: spacing[4] }]}>
        {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => {
          const isActive = selectedMealType === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedMealType(type)}
              style={[
                styles.mealTypeTab,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                  borderColor: isActive ? theme.colors.primary : theme.colors.border,
                },
              ]}
            >
              <Text
                variant="labelSmall"
                color={isActive ? theme.colors.textOnPrimary : theme.colors.textSecondary}
                style={{ fontWeight: '700', textTransform: 'capitalize' }}
              >
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search Input */}
      <View style={{ marginTop: spacing[3.5] }}>
        <Input
          placeholder="Search Indian & global verified food..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={18} color={theme.colors.inputPlaceholder} />}
        />
      </View>

      {/* Quick Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.filtersRow, { marginTop: spacing[3] }]}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            {
              backgroundColor: filterType === 'all' ? theme.colors.primary : theme.colors.surface,
              borderColor: filterType === 'all' ? theme.colors.primary : theme.colors.border,
            },
          ]}
          onPress={() => setFilterType('all')}
        >
          <Text
            variant="labelSmall"
            color={filterType === 'all' ? theme.colors.textOnPrimary : theme.colors.textSecondary}
            style={{ fontWeight: '600' }}
          >
            All Items
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            {
              backgroundColor: filterType === 'indian' ? theme.colors.primary : theme.colors.surface,
              borderColor: filterType === 'indian' ? theme.colors.primary : theme.colors.border,
            },
          ]}
          onPress={() => setFilterType('indian')}
        >
          <Text
            variant="labelSmall"
            color={filterType === 'indian' ? theme.colors.textOnPrimary : theme.colors.textSecondary}
            style={{ fontWeight: '600' }}
          >
            🇮🇳 Indian Cuisine
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            {
              backgroundColor: filterType === 'veg' ? theme.colors.primary : theme.colors.surface,
              borderColor: filterType === 'veg' ? theme.colors.primary : theme.colors.border,
            },
          ]}
          onPress={() => setFilterType('veg')}
        >
          <Text
            variant="labelSmall"
            color={filterType === 'veg' ? theme.colors.textOnPrimary : theme.colors.textSecondary}
            style={{ fontWeight: '600' }}
          >
            🟢 Vegetarian
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            {
              backgroundColor: filterType === 'non_veg' ? theme.colors.primary : theme.colors.surface,
              borderColor: filterType === 'non_veg' ? theme.colors.primary : theme.colors.border,
            },
          ]}
          onPress={() => setFilterType('non_veg')}
        >
          <Text
            variant="labelSmall"
            color={filterType === 'non_veg' ? theme.colors.textOnPrimary : theme.colors.textSecondary}
            style={{ fontWeight: '600' }}
          >
            🔴 Non-Vegetarian
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Active Food Selected Card with Quantity Stepper */}
      {activeFood && (
        <Card
          padding={4}
          style={[
            styles.activeFoodCard,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary, marginTop: spacing[4] },
          ]}
        >
          <View style={styles.activeFoodHeader}>
            <View style={{ flex: 1 }}>
              <Badge
                label={activeFood.isVegetarian ? 'VEG' : 'NON-VEG'}
                variant={activeFood.isVegetarian ? 'success' : 'warning'}
                size="sm"
              />
              <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ fontWeight: '800', marginTop: 4 }}>
                {activeFood.name}
              </Text>
              <Text variant="caption" color={theme.colors.textTertiary}>
                Serving: {activeFood.servingSize} {activeFood.servingUnit}
              </Text>
            </View>

            <TouchableOpacity onPress={() => setActiveFood(null)}>
              <X size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>

          {/* Quantity Stepper */}
          <View style={styles.stepperRow}>
            <Text variant="labelMedium" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
              Servings:
            </Text>

            <View style={styles.stepperControls}>
              <TouchableOpacity
                style={[styles.stepBtn, { backgroundColor: theme.colors.surfaceSecondary }]}
                onPress={() => setQuantity((q) => Math.max(0.5, q - 0.5))}
              >
                <Text variant="titleMedium" color={theme.colors.textPrimary}>
                  -
                </Text>
              </TouchableOpacity>
              <Text variant="titleMedium" color={theme.colors.primary} style={{ fontWeight: '800', minWidth: 32, textAlign: 'center' }}>
                {quantity}
              </Text>
              <TouchableOpacity
                style={[styles.stepBtn, { backgroundColor: theme.colors.surfaceSecondary }]}
                onPress={() => setQuantity((q) => q + 0.5)}
              >
                <Text variant="titleMedium" color={theme.colors.textPrimary}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Real-time Computed Macros */}
          <View style={styles.computedMacrosRow}>
            <View style={styles.macroBox}>
              <Text variant="caption" color={theme.colors.textTertiary}>
                CALORIES
              </Text>
              <Text variant="titleSmall" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
                {Math.round(activeFood.calories * quantity)}
              </Text>
            </View>
            <View style={styles.macroBox}>
              <Text variant="caption" color={theme.colors.textTertiary}>
                PROTEIN
              </Text>
              <Text variant="titleSmall" color={theme.colors.primary} style={{ fontWeight: '800' }}>
                {Math.round(activeFood.protein * quantity * 10) / 10}g
              </Text>
            </View>
            <View style={styles.macroBox}>
              <Text variant="caption" color={theme.colors.textTertiary}>
                CARBS
              </Text>
              <Text variant="titleSmall" color={theme.colors.orange} style={{ fontWeight: '800' }}>
                {Math.round(activeFood.carbs * quantity * 10) / 10}g
              </Text>
            </View>
            <View style={styles.macroBox}>
              <Text variant="caption" color={theme.colors.textTertiary}>
                FATS
              </Text>
              <Text variant="titleSmall" color={theme.colors.blue400} style={{ fontWeight: '800' }}>
                {Math.round(activeFood.fat * quantity * 10) / 10}g
              </Text>
            </View>
          </View>

          <Button
            label={`Log into ${selectedMealType.toUpperCase()}`}
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleLogFood}
            style={{ marginTop: spacing[3] }}
          />
        </Card>
      )}

      {/* Verified Foods List */}
      <View style={{ marginTop: spacing[4], marginBottom: spacing[8], gap: spacing[2.5] }}>
        <Text variant="titleSmall" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
          Verified Database ({filteredFoods.length})
        </Text>

        {filteredFoods.map((food) => {
          const isSelected = activeFood?.id === food.id;
          return (
            <TouchableOpacity
              key={food.id}
              activeOpacity={0.8}
              onPress={() => handleSelectFood(food)}
            >
              <Card
                padding={3.5}
                style={[
                  styles.foodListItem,
                  isSelected && { borderColor: theme.colors.primary, borderWidth: 1.5 },
                ]}
              >
                <View style={styles.foodRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.badgeRow}>
                      <Badge
                        label={food.isVegetarian ? 'VEG' : 'NON-VEG'}
                        variant={food.isVegetarian ? 'success' : 'warning'}
                        size="sm"
                      />
                      {food.isIndian && (
                        <Badge label="INDIAN" variant="neutral" size="sm" />
                      )}
                    </View>
                    <Text variant="titleSmall" color={theme.colors.textPrimary} style={{ fontWeight: '700', marginTop: 3 }}>
                      {food.name}
                    </Text>
                    <Text variant="caption" color={theme.colors.textTertiary}>
                      {food.servingSize} {food.servingUnit} • {food.protein}g Protein • {food.carbs}g Carbs • {food.fat}g Fat
                    </Text>
                  </View>

                  <View style={styles.calPill}>
                    <Text variant="titleSmall" color={theme.colors.primary} style={{ fontWeight: '800' }}>
                      {food.calories}
                    </Text>
                    <Text variant="caption" color={theme.colors.textTertiary}>
                      kcal
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Custom Food Creation Modal */}
      <Modal visible={showCustomModal} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
          <Card padding={5} style={[styles.modalCard, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text variant="headlineSmall" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
                Add Custom Food
              </Text>
              <TouchableOpacity onPress={() => setShowCustomModal(false)}>
                <X size={20} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420, marginTop: spacing[3] }}>
              <View style={{ gap: spacing[3] }}>
                <Input
                  label="Food Name"
                  placeholder="e.g. Grandma's Ragi Dosa"
                  value={customName}
                  onChangeText={setCustomName}
                />
                <Input
                  label="Serving Size Unit"
                  placeholder="e.g. 2 pieces (120g)"
                  value={customServing}
                  onChangeText={setCustomServing}
                />
                <Input
                  label="Calories (kcal)"
                  placeholder="e.g. 180"
                  keyboardType="numeric"
                  value={customCal}
                  onChangeText={setCustomCal}
                />
                <Input
                  label="Protein (grams)"
                  placeholder="e.g. 6"
                  keyboardType="numeric"
                  value={customProtein}
                  onChangeText={setCustomProtein}
                />
                <Input
                  label="Carbohydrates (grams)"
                  placeholder="e.g. 32"
                  keyboardType="numeric"
                  value={customCarbs}
                  onChangeText={setCustomCarbs}
                />
                <Input
                  label="Fats (grams)"
                  placeholder="e.g. 3"
                  keyboardType="numeric"
                  value={customFat}
                  onChangeText={setCustomFat}
                />
              </View>
            </ScrollView>

            <View style={{ marginTop: spacing[4] }}>
              <Button
                label="Save & Select Food"
                variant="primary"
                size="lg"
                fullWidth
                onPress={handleSaveCustomFood}
              />
            </View>
          </Card>
        </View>
      </Modal>
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
  customFoodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.md,
  },
  mealTypeRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  mealTypeTab: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  filtersRow: {
    gap: spacing[2],
  },
  filterChip: {
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[3],
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  activeFoodCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
  },
  activeFoodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[3],
    paddingVertical: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  computedMacrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing[2.5],
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginTop: spacing[2],
  },
  macroBox: {
    alignItems: 'center',
    flex: 1,
  },
  foodListItem: {
    borderRadius: borderRadius.lg,
  },
  foodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  calPill: {
    alignItems: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[5],
  },
  modalCard: {
    borderRadius: borderRadius['2xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
