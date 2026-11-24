import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  Moon,
  Clock,
  Heart,
  Star,
  FileText,
  CheckCircle2,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAppDispatch } from '../../store';
import { logSleepRecord } from '../../features/sleep/store/sleepSlice';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { spacing, borderRadius } from '../../theme';

export default function LogSleepScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [durationHours, setDurationHours] = useState('8.0');
  const [qualityStars, setQualityStars] = useState<number>(4);
  const [heartRate, setHeartRate] = useState('54');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    const hours = parseFloat(durationHours) || 8;
    const durationMins = Math.round(hours * 60);
    const deepMins = Math.round(durationMins * 0.22);
    const remMins = Math.round(durationMins * 0.23);
    const lightMins = Math.round(durationMins * 0.48);
    const awakeMins = durationMins - (deepMins + remMins + lightMins);

    const qualityScore = qualityStars * 20; // 5 stars = 100
    const hr = parseInt(heartRate, 10) || 55;
    // Readiness: blend of duration, quality, and low resting heart rate
    const readinessScore = Math.min(
      98,
      Math.max(50, Math.round(qualityScore * 0.6 + (hours / 8) * 30 + (65 - hr)))
    );

    dispatch(
      logSleepRecord({
        id: `sl_${Date.now()}`,
        date,
        bedtime,
        wakeTime,
        durationMinutes: durationMins,
        deepSleepMinutes: deepMins,
        remSleepMinutes: remMins,
        lightSleepMinutes: lightMins,
        awakeMinutes: Math.max(15, awakeMins),
        qualityScore,
        readinessScore,
        restingHeartRate: hr,
        notes: notes.trim() || undefined,
      })
    );

    router.back();
  };

  return (
    <ScreenContainer scrollable={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text variant="titleMedium" style={styles.sectionHeader}>
          Sleep Timing & Duration
        </Text>

        <View style={styles.twoColumn}>
          <Card variant="default" style={styles.inputCard}>
            <View style={styles.inputLabelRow}>
              <Clock size={16} color={theme.colors.blue400} />
              <Text variant="caption" color={theme.colors.textSecondary}>
                Bedtime (24h)
              </Text>
            </View>
            <TextInput
              style={[
                styles.timeInput,
                {
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="23:00"
              placeholderTextColor={theme.colors.textTertiary}
              value={bedtime}
              onChangeText={setBedtime}
            />
          </Card>

          <Card variant="default" style={styles.inputCard}>
            <View style={styles.inputLabelRow}>
              <Clock size={16} color={theme.colors.primary} />
              <Text variant="caption" color={theme.colors.textSecondary}>
                Wake Time (24h)
              </Text>
            </View>
            <TextInput
              style={[
                styles.timeInput,
                {
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="07:00"
              placeholderTextColor={theme.colors.textTertiary}
              value={wakeTime}
              onChangeText={setWakeTime}
            />
          </Card>
        </View>

        <Card variant="default" style={styles.durationCard}>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Total Time Asleep (Hours)
          </Text>
          <TextInput
            style={[
              styles.bigNumericInput,
              {
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="8.0"
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType="decimal-pad"
            value={durationHours}
            onChangeText={setDurationHours}
          />
        </Card>

        {/* Quality Rating Stars */}
        <Card variant="default" style={styles.qualityCard}>
          <Text variant="caption" color={theme.colors.textSecondary} style={styles.mb2}>
            Perceived Sleep Quality
          </Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={`star-${star}`}
                onPress={() => setQualityStars(star)}
                style={styles.starBtn}
              >
                <Star
                  size={32}
                  color={
                    star <= qualityStars
                      ? theme.colors.warning
                      : theme.colors.surfaceSecondary
                  }
                  fill={
                    star <= qualityStars
                      ? theme.colors.warning
                      : 'transparent'
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Resting Heart Rate */}
        <Card variant="default" style={styles.hrCard}>
          <View style={styles.inputLabelRow}>
            <Heart size={16} color={theme.colors.error} />
            <Text variant="caption" color={theme.colors.textSecondary}>
              Morning Resting Heart Rate (bpm)
            </Text>
          </View>
          <TextInput
            style={[
              styles.timeInput,
              {
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="54"
            placeholderTextColor={theme.colors.textTertiary}
            keyboardType="number-pad"
            value={heartRate}
            onChangeText={setHeartRate}
          />
        </Card>

        {/* Notes */}
        <Card variant="default" style={styles.notesCard}>
          <View style={styles.inputLabelRow}>
            <FileText size={16} color={theme.colors.textSecondary} />
            <Text variant="caption" color={theme.colors.textSecondary}>
              Notes (Supplements, Environment, Fatigue)
            </Text>
          </View>
          <TextInput
            style={[
              styles.notesInput,
              {
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="e.g. Magnesium Glycinate taken, cold room (18C)"
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </Card>

        <Button
          label="Save Sleep Record"
          size="lg"
          variant="primary"
          onPress={handleSave}
          leftIcon={<CheckCircle2 size={18} color={theme.colors.textInverse} />}
          style={styles.saveBtn}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    gap: spacing[3],
  },
  sectionHeader: {
    marginTop: spacing[2],
    marginBottom: spacing[1],
  },
  twoColumn: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  inputCard: {
    flex: 1,
    padding: spacing[3],
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
    marginBottom: spacing[1.5],
  },
  timeInput: {
    height: 48,
    fontSize: 18,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
  },
  durationCard: {
    padding: spacing[3.5],
  },
  bigNumericInput: {
    height: 52,
    fontSize: 24,
    fontWeight: '800',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
    marginTop: spacing[1.5],
  },
  qualityCard: {
    padding: spacing[3.5],
    alignItems: 'center',
  },
  mb2: {
    marginBottom: spacing[2],
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  starBtn: {
    padding: spacing[1],
  },
  hrCard: {
    padding: spacing[3.5],
  },
  notesCard: {
    padding: spacing[3.5],
  },
  notesInput: {
    minHeight: 70,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing[3],
    textAlignVertical: 'top',
    marginTop: spacing[1.5],
  },
  saveBtn: {
    marginTop: spacing[3],
  },
  bottomSpacer: {
    height: spacing[10],
  },
});
