import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Text, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { AppFonts } from '@/constants/fonts';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function TabLayout() {
  const colors = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const compact = width < 390;
  const labelSize = width < 360 ? 9.5 : compact ? 10.5 : 11.5;
  const iconSize = width < 360 ? 20 : 22;
  const horizontalPadding = width < 360 ? 4 : compact ? 6 : 8;
  const bottomPadding = Math.max(insets.bottom, 9);
  const tabBarHeight = 54 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarItemStyle: {
          alignItems: 'center',
          borderRadius: 999,
          flex: 1,
          justifyContent: 'center',
          marginHorizontal: 2,
          marginVertical: 4,
          maxWidth: 88,
          minWidth: 0,
          paddingHorizontal: 2,
          paddingVertical: 0,
        },
        tabBarIconStyle: {
          marginBottom: 1,
          marginTop: -1,
        },
        tabBarLabel: ({ color, children }) => (
          <Text
            numberOfLines={1}
            style={{
              color,
              fontFamily: AppFonts.semibold,
              fontSize: labelSize,
              includeFontPadding: false,
              lineHeight: labelSize + 2,
              textAlign: 'center',
            }}>
            {children}
          </Text>
        ),
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: colors.surfaceElevated,
          borderTopColor: colors.border,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 1,
          elevation: 0,
          height: tabBarHeight,
          paddingBottom: bottomPadding,
          paddingHorizontal: horizontalPadding,
          paddingTop: 1,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <Ionicons name="folder-outline" size={iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: 'All Todos',
          tabBarIcon: ({ color }) => <Ionicons name="checkmark-done-outline" size={iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={iconSize} color={color} />,
        }}
      />
    </Tabs>
  );
}
