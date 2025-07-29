import React from 'react';
import { useAppState } from '../hooks/useAppState';
import { AppContainer } from './ui/AppContainer';
import { AppNavigator } from './navigation/AppNavigator';

export default function AppContent() {
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
    handleLogout,
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
        onLogout={handleLogout}
      />
    </AppContainer>
  );
}