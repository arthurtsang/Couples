import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyIdeasScreen from './src/screens/MyIdeasScreen';
import PartnerIdeasScreen from './src/screens/PartnerIdeasScreen';
import PartnersScreen from './src/screens/PartnersScreen';
import { ThemeProvider, useTheme } from './src/ThemeContext';
import { PartnerProvider, usePartner } from './src/PartnerContext';
import { LIGHT_THEME } from './src/theme/light'; // Import default theme

const Tab = createBottomTabNavigator();

function AppContent() {
  const { theme = LIGHT_THEME } = useTheme(); // Default to LIGHT_THEME if undefined
  const { selectedPartner } = usePartner();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Partners"
        screenOptions={{
          tabBarStyle: { backgroundColor: theme.tabBarBackground },
          tabBarActiveTintColor: theme.tabBarActive,
          tabBarInactiveTintColor: theme.text,
        }}
      >
        <Tab.Screen
          name="My Ideas"
          component={MyIdeasScreen}
          options={{ tabBarButton: () => (selectedPartner ? undefined : null) }}
        />
        <Tab.Screen
          name="Partner's Ideas"
          component={PartnerIdeasScreen}
          options={{ tabBarButton: () => (selectedPartner ? undefined : null) }}
        />
        <Tab.Screen name="Partners" component={PartnersScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PartnerProvider>
        <AppContent />
      </PartnerProvider>
    </ThemeProvider>
  );
}