import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Sparkles,
  Star,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Award,
  Lock,
  ChevronRight,
} from 'lucide-react-native';

import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { EVIDENCE_INFORMED_DIET_PLANS, DietPlan } from '../../features/nutrition/data/dietPlans';
import { spacing, borderRadius } from '../../theme';

export default function DietMarketplaceScreen() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [purchasedPlans, setPurchasedPlans] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Plans' },
    { id: 'muscle_building', label: 'Muscle Building' },
    { id: 'weight_loss', label: 'Fat Loss' },
    { id: 'lean_muscle', label: 'Body Recomp' },
  ];

  const filteredPlans = EVIDENCE_INFORMED_DIET_PLANS.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handlePurchaseOrUnlock = (plan: DietPlan) => {
    if (!plan.isMarketplacePaid || purchasedPlans[plan.id]) {
      Alert.alert('Plan Activated', `${plan.name} is now your active nutrition blueprint.`, [
        { text: 'View Schedule', onPress: () => router.push('/nutrition/meal-planner') },
      ]);
      return;
    }

    Alert.alert(
      'Unlock Certified Diet Blueprint',
      `Purchase "${plan.name}" by ${plan.authorName} for ₹${plan.priceInr}?\n\n• Includes 7-day cyclical meal schedules\n• Complete grocery list\n• Weekly macro progressive adjustments`,
      [
        {
          text: 'Proceed to Payment',
          onPress: () => {
            // Simulated secure payment tokenization without exposing secrets
            setPurchasedPlans((prev) => ({ ...prev, [plan.id]: true }));
            Alert.alert('Payment Successful!', `You have unlocked ${plan.name}.`, [
              { text: 'Open Plan', onPress: () => router.push('/nutrition/meal-planner') },
            ]);
          },
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
            VERIFIED EXPERT MARKETPLACE
          </Text>
          <Text variant="headlineSmall" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
            Diet Plan Store
          </Text>
        </View>
      </View>

      {/* Hero Banner */}
      <Card
        padding={4}
        style={[
          styles.heroCard,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, marginTop: spacing[4] },
        ]}
      >
        <View style={styles.heroTop}>
          <View style={[styles.heroIcon, { backgroundColor: theme.colors.primaryMuted }]}>
            <Award size={22} color={theme.colors.primary} />
          </View>
          <Badge label="CERTIFIED PROTOCOLS" variant="primary" size="sm" />
        </View>

        <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ fontWeight: '800', marginTop: spacing[2] }}>
          Evidence-Informed Nutrition By Registered Specialists
        </Text>
        <Text variant="caption" color={theme.colors.textTertiary} style={{ marginTop: 2 }}>
          Every blueprint is reviewed by certified sports nutritionists, dietitians, and metabolic coaches. Zero dangerous crash diets.
        </Text>
      </Card>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                variant="labelSmall"
                color={isSelected ? theme.colors.textOnPrimary : theme.colors.textSecondary}
                style={{ fontWeight: '600' }}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Plan Cards */}
      <View style={{ gap: spacing[4], marginTop: spacing[4], marginBottom: spacing[8] }}>
        {filteredPlans.map((plan) => {
          const isUnlocked = !plan.isMarketplacePaid || !!purchasedPlans[plan.id];

          return (
            <Card key={plan.id} padding={4} style={styles.planCard}>
              <View style={styles.planTopRow}>
                <View style={{ flex: 1 }}>
                  <View style={styles.ratingRow}>
                    <Badge
                      label={plan.dietaryType.replace('_', ' ').toUpperCase()}
                      variant={plan.dietaryType === 'vegetarian' ? 'success' : 'neutral'}
                      size="sm"
                    />
                    <View style={styles.ratingBadge}>
                      <Star size={13} color="#FBBF24" fill="#FBBF24" />
                      <Text variant="caption" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
                        {plan.rating} ({plan.reviewCount})
                      </Text>
                    </View>
                  </View>

                  <Text variant="titleLarge" color={theme.colors.textPrimary} style={{ fontWeight: '800', marginTop: spacing[2] }}>
                    {plan.name}
                  </Text>
                  <Text variant="caption" color={theme.colors.primary} style={{ fontWeight: '600', marginTop: 2 }}>
                    By {plan.authorName} • {plan.authorTitle}
                  </Text>
                </View>
              </View>

              <Text variant="bodySmall" color={theme.colors.textTertiary} style={{ marginTop: spacing[2] }}>
                {plan.description}
              </Text>

              {/* Macro target bar */}
              <View style={styles.macroPillRow}>
                <Text variant="labelSmall" color={theme.colors.textPrimary} style={{ fontWeight: '700' }}>
                  {plan.targetCalories} kcal
                </Text>
                <Text variant="caption" color={theme.colors.textTertiary}>•</Text>
                <Text variant="caption" color={theme.colors.primary} style={{ fontWeight: '700' }}>
                  {plan.macros.proteinG}g Protein
                </Text>
                <Text variant="caption" color={theme.colors.textTertiary}>•</Text>
                <Text variant="caption" color={theme.colors.orange} style={{ fontWeight: '700' }}>
                  {plan.macros.carbsG}g Carbs
                </Text>
                <Text variant="caption" color={theme.colors.textTertiary}>•</Text>
                <Text variant="caption" color={theme.colors.blue400} style={{ fontWeight: '700' }}>
                  {plan.macros.fatG}g Fat
                </Text>
              </View>

              {/* Price & CTA Button */}
              <View style={styles.planFooter}>
                <View>
                  <Text variant="caption" color={theme.colors.textTertiary}>
                    ACCESS
                  </Text>
                  <Text variant="titleMedium" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
                    {plan.isMarketplacePaid
                      ? isUnlocked
                        ? 'Purchased'
                        : `₹${plan.priceInr}`
                      : 'Included in Pro'}
                  </Text>
                </View>

                <Button
                  label={isUnlocked ? 'Select Plan' : `Unlock Plan • ₹${plan.priceInr}`}
                  variant={isUnlocked ? 'secondary' : 'primary'}
                  size="md"
                  leftIcon={
                    isUnlocked ? (
                      <CheckCircle2 size={16} color={theme.colors.primary} />
                    ) : (
                      <Lock size={16} color={theme.colors.textOnPrimary} />
                    )
                  }
                  onPress={() => handlePurchaseOrUnlock(plan)}
                />
              </View>
            </Card>
          );
        })}
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
  heroCard: {
    borderRadius: borderRadius.xl,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryRow: {
    gap: spacing[2],
    marginTop: spacing[4],
  },
  categoryChip: {
    paddingVertical: spacing[1.5],
    paddingHorizontal: spacing[3.5],
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  planCard: {
    borderRadius: borderRadius.xl,
  },
  planTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2.5],
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  macroPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[3],
    paddingVertical: spacing[2],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[2],
  },
});
