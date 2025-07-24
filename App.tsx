import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useAppState } from './hooks/useAppState';
import { AppContainer } from './components/AppContainer';
import { AppNavigator } from './navigation/AppNavigator';

export default function App() {
  const { currentScreen, completeOnboarding } = useAppState();

  return (
    <AppContainer>
      <AppNavigator
        currentScreen={currentScreen}
        onOnboardingComplete={completeOnboarding}
      />
      <StatusBar style="auto" />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
