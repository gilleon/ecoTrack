import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { useAppState } from './hooks/useAppState';
import { AppContainer } from './components/AppContainer';
import { AppNavigator } from './navigation/AppNavigator';

function AppContent() {
  const { currentScreen, completeOnboarding, openSettings, goBack } = useAppState();

  return (
    <AppContainer>
      <AppNavigator
        currentScreen={currentScreen}
        onOnboardingComplete={completeOnboarding}
        onOpenSettings={openSettings}
        onGoBack={goBack}
      />
    </AppContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
      <StatusBar style="auto" />
    </ThemeProvider>
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
