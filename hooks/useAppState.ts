import { useState } from 'react';

export type AppScreen = 'onboarding' | 'main';

export const useAppState = (initialScreen: AppScreen = 'onboarding') => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(initialScreen);

  const navigateToScreen = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const completeOnboarding = () => {
    setCurrentScreen('main');
  };

  return {
    currentScreen,
    navigateToScreen,
    completeOnboarding,
    isOnboarding: currentScreen === 'onboarding',
    isMainApp: currentScreen === 'main',
  };
};