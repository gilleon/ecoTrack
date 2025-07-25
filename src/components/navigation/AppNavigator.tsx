import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppScreen } from '../../types/navigation';
import OnboardingScreen from '../../screens/OnboardingScreen';
import LoginScreen from '../../screens/LoginScreen';
import SignUpScreen from '../../screens/SignUpScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import { MainAppNavigator } from './MainAppNavigator';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const renderScreen = () => {
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
        return <MainAppNavigator onOpenSettings={onOpenSettings} />;
      case 'settings':
        return <SettingsScreen onBack={onGoBack} />;
      default:
        return <MainAppNavigator onOpenSettings={onOpenSettings} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });