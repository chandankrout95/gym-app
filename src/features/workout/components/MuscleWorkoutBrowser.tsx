import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Image } from 'expo-image';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import {
  ChevronDown,
  ChevronUp,
  Dumbbell,
  Play,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  Info,
  Timer,
  ShieldAlert,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../../../theme/ThemeContext';
import { useAppDispatch } from '../../../store';
import { startSession } from '../store/workoutSlice';
import { EXERCISE_LIBRARY } from '../../exercises/data/exerciseLibrary';
import { Exercise } from '../../../types';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { spacing, borderRadius } from '../../../theme';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

interface MuscleCategory {
  id: string;
  name: string;
  tagline: string;
  primaryKey: string;
  imageUrl: string;
  badge: string;
  accentColor: string;
}

const MUSCLE_CATEGORIES: MuscleCategory[] = [
  {
    id: 'abs',
    name: 'ABS & CORE',
    tagline: 'Six-pack definition, obliques & rotational bracing',
    primaryKey: 'abs',
    imageUrl:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&auto=format&fit=crop&q=80',
    badge: 'CORE POWER',
    accentColor: '#A3E635',
  },
  {
    id: 'shoulders',
    name: 'SHOULDERS & DELTS',
    tagline: 'Anterior, lateral & rear 3D boulder deltoid mass',
    primaryKey: 'shoulders',
    imageUrl:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80',
    badge: '3D DELTOIDS',
    accentColor: '#38BDF8',
  },
  {
    id: 'biceps',
    name: 'BICEPS & FOREARMS',
    tagline: 'Peak hypertrophy, brachialis & crushing grip',
    primaryKey: 'biceps',
    imageUrl:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&auto=format&fit=crop&q=80',
    badge: 'PEAK MASS',
    accentColor: '#F97316',
  },
  {
    id: 'triceps',
    name: 'TRICEPS HORSESHOE',
    tagline: 'Medial, lateral & long head arm thickness',
    primaryKey: 'triceps',
    imageUrl:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&auto=format&fit=crop&q=80',
    badge: 'HORSESHOE',
    accentColor: '#C084FC',
  },
  {
    id: 'chest',
    name: 'CHEST & PECS',
    tagline: 'Upper clavicular shelf & dense sternal thickness',
    primaryKey: 'chest',
    imageUrl:
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80',
    badge: 'CHEST ARMOR',
    accentColor: '#4ADE80',
  },
  {
    id: 'back',
    name: 'BACK & LATS',
    tagline: 'V-taper width, rhomboids & spinal erectors',
    primaryKey: 'back',
    imageUrl:
      'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=900&auto=format&fit=crop&q=80',
    badge: 'V-TAPER',
    accentColor: '#60A5FA',
  },
  {
    id: 'legs',
    name: 'LEGS & QUADS',
    tagline: 'Quad sweep, teardrop definition & hamstring density',
    primaryKey: 'legs',
    imageUrl:
      'https://images.unsplash.com/photo-1434596922112-19c563067271?w=900&auto=format&fit=crop&q=80',
    badge: 'WHEELS',
    accentColor: '#FBBF24',
  },
];

type DifficultyTier = 'beginner' | 'intermediate' | 'advanced';

const DIFFICULTY_CONFIG: Record<
  DifficultyTier,
  { label: string; desc: string; setsReps: string; badgeVariant: 'success' | 'info' | 'warning' }
> = {
  beginner: {
    label: 'Beginner',
    desc: 'Form mastery & joint adaptation',
    setsReps: '3 Sets • 10–12 Reps • 60s Rest',
    badgeVariant: 'success',
  },
  intermediate: {
    label: 'Intermediate',
    desc: 'Hypertrophy & progressive overload',
    setsReps: '4 Sets • 8–10 Reps • 90s Rest',
    badgeVariant: 'info',
  },
  advanced: {
    label: 'Advanced',
    desc: 'High intensity, drop sets & failure',
    setsReps: '4–5 Sets • 6–8 Heavy Reps + Dropset',
    badgeVariant: 'warning',
  },
};

export function MuscleWorkoutBrowser() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  // Currently expanded category and selected difficulty per category
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Record<string, DifficultyTier | null>>({});
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const toggleCategory = (catId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedCategoryId === catId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(catId);
      // Default to beginner if none selected yet
      if (!selectedDifficulty[catId]) {
        setSelectedDifficulty((prev) => ({ ...prev, [catId]: 'beginner' }));
      }
    }
  };

  const selectTier = (catId: string, tier: DifficultyTier) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedDifficulty((prev) => ({
      ...prev,
      [catId]: prev[catId] === tier ? null : tier,
    }));
  };

  const getExercisesForCategoryAndTier = (cat: MuscleCategory, tier: DifficultyTier): Exercise[] => {
    return EXERCISE_LIBRARY.filter((ex) => {
      const matchDiff = ex.difficulty === tier;
      let matchMuscle = false;

      if (cat.id === 'abs') {
        matchMuscle =
          ex.primaryMuscle === 'abs' ||
          ex.muscleGroups.includes('abs') ||
          ex.muscleGroups.includes('obliques');
      } else if (cat.id === 'shoulders') {
        matchMuscle =
          ex.primaryMuscle === 'shoulders' ||
          ex.muscleGroups.includes('shoulders');
      } else if (cat.id === 'biceps') {
        matchMuscle =
          ex.primaryMuscle === 'biceps' ||
          ex.primaryMuscle === 'forearms' ||
          ex.muscleGroups.includes('biceps');
      } else if (cat.id === 'triceps') {
        matchMuscle =
          ex.primaryMuscle === 'triceps' ||
          ex.muscleGroups.includes('triceps');
      } else if (cat.id === 'chest') {
        matchMuscle =
          ex.primaryMuscle === 'chest' ||
          ex.muscleGroups.includes('chest');
      } else if (cat.id === 'back') {
        matchMuscle =
          ex.primaryMuscle === 'back' ||
          ex.primaryMuscle === 'lats' ||
          ex.primaryMuscle === 'traps' ||
          ex.primaryMuscle === 'lower_back' ||
          ex.muscleGroups.includes('lats') ||
          ex.muscleGroups.includes('traps');
      } else if (cat.id === 'legs') {
        matchMuscle =
          ex.primaryMuscle === 'legs' ||
          ex.primaryMuscle === 'quadriceps' ||
          ex.primaryMuscle === 'hamstrings' ||
          ex.primaryMuscle === 'calves' ||
          ex.muscleGroups.includes('quadriceps') ||
          ex.muscleGroups.includes('hamstrings') ||
          ex.muscleGroups.includes('glutes');
      }

      return matchMuscle && matchDiff;
    });
  };

  const startRoutineSession = (cat: MuscleCategory, tier: DifficultyTier, exercises: Exercise[]) => {
    dispatch(
      startSession({
        name: `${cat.name} (${DIFFICULTY_CONFIG[tier].label})`,
        exercises: exercises.map((e) => ({
          id: `we_${Date.now()}_${e.id}`,
          exercise: e,
          sets: [
            { id: 's1', reps: tier === 'advanced' ? 8 : 10, isCompleted: false },
            { id: 's2', reps: tier === 'advanced' ? 8 : 10, isCompleted: false },
            { id: 's3', reps: tier === 'advanced' ? 8 : 10, isCompleted: false },
          ],
        })),
      })
    );
    router.push('/workout/session');
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View>
          <Text variant="titleMedium" color={theme.colors.textPrimary} style={styles.sectionTitle}>
            Target Muscle Workouts
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Select muscle group & choose difficulty tier
          </Text>
        </View>
        <Badge label="INTERACTIVE" variant="primary" size="sm" />
      </View>

      <View style={styles.cardsStack}>
        {MUSCLE_CATEGORIES.map((category) => {
          const isExpanded = expandedCategoryId === category.id;
          const currentTier = selectedDifficulty[category.id] ?? null;
          const exercises = currentTier
            ? getExercisesForCategoryAndTier(category, currentTier)
            : [];

          return (
            <View
              key={category.id}
              style={[
                styles.categoryWrapper,
                {
                  borderColor: isExpanded
                    ? category.accentColor
                    : theme.colors.border,
                  backgroundColor: theme.colors.surface,
                },
              ]}
            >
              {/* Header Card with Photo & Gradient Overlay */}
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => toggleCategory(category.id)}
                style={styles.cardHeaderTouch}
              >
                <View style={styles.imageBox}>
                  <Image
                    source={{ uri: category.imageUrl }}
                    style={styles.coverImage}
                    contentFit="cover"
                  />

                  {/* Gradient Overlay using SVG */}
                  <Svg style={StyleSheet.absoluteFill}>
                    <Defs>
                      <LinearGradient
                        id={`grad-${category.id}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <Stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
                        <Stop offset="50%" stopColor="#050505" stopOpacity="0.65" />
                        <Stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.95" />
                      </LinearGradient>
                    </Defs>
                    <Rect
                      width="100%"
                      height="100%"
                      fill={`url(#grad-${category.id})`}
                    />
                  </Svg>

                  {/* Card Content Overlay */}
                  <View style={styles.overlayContent}>
                    <View style={styles.topBadgeRow}>
                      <Badge
                        label={category.badge}
                        variant="primary"
                        size="sm"
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                      />
                      <View
                        style={[
                          styles.expandIconCircle,
                          {
                            backgroundColor: isExpanded
                              ? category.accentColor
                              : 'rgba(255,255,255,0.15)',
                          },
                        ]}
                      >
                        {isExpanded ? (
                          <ChevronUp size={18} color="#000000" />
                        ) : (
                          <ChevronDown size={18} color="#FFFFFF" />
                        )}
                      </View>
                    </View>

                    <View style={styles.bottomMeta}>
                      <Text
                        variant="headlineSmall"
                        style={styles.categoryTitle}
                        color="#FFFFFF"
                      >
                        {category.name}
                      </Text>
                      <Text
                        variant="caption"
                        style={styles.categoryTagline}
                        color="rgba(255, 255, 255, 0.78)"
                        numberOfLines={1}
                      >
                        {category.tagline}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Smooth Animated Dropdown Container */}
              {isExpanded && (
                <Animated.View
                  entering={FadeInDown.duration(280)}
                  exiting={FadeOutUp.duration(200)}
                  style={styles.dropdownContainer}
                >
                  {/* Difficulty Selection Pills */}
                  <Text
                    variant="caption"
                    color={theme.colors.textSecondary}
                    style={styles.selectTierLabel}
                  >
                    SELECT TRAINING INTENSITY TIER:
                  </Text>

                  <View style={styles.tierButtonsRow}>
                    {(['beginner', 'intermediate', 'advanced'] as const).map(
                      (tier) => {
                        const isTierActive = currentTier === tier;
                        const cfg = DIFFICULTY_CONFIG[tier];
                        return (
                          <TouchableOpacity
                            key={`${category.id}-${tier}`}
                            activeOpacity={0.8}
                            onPress={() => selectTier(category.id, tier)}
                            style={[
                              styles.tierButton,
                              {
                                backgroundColor: isTierActive
                                  ? category.accentColor
                                  : theme.colors.surfaceSecondary,
                                borderColor: isTierActive
                                  ? category.accentColor
                                  : theme.colors.border,
                              },
                            ]}
                          >
                            <Text
                              variant="labelSmall"
                              color={
                                isTierActive
                                  ? '#000000'
                                  : theme.colors.textPrimary
                              }
                              style={styles.tierBtnText}
                            >
                              {cfg.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>

                  {/* Exercises Section for Selected Tier */}
                  {currentTier && (
                    <Animated.View
                      entering={FadeIn.duration(240)}
                      style={styles.exercisesSection}
                    >
                      <View style={styles.tierInfoBanner}>
                        <View style={styles.flexRow}>
                          <Zap size={16} color={category.accentColor} />
                          <Text
                            variant="labelMedium"
                            color={theme.colors.textPrimary}
                            style={styles.ml1}
                          >
                            {DIFFICULTY_CONFIG[currentTier].label} Protocol
                          </Text>
                        </View>
                        <Text
                          variant="caption"
                          color={theme.colors.textSecondary}
                          style={styles.mt05}
                        >
                          {DIFFICULTY_CONFIG[currentTier].setsReps}
                        </Text>
                      </View>

                      {/* Exercise Cards */}
                      {exercises.length === 0 ? (
                        <View style={styles.emptyExercises}>
                          <Text variant="caption" color={theme.colors.textSecondary}>
                            Curating more {category.name} exercises for this tier.
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.exerciseCardsList}>
                          {exercises.map((ex, index) => {
                            const isDetailExpanded = expandedExerciseId === ex.id;
                            return (
                              <Card
                                key={ex.id}
                                variant="default"
                                style={[
                                  styles.exerciseCard,
                                  {
                                    backgroundColor:
                                      theme.colors.surfaceSecondary,
                                  },
                                ]}
                              >
                                <TouchableOpacity
                                  activeOpacity={0.8}
                                  onPress={() =>
                                    setExpandedExerciseId(
                                      isDetailExpanded ? null : ex.id
                                    )
                                  }
                                  style={styles.exerciseHeaderRow}
                                >
                                  <View style={styles.exLeftGroup}>
                                    <View
                                      style={[
                                        styles.exIndexBadge,
                                        {
                                          backgroundColor:
                                            'rgba(255, 255, 255, 0.08)',
                                        },
                                      ]}
                                    >
                                      <Text
                                        variant="labelSmall"
                                        color={category.accentColor}
                                        style={styles.exIndexText}
                                      >
                                        0{index + 1}
                                      </Text>
                                    </View>

                                    <View style={styles.exTitleGroup}>
                                      <Text
                                        variant="titleSmall"
                                        color={theme.colors.textPrimary}
                                        style={styles.exName}
                                      >
                                        {ex.name}
                                      </Text>
                                      <View style={styles.equipmentRow}>
                                        {ex.equipment.map((eq) => (
                                          <Badge
                                            key={eq}
                                            label={eq.toUpperCase()}
                                            variant="neutral"
                                            size="sm"
                                          />
                                        ))}
                                      </View>
                                    </View>
                                  </View>

                                  <View style={styles.flexRow}>
                                    {isDetailExpanded ? (
                                      <ChevronUp
                                        size={18}
                                        color={theme.colors.textSecondary}
                                      />
                                    ) : (
                                      <ChevronDown
                                        size={18}
                                        color={theme.colors.textSecondary}
                                      />
                                    )}
                                  </View>
                                </TouchableOpacity>

                                {/* Detailed Instructions & Tips */}
                                {isDetailExpanded && (
                                  <Animated.View
                                    entering={FadeInDown.duration(200)}
                                    style={styles.instructionsContainer}
                                  >
                                    <Text
                                      variant="caption"
                                      color={theme.colors.primary}
                                      style={styles.instructionHeader}
                                    >
                                      FORM INSTRUCTIONS:
                                    </Text>
                                    {ex.instructions.map((inst, iIdx) => (
                                      <Text
                                        key={`inst-${iIdx}`}
                                        variant="caption"
                                        color={theme.colors.textSecondary}
                                        style={styles.instructionStep}
                                      >
                                        • {inst}
                                      </Text>
                                    ))}

                                    {ex.tips && ex.tips.length > 0 && (
                                      <View
                                        style={[
                                          styles.coachingTipBox,
                                          {
                                            backgroundColor:
                                              'rgba(163, 230, 53, 0.08)',
                                          },
                                        ]}
                                      >
                                        <Sparkles
                                          size={14}
                                          color={theme.colors.primary}
                                        />
                                        <Text
                                          variant="caption"
                                          color={theme.colors.primary}
                                          style={styles.tipText}
                                        >
                                          {ex.tips[0]}
                                        </Text>
                                      </View>
                                    )}
                                  </Animated.View>
                                )}
                              </Card>
                            );
                          })}

                          {/* Quick Start Routine Action */}
                          <Button
                            label={`Start ${DIFFICULTY_CONFIG[currentTier].label} ${category.name}`}
                            variant="primary"
                            size="md"
                            fullWidth
                            leftIcon={
                              <Play size={16} color={theme.colors.textInverse} fill={theme.colors.textInverse} />
                            }
                            onPress={() =>
                              startRoutineSession(
                                category,
                                currentTier,
                                exercises
                              )
                            }
                            style={styles.startRoutineBtn}
                          />
                        </View>
                      )}
                    </Animated.View>
                  )}
                </Animated.View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing[3],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontWeight: '800',
  },
  cardsStack: {
    gap: spacing[3.5],
  },
  categoryWrapper: {
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  cardHeaderTouch: {
    width: '100%',
  },
  imageBox: {
    width: '100%',
    height: 145,
    position: 'relative',
    justifyContent: 'space-between',
  },
  coverImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  overlayContent: {
    ...StyleSheet.absoluteFill,
    padding: spacing[3.5],
    justifyContent: 'space-between',
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandIconCircle: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomMeta: {
    marginTop: 'auto',
  },
  categoryTitle: {
    fontWeight: '900',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryTagline: {
    marginTop: 2,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dropdownContainer: {
    padding: spacing[3.5],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  selectTierLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
  tierButtonsRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  tierButton: {
    flex: 1,
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierBtnText: {
    fontWeight: '700',
  },
  exercisesSection: {
    marginTop: spacing[3],
  },
  tierInfoBanner: {
    padding: spacing[2.5],
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginBottom: spacing[2.5],
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ml1: {
    marginLeft: spacing[1.5],
  },
  mt05: {
    marginTop: spacing[0.5],
  },
  emptyExercises: {
    padding: spacing[4],
    alignItems: 'center',
  },
  exerciseCardsList: {
    gap: spacing[2],
  },
  exerciseCard: {
    padding: spacing[3],
    borderRadius: borderRadius.lg,
  },
  exerciseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2.5],
    flex: 1,
  },
  exIndexBadge: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exIndexText: {
    fontWeight: '800',
  },
  exTitleGroup: {
    flex: 1,
  },
  exName: {
    fontWeight: '700',
  },
  equipmentRow: {
    flexDirection: 'row',
    gap: spacing[1],
    marginTop: spacing[1],
  },
  instructionsContainer: {
    marginTop: spacing[2.5],
    paddingTop: spacing[2.5],
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  instructionHeader: {
    fontWeight: '700',
    marginBottom: spacing[1],
  },
  instructionStep: {
    marginBottom: spacing[1],
    lineHeight: 18,
  },
  coachingTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
    padding: spacing[2],
    borderRadius: borderRadius.sm,
    marginTop: spacing[1.5],
  },
  tipText: {
    flex: 1,
    fontWeight: '600',
  },
  startRoutineBtn: {
    marginTop: spacing[2.5],
  },
});
