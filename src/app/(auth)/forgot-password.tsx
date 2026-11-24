import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { spacing, borderRadius } from '../../theme';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={styles.safe}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>

        {isSent ? (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.successContainer}>
            <View style={[styles.successIcon, { backgroundColor: theme.colors.primaryMuted }]}>
              <CheckCircle2 size={44} color={theme.colors.primary} />
            </View>
            <Text variant="headlineMedium" color={theme.colors.textPrimary} align="center">
              Instructions Sent!
            </Text>
            <Text variant="bodySmall" color={theme.colors.textTertiary} align="center">
              Check your inbox for password reset instructions.
            </Text>
            <Button
              label="Return to Sign In"
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => router.push('/(auth)/login')}
              style={{ marginTop: spacing[4] }}
            />
          </Animated.View>
        ) : (
          <View>
            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.header}>
              <Text variant="displaySmall" color={theme.colors.textPrimary}>
                Reset Password
              </Text>
              <Text variant="bodyMedium" color={theme.colors.textTertiary} style={{ marginTop: spacing[1] }}>
                Enter your account email to receive reset instructions
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Account Email"
                    placeholder="you@domain.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.email?.message}
                    leftIcon={<Mail size={18} color={theme.colors.inputPlaceholder} />}
                  />
                )}
              />
              <Button
                label="Send Reset Instructions"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                onPress={handleSubmit(onSubmit)}
                style={{ marginTop: spacing[3] }}
              />
            </Animated.View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: spacing[5] },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[2],
    marginBottom: spacing[4],
  },
  header: { marginBottom: spacing[6] },
  form: { gap: spacing[3] },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
});
