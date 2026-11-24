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
  Scale,
  Percent,
  Ruler,
  Calendar,
  CheckCircle2,
  FileText,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAppDispatch } from '../../store';
import { addMeasurement } from '../../features/transformation/store/transformationSlice';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { spacing, borderRadius } from '../../theme';

export default function LogMeasurementScreen() {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [leftArm, setLeftArm] = useState('');
  const [rightArm, setRightArm] = useState('');
  const [leftThigh, setLeftThigh] = useState('');
  const [rightThigh, setRightThigh] = useState('');
  const [hips, setHips] = useState('');
  const [neck, setNeck] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!weight && !waist && !chest) {
      Alert.alert(
        'Missing Values',
        'Please enter at least your weight or key circumference measurements.'
      );
      return;
    }

    dispatch(
      addMeasurement({
        id: `m_${Date.now()}`,
        date,
        weight: weight ? parseFloat(weight) : undefined,
        weightUnit: 'kg',
        bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
        waist: waist ? parseFloat(waist) : undefined,
        chest: chest ? parseFloat(chest) : undefined,
        leftArm: leftArm ? parseFloat(leftArm) : undefined,
        rightArm: rightArm ? parseFloat(rightArm) : undefined,
        leftThigh: leftThigh ? parseFloat(leftThigh) : undefined,
        rightThigh: rightThigh ? parseFloat(rightThigh) : undefined,
        hips: hips ? parseFloat(hips) : undefined,
        neck: neck ? parseFloat(neck) : undefined,
        unit: 'cm',
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
          Key Body Composition
        </Text>

        <View style={styles.twoColumn}>
          {/* Weight */}
          <Card variant="default" style={styles.inputCard}>
            <View style={styles.inputLabelRow}>
              <Scale size={16} color={theme.colors.primary} />
              <Text variant="caption" color={theme.colors.textSecondary}>
                Weight (kg)
              </Text>
            </View>
            <TextInput
              style={[
                styles.numericInput,
                {
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="78.5"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={setWeight}
            />
          </Card>

          {/* Body Fat % */}
          <Card variant="default" style={styles.inputCard}>
            <View style={styles.inputLabelRow}>
              <Percent size={16} color={theme.colors.blue400} />
              <Text variant="caption" color={theme.colors.textSecondary}>
                Body Fat (%)
              </Text>
            </View>
            <TextInput
              style={[
                styles.numericInput,
                {
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="16.5"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="decimal-pad"
              value={bodyFat}
              onChangeText={setBodyFat}
            />
          </Card>
        </View>

        <Text variant="titleMedium" style={styles.sectionHeader}>
          Circumference Tape Measurements (cm)
        </Text>

        {/* Waist & Chest */}
        <View style={styles.twoColumn}>
          <Card variant="default" style={styles.inputCard}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Waist (at navel)
            </Text>
            <TextInput
              style={[
                styles.numericInput,
                {
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="82.0"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="decimal-pad"
              value={waist}
              onChangeText={setWaist}
            />
          </Card>

          <Card variant="default" style={styles.inputCard}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Chest (mid-pec)
            </Text>
            <TextInput
              style={[
                styles.numericInput,
                {
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="105.0"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="decimal-pad"
              value={chest}
              onChangeText={setChest}
            />
          </Card>
        </View>

        {/* Arms */}
        <View style={styles.twoColumn}>
          <Card variant="default" style={styles.inputCard}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Right Bicep (flexed)
            </Text>
            <TextInput
              style={[
                styles.numericInput,
                {
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="38.5"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="decimal-pad"
              value={rightArm}
              onChangeText={setRightArm}
            />
          </Card>

          <Card variant="default" style={styles.inputCard}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Left Bicep (flexed)
            </Text>
            <TextInput
              style={[
                styles.numericInput,
                {
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="38.0"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="decimal-pad"
              value={leftArm}
              onChangeText={setLeftArm}
            />
          </Card>
        </View>

        {/* Thighs & Hips */}
        <View style={styles.twoColumn}>
          <Card variant="default" style={styles.inputCard}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Thighs
            </Text>
            <TextInput
              style={[
                styles.numericInput,
                {
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="60.0"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="decimal-pad"
              value={rightThigh}
              onChangeText={setRightThigh}
            />
          </Card>

          <Card variant="default" style={styles.inputCard}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Hips
            </Text>
            <TextInput
              style={[
                styles.numericInput,
                {
                  color: theme.colors.textPrimary,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="96.0"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="decimal-pad"
              value={hips}
              onChangeText={setHips}
            />
          </Card>
        </View>

        {/* Notes */}
        <Card variant="default" style={styles.notesCard}>
          <View style={styles.inputLabelRow}>
            <FileText size={16} color={theme.colors.textSecondary} />
            <Text variant="caption" color={theme.colors.textSecondary}>
              Notes & Conditioning
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
            placeholder="e.g. Taken fasted in the morning, lower carb day"
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </Card>

        <Button
          label="Save Log Entry"
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
  numericInput: {
    height: 48,
    fontSize: 20,
    fontWeight: '700',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[3],
  },
  notesCard: {
    padding: spacing[3],
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
