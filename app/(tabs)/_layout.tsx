import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextStyle } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useAppTheme } from '@/hooks/use-app-theme';

const tabLabelStyle: TextStyle = {
  fontFamily: 'Inconsolata_600SemiBold',
  fontSize: 11,
  marginTop: 1,
};

export default function TabLayout() {
  const colors = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#F8FAFC',
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveBackgroundColor: 'rgba(196, 181, 253, 0.22)',
        tabBarItemStyle: {
          borderRadius: 16,
          marginHorizontal: 2,
          marginVertical: 7,
          paddingTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 1,
        },
        tabBarLabelStyle: tabLabelStyle,
        tabBarStyle: {
          backgroundColor: colors.surfaceElevated,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 74,
          paddingBottom: 9,
          paddingHorizontal: 4,
          paddingTop: 6,
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
          tabBarIcon: ({ color, size }) => <Ionicons name="folder-outline" size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: 'All Todos',
          tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-done-outline" size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size - 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size - 2} color={color} />,
        }}
      />
    </Tabs>
  );
}
