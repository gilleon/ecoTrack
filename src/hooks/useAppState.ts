import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { AppScreen } from '../types/navigation';

export const useAppState = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('loading');
  const { user, isInitializing } = useAuth();

  useEffect(() => {
    initializeApp();
  }, [isInitializing, user]);

  const initializeApp = async () => {
    if (isInitializing) return;

    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      
      if (onboardingCompleted !== 'true') {
        setCurrentScreen('onboarding');
        return;
      }

      if (user) {
        setCurrentScreen('main');
      } else {
        setCurrentScreen('login');
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      setCurrentScreen('onboarding');
    }
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
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
    setCurrentScreen('main');
  };

  return {
    currentScreen,
    completeOnboarding,
    handleLogin,
    handleDemoMode,
    handleSignUp,
    handleSignUpComplete,
    backToLogin,
    openSettings,
    goBack,
  };
};