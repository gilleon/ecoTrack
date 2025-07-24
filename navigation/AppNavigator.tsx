import React from 'react';
import { AppScreen } from '../hooks/useAppState';
import OnboardingScreen from '../screens/OnboardingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { MainContent } from '../components/MainContent';

interface AppNavigatorProps {
  currentScreen: AppScreen;
  onOnboardingComplete: () => void;
  onOpenSettings: () => void;
  onGoBack: () => void;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({
  currentScreen,
  onOnboardingComplete,
  onOpenSettings,
  onGoBack,
}) => {
  switch (currentScreen) {
    case 'onboarding':
      return <OnboardingScreen onComplete={onOnboardingComplete} />;
    case 'main':
      return <MainContent onOpenSettings={onOpenSettings} />;
    case 'settings':
      return <SettingsScreen onBack={onGoBack} />;
    default:
      return <MainContent onOpenSettings={onOpenSettings} />;
  }
};