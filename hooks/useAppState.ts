import { useState } from 'react';

export type AppScreen = 'onboarding' | 'main' | 'settings';

export const useAppState = (initialScreen: AppScreen = 'onboarding') => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(initialScreen);

  const navigateToScreen = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const completeOnboarding = () => {
    setCurrentScreen('main');
  };

  const openSettings = () => {
    setCurrentScreen('settings');
  };

  const goBack = () => {
    if (currentScreen === 'settings') {
      setCurrentScreen('main');
    }
  };

  return {
    currentScreen,
    navigateToScreen,
    completeOnboarding,
    openSettings,
    goBack,
    isOnboarding: currentScreen === 'onboarding',
    isMainApp: currentScreen === 'main',
    isSettings: currentScreen === 'settings',
  };
};