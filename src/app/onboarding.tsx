import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Card } from '../components/ui/Card';
import { spacing, borderRadius } from '../theme';

const steps = [
  {
    id: 'goal',
    title: 'Primary Fitness Goal',
    subtitle: 'What is your core target for the next 90 days?',
    options: [
      { id: 'muscle_building', label: 'Hypertrophy & Muscle Building', desc: 'Focus on progressive overload and size' },
      { id: 'weight_loss', label: 'Fat Loss & Leaning Down', desc: 'Caloric deficit with high protein retention' },
      { id: 'lean_muscle', label: 'Body Recomposition', desc: 'Build lean mass while decreasing body fat' },
      { id: 'general_fitness', label: 'Endurance & Mobility', desc: 'Functional performance & cardiovascular health' },
    ],
  },
  {
    id: 'experience',
    title: 'Training Experience',
    subtitle: 'How familiar are you with structured lifting?',
    options: [
      { id: 'beginner', label: 'Beginner (< 1 Year)', desc: 'Learning lifting mechanics & compound movements' },
      { id: 'intermediate', label: 'Intermediate (1 - 3 Years)', desc: 'Consistent training with established splits' },
      { id: 'advanced', label: 'Advanced (3+ Years)', desc: 'Advanced periodization and specialization blocks' },
    ],
  },
  {
    id: 'nutrition',
    title: 'Dietary Preference',
    subtitle: 'Tailors Indian and international meal recommendations',
    options: [
      { id: 'non_vegetarian', label: 'Non-Vegetarian', desc: 'Eggs, poultry, fish, dairy & plant foods' },
      { id: 'vegetarian', label: 'Vegetarian (Lacto/Ovo)', desc: 'Paneer, lentils, whey, curd & grains' },
      { id: 'vegan', label: 'Pure Vegan', desc: 'Plant-based proteins, legumes, tofu & soy' },
    ],
  },
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({
    goal: 'muscle_building',
    experience: 'intermediate',
    nutrition: 'non_vegetarian',
  });

  const step = steps[currentStepIndex];
  const progress = (currentStepIndex + 1) / steps.length;

  const handleSelect = (optionId: string) => {
    setSelections(prev => ({ ...prev, [step.id]: optionId }));
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={styles.safe}>
        {/* Progress Bar */}
        <View style={styles.progressHeader}>
          <ProgressBar progress={progress} height={4} />
          <View style={styles.stepCounter}>
            <Text variant="labelSmall" color={theme.colors.textTertiary}>
              Step {currentStepIndex + 1} of {steps.length}
            </Text>
          </View>
        </View>

        {/* Content */}
        <Animated.View key={step.id} entering={FadeInDown.duration(350)} style={styles.content}>
          <Text variant="headlineLarge" color={theme.colors.textPrimary}>
            {step.title}
          </Text>
          <Text variant="bodyMedium" color={theme.colors.textTertiary} style={{ marginTop: spacing[1] }}>
            {step.subtitle}
          </Text>

          <View style={styles.optionsList}>
            {step.options.map((opt) => {
              const selected = selections[step.id] === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  activeOpacity={0.8}
                  onPress={() => handleSelect(opt.id)}
                >
                  <Card
                    variant={selected ? 'outlined' : 'default'}
                    padding={4}
                    style={[
                      styles.optionCard,
                      {
                        borderColor: selected ? theme.colors.primary : theme.colors.cardBorder,
                        backgroundColor: selected ? theme.colors.primaryMuted : theme.colors.cardBackground,
                      },
                    ]}
                  >
                    <View style={styles.optionInfo}>
                      <Text
                        variant="titleSmall"
                        color={selected ? theme.colors.primary : theme.colors.textPrimary}
                        style={{ fontWeight: '700' }}
                      >
                        {opt.label}
                      </Text>
                      <Text variant="caption" color={theme.colors.textTertiary} style={{ marginTop: 2 }}>
                        {opt.desc}
                      </Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          <Button
            label={currentStepIndex === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleNext}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: spacing[5], justifyContent: 'space-between' },
  progressHeader: { paddingTop: spacing[2], gap: spacing[2] },
  stepCounter: { alignItems: 'flex-end' },
  content: { flex: 1, marginTop: spacing[6] },
  optionsList: { gap: spacing[3], marginTop: spacing[6] },
  optionCard: {
    borderWidth: 1.5,
  },
  optionInfo: { gap: 2 },
  bottomSection: { paddingBottom: spacing[4] },
});
