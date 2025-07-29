import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { MainTabScreen } from '../../types/navigation';
import { BottomTabNavigator } from './BottomTabNavigator';
import DashboardScreen from '../../screens/DashboardScreen';
import LogActionScreen from '../../screens/LogActionScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import SettingsScreen from '../../screens/SettingsScreen';

interface MainAppNavigatorProps {
  onOpenSettings: () => void;
  onLogout?: () => Promise<void>;
}

export const MainAppNavigator: React.FC<MainAppNavigatorProps> = ({
  onOpenSettings,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<MainTabScreen>('dashboard');
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleStartTrip = () => {
    console.log('Starting new trip...');
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen onStartTrip={handleStartTrip} />;
      case 'log':
        return <LogActionScreen onActionLogged={() => setActiveTab('dashboard')} />;
      case 'trips':
        return (
          <View style={styles.placeholderScreen}>
            <Text style={styles.placeholderText}>Trips Screen</Text>
            <Text style={styles.placeholderSubtext}>Coming Soon</Text>
          </View>
        );
      case 'profile':
        return <ProfileScreen onLogout={onLogout} />;
      case 'settings':
        return <SettingsScreen onBack={() => setActiveTab('dashboard')} />;
      default:
        return <DashboardScreen onStartTrip={handleStartTrip} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <BottomTabNavigator
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: colors.text,
  },
});