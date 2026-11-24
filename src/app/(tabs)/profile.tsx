import React from 'react';
import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import {
  Shield,
  Bell,
  Moon,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Target,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../store';
import { logout } from '../../features/auth/store/authSlice';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { spacing, borderRadius } from '../../theme';

interface SettingItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  value?: string;
}

interface SettingGroup {
  title: string;
  items: SettingItem[];
}

export default function ProfileTab() {
  const { theme, isDark, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)/welcome');
  };

  const settingsGroups: SettingGroup[] = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'theme',
          label: 'Dark Mode',
          icon: <Moon size={20} color={theme.colors.primary} />,
          isSwitch: true,
          switchValue: isDark,
          onSwitchChange: () => toggleTheme(),
        },
        {
          id: 'notifications',
          label: 'Notification Reminders',
          icon: <Bell size={20} color={theme.colors.blue400} />,
          value: 'Enabled',
        },
        {
          id: 'units',
          label: 'Units & Measurements',
          icon: <Target size={20} color={theme.colors.orange} />,
          value: 'Metric (kg, cm)',
        },
      ],
    },
    {
      title: 'Account & Membership',
      items: [
        {
          id: 'subscription',
          label: 'FITVERSE Pro Tier',
          icon: <Sparkles size={20} color={theme.colors.primary} />,
          value: 'Active',
        },
        {
          id: 'privacy',
          label: 'Privacy & Data Controls',
          icon: <Shield size={20} color={theme.colors.success} />,
        },
        {
          id: 'billing',
          label: 'Payment & Billing History',
          icon: <CreditCard size={20} color={theme.colors.purple400} />,
        },
        {
          id: 'support',
          label: 'Help & Concierge Support',
          icon: <HelpCircle size={20} color={theme.colors.textTertiary} />,
        },
      ],
    },
  ];

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text variant="caption" color={theme.colors.textTertiary} style={styles.eyebrow}>
          ACCOUNT SETTINGS & PROFILE
        </Text>
        <Text variant="headlineLarge" color={theme.colors.textPrimary} style={{ fontWeight: '900' }}>
          Profile
        </Text>
      </View>

      {/* User Info Card */}
      <Card padding={4} style={[styles.userCard, { marginTop: spacing[4] }]}>
        <View style={styles.userTop}>
          <Avatar name={user?.fullName ?? 'Alex Vance'} size="xl" online />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={styles.nameRow}>
              <Text variant="titleLarge" color={theme.colors.textPrimary} style={{ fontWeight: '800' }}>
                {user?.fullName ?? 'Alex Vance'}
              </Text>
              <Badge label="PRO" variant="primary" size="sm" />
            </View>
            <Text variant="bodySmall" color={theme.colors.textTertiary}>
              {user?.email ?? 'alex.fitness@fitverse.app'}
            </Text>
            <Text variant="caption" color={theme.colors.primary} style={{ marginTop: 2, fontWeight: '600' }}>
              Goal: Muscle Building • 78.5 kg
            </Text>
          </View>
        </View>
      </Card>

      {/* Settings Groups */}
      <View style={{ gap: spacing[5], marginTop: spacing[5] }}>
        {settingsGroups.map((group) => (
          <View key={group.title}>
            <Text variant="labelSmall" color={theme.colors.textTertiary} style={styles.groupHeader}>
              {group.title.toUpperCase()}
            </Text>

            <Card padding={2} style={styles.groupCard}>
              {group.items.map((item, idx) => (
                <View
                  key={item.id}
                  style={[
                    styles.itemRow,
                    idx < group.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                >
                  <View style={styles.itemLeft}>
                    <View style={[styles.itemIcon, { backgroundColor: theme.colors.surfaceSecondary }]}>
                      {item.icon}
                    </View>
                    <Text variant="bodySmall" color={theme.colors.textPrimary} style={{ fontWeight: '600' }}>
                      {item.label}
                    </Text>
                  </View>

                  {item.isSwitch ? (
                    <Switch
                      value={item.switchValue}
                      onValueChange={item.onSwitchChange}
                      trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                      thumbColor={theme.colors.white}
                    />
                  ) : (
                    <View style={styles.itemRight}>
                      {item.value && (
                        <Text variant="caption" color={theme.colors.textTertiary}>
                          {item.value}
                        </Text>
                      )}
                      <ChevronRight size={18} color={theme.colors.textTertiary} />
                    </View>
                  )}
                </View>
              ))}
            </Card>
          </View>
        ))}
      </View>

      {/* Logout Action */}
      <TouchableOpacity
        style={[styles.logoutBtn, { borderColor: theme.colors.error, marginTop: spacing[6], marginBottom: spacing[8] }]}
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <LogOut size={18} color={theme.colors.error} />
        <Text variant="labelSmall" color={theme.colors.error} style={{ fontWeight: '700' }}>
          Sign Out of FITVERSE
        </Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing[4],
  },
  eyebrow: {
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  userCard: {
    borderRadius: borderRadius.xl,
  },
  userTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  groupHeader: {
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: spacing[2],
    paddingHorizontal: spacing[1],
  },
  groupCard: {
    borderRadius: borderRadius.xl,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3.5],
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
  },
});
