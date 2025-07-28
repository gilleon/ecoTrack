import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { MainTabScreen } from '../../types/navigation';
import { BottomTabNavigator } from './BottomTabNavigator';
import DashboardScreen from '../../screens/DashboardScreen';
import LogActionScreen from '../../screens/LogActionScreen';
import SettingsScreen from '../../screens/SettingsScreen';

interface MainAppNavigatorProps {
  onOpenSettings: () => void;
}

export const MainAppNavigator: React.FC<MainAppNavigatorProps> = ({
  onOpenSettings,
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
      case 'settings':
        return <SettingsScreen onBack={onOpenSettings} />;
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
});