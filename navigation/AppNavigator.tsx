import React from 'react';
import { AppScreen } from '../hooks/useAppState';
import OnboardingScreen from '../screens/OnboardingScreen';
import { MainContent } from '../components/MainContent';

interface AppNavigatorProps {
  currentScreen: AppScreen;
  onOnboardingComplete: () => void;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({
  currentScreen,
  onOnboardingComplete,
}) => {
  switch (currentScreen) {
    case 'onboarding':
      return <OnboardingScreen onComplete={onOnboardingComplete} />;
    case 'main':
      return <MainContent />;
    default:
      return <MainContent />;
  }
};