import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TextStyle } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useAppTheme } from '@/hooks/use-app-theme';

const tabLabelStyle: TextStyle = {
  fontFamily: 'Montserrat_500Medium',
  fontSize: 12,
  marginTop: 2,
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
        tabBarActiveBackgroundColor: 'rgba(196, 181, 253, 0.28)',
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 4,
          marginVertical: 6,
          paddingTop: 6,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarLabelStyle: tabLabelStyle,
        tabBarStyle: {
          backgroundColor: colors.surfaceElevated,
          borderTopColor: colors.border,
          height: 78,
          paddingBottom: 10,
          paddingTop: 8,
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
          tabBarIcon: ({ color, size }) => <Ionicons name="folder-outline" size={size - 1} color={color} />,
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: 'All Todos',
          tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-done-outline" size={size - 1} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size - 1} color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size - 1} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size - 1} color={color} />,
        }}
      />
    </Tabs>
  );
}
