import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Flame,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Coffee,
  Brain,
  Dumbbell,
  Clock,
  CheckCircle2,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  setMode,
  recordSession,
  setAmbientSound,
  setActiveTaskTag,
} from '../../features/productivity/store/productivitySlice';
import { FocusMode } from '../../types';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ProgressRingSvg } from '../../components/charts/ProgressRingSvg';
import { spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

const MODE_CONFIG: Record<
  FocusMode,
  { label: string; duration: number; icon: any; color: string }
> = {
  work: { label: 'Deep Focus', duration: 25 * 60, icon: Brain, color: '#A3E635' },
  short_break: { label: 'Short Break', duration: 5 * 60, icon: Coffee, color: '#38BDF8' },
  long_break: { label: 'Long Break', duration: 15 * 60, icon: Coffee, color: '#C084FC' },
  workout_prep: { label: 'Pre-Workout', duration: 10 * 60, icon: Dumbbell, color: '#F97316' },
};

export default function PomodoroScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const {
    currentMode,
    timerSettings,
    activeTaskTag,
    completedRoundsToday,
    totalFocusMinutesToday,
    ambientSound,
  } = useAppSelector((state) => state.productivity);

  const getDurationForMode = (m: FocusMode) => {
    switch (m) {
      case 'work':
        return timerSettings.workDuration * 60;
      case 'short_break':
        return timerSettings.shortBreakDuration * 60;
      case 'long_break':
        return timerSettings.longBreakDuration * 60;
      case 'workout_prep':
        return timerSettings.workoutPrepDuration * 60;
    }
  };

  const totalTime = getDurationForMode(currentMode);
  const [timeLeft, setTimeLeft] = useState<number>(totalTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>(activeTaskTag);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimeLeft(getDurationForMode(currentMode));
    setIsRunning(false);
  }, [currentMode, timerSettings]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    const durationMins = Math.round(totalTime / 60);

    dispatch(
      recordSession({
        id: `fs_${Date.now()}`,
        mode: currentMode,
        durationMinutes: durationMins,
        taskTag: tagInput,
        completedAt: new Date().toISOString(),
      })
    );

    // Auto-advance mode
    if (currentMode === 'work') {
      dispatch(setMode('short_break'));
    } else if (currentMode === 'short_break') {
      dispatch(setMode('work'));
    }
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const skipTimer = () => {
    setIsRunning(false);
    handleTimerComplete();
  };

  const switchMode = (newMode: FocusMode) => {
    dispatch(setMode(newMode));
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressRatio = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;

  const currentConfig = MODE_CONFIG[currentMode];

  return (
    <ScreenContainer scrollable={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mode Selector Tabs */}
        <View style={styles.modeTabBar}>
          {(Object.keys(MODE_CONFIG) as FocusMode[]).map((modeKey) => {
            const config = MODE_CONFIG[modeKey];
            const isSelected = currentMode === modeKey;
            return (
              <TouchableOpacity
                key={`mode-${modeKey}`}
                style={[
                  styles.modeTab,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.surfaceSecondary,
                  },
                ]}
                onPress={() => switchMode(modeKey)}
              >
                <Text
                  variant="caption"
                  color={
                    isSelected
                      ? theme.colors.textInverse
                      : theme.colors.textSecondary
                  }
                  style={styles.modeTabText}
                >
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Big Circular Timer Dial */}
        <View style={styles.timerRingSection}>
          <ProgressRingSvg
            progress={progressRatio}
            size={width * 0.72}
            strokeWidth={14}
            color={currentConfig.color}
            trackColor={theme.colors.surfaceSecondary}
          >
            <View style={styles.ringCenter}>
              <Text variant="caption" color={theme.colors.textSecondary}>
                {currentConfig.label.toUpperCase()}
              </Text>
              <Text variant="displayMedium" style={styles.timeDisplay}>
                {timeFormatted}
              </Text>
              <View style={styles.tagBadge}>
                <Text
                  variant="caption"
                  color={currentConfig.color}
                  numberOfLines={1}
                >
                  {tagInput || 'Deep Focus'}
                </Text>
              </View>
            </View>
          </ProgressRingSvg>
        </View>

        {/* Controls Row */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[
              styles.secondaryControlBtn,
              { backgroundColor: theme.colors.surfaceSecondary },
            ]}
            onPress={resetTimer}
          >
            <RotateCcw size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryPlayBtn,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={toggleTimer}
          >
            {isRunning ? (
              <Pause size={32} color={theme.colors.textInverse} />
            ) : (
              <Play size={32} color={theme.colors.textInverse} style={styles.playIcon} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryControlBtn,
              { backgroundColor: theme.colors.surfaceSecondary },
            ]}
            onPress={skipTimer}
          >
            <SkipForward size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Active Session Label Input */}
        <Card variant="default" style={styles.taskCard}>
          <View style={styles.taskCardHeader}>
            <Zap size={16} color={theme.colors.primary} />
            <Text variant="labelMedium" color={theme.colors.textSecondary}>
              Focus Intention / Target
            </Text>
          </View>
          <TextInput
            style={[
              styles.taskInput,
              {
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="e.g. Heavy Squat Visualization & Core Bracing"
            placeholderTextColor={theme.colors.textTertiary}
            value={tagInput}
            onChangeText={(txt) => {
              setTagInput(txt);
              dispatch(setActiveTaskTag(txt));
            }}
          />
        </Card>

        {/* Daily Productivity & Focus Stats */}
        <View style={styles.statsRow}>
          <Card variant="default" style={styles.statCard}>
            <Flame size={20} color={theme.colors.orange} />
            <Text variant="titleMedium" style={styles.statVal}>
              {completedRoundsToday}
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Rounds Done
            </Text>
          </Card>

          <Card variant="default" style={styles.statCard}>
            <Clock size={20} color={theme.colors.primary} />
            <Text variant="titleMedium" style={styles.statVal}>
              {totalFocusMinutesToday}m
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Time in Zone
            </Text>
          </Card>

          <Card variant="default" style={styles.statCard}>
            <Sparkles size={20} color={theme.colors.blue400} />
            <Text variant="titleMedium" style={styles.statVal}>
              4.8
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Focus Index
            </Text>
          </Card>
        </View>

        {/* Ambient Soundscape Mode */}
        <Card variant="default" style={styles.ambientCard}>
          <View style={styles.ambientHeader}>
            <Volume2 size={18} color={theme.colors.primary} />
            <Text variant="titleMedium" style={styles.ambientTitle}>
              Binaural & Ambient Sound
            </Text>
          </View>

          <View style={styles.ambientGrid}>
            {[
              { id: 'gym_focus', label: 'Gym Focus' },
              { id: 'alpha_waves', label: 'Alpha 432Hz' },
              { id: 'white_noise', label: 'Rain Noise' },
              { id: 'none', label: 'Mute' },
            ].map((amb) => {
              const isSelected = ambientSound === amb.id;
              return (
                <TouchableOpacity
                  key={`amb-${amb.id}`}
                  style={[
                    styles.ambientChip,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.surfaceSecondary,
                    },
                  ]}
                  onPress={() =>
                    dispatch(
                      setAmbientSound(
                        amb.id as 'none' | 'gym_focus' | 'alpha_waves' | 'white_noise'
                      )
                    )
                  }
                >
                  <Text
                    variant="caption"
                    color={
                      isSelected
                        ? theme.colors.textInverse
                        : theme.colors.textSecondary
                    }
                  >
                    {amb.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    gap: spacing[4],
  },
  modeTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[1.5],
  },
  modeTab: {
    flex: 1,
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modeTabText: {
    fontWeight: '600',
    fontSize: 11,
  },
  timerRingSection: {
    alignItems: 'center',
    marginVertical: spacing[2],
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: '800',
    marginVertical: spacing[1],
  },
  tagBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[6],
    marginVertical: spacing[2],
  },
  primaryPlayBtn: {
    width: 76,
    height: 76,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    marginLeft: 4,
  },
  secondaryControlBtn: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCard: {
    padding: spacing[3.5],
  },
  taskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
    marginBottom: spacing[2],
  },
  taskInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[2.5],
  },
  statCard: {
    flex: 1,
    padding: spacing[3],
    alignItems: 'center',
  },
  statVal: {
    marginVertical: spacing[1],
  },
  ambientCard: {
    padding: spacing[4],
  },
  ambientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  ambientTitle: {
    fontWeight: '600',
  },
  ambientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  ambientChip: {
    paddingHorizontal: spacing[3.5],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.md,
  },
  bottomSpacer: {
    height: spacing[12],
  },
});
