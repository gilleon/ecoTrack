import React from 'react';
import { AppScreen } from '../hooks/useAppState';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { MainContent } from '../components/MainContent';

interface AppNavigatorProps {
  currentScreen: AppScreen;
  onOnboardingComplete: () => void;
  onLogin: () => void;
  onDemoMode: () => void;
  onSignUp: () => void;
  onSignUpComplete: () => void;
  onBackToLogin: () => void;
  onOpenSettings: () => void;
  onGoBack: () => void;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({
  currentScreen,
  onOnboardingComplete,
  onLogin,
  onDemoMode,
  onSignUp,
  onSignUpComplete,
  onBackToLogin,
  onOpenSettings,
  onGoBack,
}) => {
  switch (currentScreen) {
    case 'onboarding':
      return <OnboardingScreen onComplete={onOnboardingComplete} />;
    case 'login':
      return (
        <LoginScreen
          onLogin={onLogin}
          onDemoMode={onDemoMode}
          onSignUp={onSignUp}
        />
      );
    case 'signup':
      return (
        <SignUpScreen
          onSignUp={onSignUpComplete}
          onBackToLogin={onBackToLogin}
        />
      );
    case 'main':
      return <MainContent onOpenSettings={onOpenSettings} />;
    case 'settings':
      return <SettingsScreen onBack={onGoBack} />;
    default:
      return <MainContent onOpenSettings={onOpenSettings} />;
  }
};