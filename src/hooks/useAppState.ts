import { useState } from 'react';
import { AppScreen } from '../types/navigation';

export const useAppState = (initialScreen: AppScreen = 'onboarding') => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(initialScreen);

  const navigateToScreen = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const completeOnboarding = () => {
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    setCurrentScreen('main');
  };

  const handleDemoMode = () => {
    setCurrentScreen('main');
  };

  const handleSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleSignUpComplete = () => {
    setCurrentScreen('main');
  };

  const backToLogin = () => {
    setCurrentScreen('login');
  };

  const openSettings = () => {
    setCurrentScreen('settings');
  };

  const goBack = () => {
    if (currentScreen === 'settings') {
      setCurrentScreen('main');
    } else if (currentScreen === 'login') {
      setCurrentScreen('onboarding');
    } else if (currentScreen === 'signup') {
      setCurrentScreen('login');
    }
  };

  return {
    currentScreen,
    navigateToScreen,
    completeOnboarding,
    handleLogin,
    handleDemoMode,
    handleSignUp,
    handleSignUpComplete,
    backToLogin,
    openSettings,
    goBack,
    isOnboarding: currentScreen === 'onboarding',
    isLogin: currentScreen === 'login',
    isSignUp: currentScreen === 'signup',
    isMainApp: currentScreen === 'main',
    isSettings: currentScreen === 'settings',
  };
};