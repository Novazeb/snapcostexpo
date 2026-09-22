import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { triggerMediumHaptic } from '../../hooks/useHaptics';
import { SHADOWS } from '../../constants/theme';

export default function TabsLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Dynamic bottom padding to adapt seamlessly to gesture bar & 3-button navigation
  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 12);
  const tabHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 6,
          elevation: 2,
          shadowColor: colors.shadowColor,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: -0.1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analitik',
          tabBarIcon: ({ color, size }) => <Ionicons name="pie-chart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan Resi',
          tabBarButton: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Scan resi belanja"
              onPress={() => {
                triggerMediumHaptic();
                router.push('/(tabs)/scan');
              }}
              style={[
                styles.floatingScanBtn,
                {
                  backgroundColor: colors.scanBtnBg,
                  borderColor: colors.background,
                },
                SHADOWS.subtle,
              ]}
            >
              <Ionicons name="camera-outline" size={24} color={colors.scanBtnText} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Riwayat',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Pengaturan',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingScanBtn: {
    top: -16,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
});
