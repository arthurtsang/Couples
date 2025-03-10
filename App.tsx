import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyIdeasScreen from './src/screens/MyIdeasScreen';
import PartnerIdeasScreen from './src/screens/PartnerIdeasScreen';
import PartnersScreen from './src/screens/PartnersScreen';
import { ThemeProvider, useTheme } from './src/ThemeContext';
import React from 'react';

const Tab = createBottomTabNavigator();

function AppContent() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: theme.tabBarBackground },
          tabBarActiveTintColor: theme.tabBarActive,
          tabBarInactiveTintColor: theme.text,
        }}
      >
        <Tab.Screen name="My Ideas" component={MyIdeasScreen} />
        <Tab.Screen name="Partner's Ideas" component={PartnerIdeasScreen} />
        <Tab.Screen name="Partners" component={PartnersScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}