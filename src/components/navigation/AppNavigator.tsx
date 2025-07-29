import React from 'react';
import OnboardingScreen from '../../screens/OnboardingScreen';
import LoginScreen from '../../screens/LoginScreen';
import SignUpScreen from '../../screens/SignUpScreen';
import { MainAppNavigator } from './MainAppNavigator';
import { AppScreen } from '../../types/navigation';

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
  onLogout: () => Promise<void>;
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
  onLogout,
}) => {
  switch (currentScreen) {
    case 'loading':
      return null;

    case 'onboarding':
      return <OnboardingScreen onComplete={onOnboardingComplete} />;

    case 'login':
      return (
        <LoginScreen
          onLogin={onLogin}
          onSignUp={onSignUp}
          onDemoMode={onDemoMode}
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
      return (
        <MainAppNavigator
          onOpenSettings={onOpenSettings}
          onLogout={onLogout}
        />
      );

    case 'settings':
      return (
        <MainAppNavigator
          onOpenSettings={onOpenSettings}
          onLogout={onLogout}
        />
      );

    default:
      return <LoginScreen onLogin={onLogin} onSignUp={onSignUp} onDemoMode={onDemoMode} />;
  }
};