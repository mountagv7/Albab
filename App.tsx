import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { FocusScreen } from './src/screens/FocusScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { Colors } from './src/theme/colors';
import { t } from './src/i18n';

const Tab = createBottomTabNavigator();

const NAV_ICONS: Record<string, { active: string; inactive: string }> = {
  Home:    { active: '⌂', inactive: '⌂' },
  Focus:   { active: '◉', inactive: '○' },
  Stats:   { active: '▦', inactive: '▤' },
  Profile: { active: '◉', inactive: '○' },
};

function TabBar({ state, descriptors, navigation }: any) {
  const labels = [t('navHome'), t('navFocus'), t('navStats'), t('navProfile')];
  const icons = ['🏠', '⏱', '📊', '👤'];

  return (
    <View style={tabStyles.bar}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            key={route.key}
            style={tabStyles.item}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <Text style={[tabStyles.icon, isFocused && tabStyles.iconActive]}>
              {icons[index]}
            </Text>
            <Text style={[tabStyles.label, isFocused && tabStyles.labelActive]}>
              {labels[index]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  const [onboarded, setOnboarded] = useState(false);

  if (!onboarded) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <OnboardingScreen onDone={() => setOnboarded(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          tabBar={(props) => <TabBar {...props} />}
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Focus" component={FocusScreen} />
          <Tab.Screen name="Stats" component={StatsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
  },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  icon: { fontSize: 20, opacity: 0.4 },
  iconActive: { opacity: 1 },
  label: { fontSize: 10, fontWeight: '500', color: Colors.textMuted },
  labelActive: { color: Colors.gold, fontWeight: '600' },
});
