import React from 'react';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { useAppState } from './src/hooks/useAppState';
import { AppContainer } from './src/components/ui/AppContainer';
import { AppNavigator } from './src/components/navigation/AppNavigator';

function AppContent() {
  const {
    currentScreen,
    completeOnboarding,
    handleLogin,
    handleDemoMode,
    handleSignUp,
    handleSignUpComplete,
    backToLogin,
    openSettings,
    goBack,
  } = useAppState();

  return (
    <AppContainer>
      <AppNavigator
        currentScreen={currentScreen}
        onOnboardingComplete={completeOnboarding}
        onLogin={handleLogin}
        onDemoMode={handleDemoMode}
        onSignUp={handleSignUp}
        onSignUpComplete={handleSignUpComplete}
        onBackToLogin={backToLogin}
        onOpenSettings={openSettings}
        onGoBack={goBack}
      />
    </AppContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
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
