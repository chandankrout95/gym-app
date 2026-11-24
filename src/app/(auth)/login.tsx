import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Divider } from '../../components/ui/Divider';
import { spacing, borderRadius } from '../../theme';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'alex.fitness@fitverse.app', password: 'password123' },
  });

  const onSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>

            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.header}>
              <Text variant="displaySmall" color={theme.colors.textPrimary}>
                Welcome back
              </Text>
              <Text variant="bodyMedium" color={theme.colors.textTertiary} style={{ marginTop: spacing[1] }}>
                Sign in to synchronize your metrics and workouts
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email Address"
                    placeholder="you@fitverse.app"
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

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Enter password"
                    secureTextEntry={!showPassword}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    error={errors.password?.message}
                    leftIcon={<Lock size={18} color={theme.colors.inputPlaceholder} />}
                    rightIcon={
                      showPassword ? (
                        <EyeOff size={18} color={theme.colors.inputPlaceholder} />
                      ) : (
                        <Eye size={18} color={theme.colors.inputPlaceholder} />
                      )
                    }
                    onRightIconPress={() => setShowPassword(!showPassword)}
                  />
                )}
              />

              <TouchableOpacity
                style={styles.forgotBtn}
                onPress={() => router.push('/(auth)/forgot-password')}
              >
                <Text variant="labelSmall" color={theme.colors.primary}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <Button
                label="Sign In"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                onPress={handleSubmit(onSubmit)}
                style={{ marginTop: spacing[2] }}
              />
            </Animated.View>

            <View style={styles.footer}>
              <Divider label="OR" />
              <View style={styles.registerRow}>
                <Text variant="bodySmall" color={theme.colors.textSecondary}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                  <Text variant="labelSmall" color={theme.colors.primary}>
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  form: { gap: spacing[4] },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -4 },
  footer: { marginTop: spacing[8], gap: spacing[5] },
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
