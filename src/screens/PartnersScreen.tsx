import { StyleSheet, Text, View, Button } from 'react-native';
import { useTheme } from '../ThemeContext';
import React from 'react';

export default function PartnersScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.title }]}>
        Partners (Coming Soon)
      </Text>
      <Button
        title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
        onPress={toggleTheme}
        color={theme.tabBarActive}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});