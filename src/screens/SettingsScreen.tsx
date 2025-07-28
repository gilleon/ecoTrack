import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUnits } from '../contexts/UnitsContext';
import { storageService } from '../services/storageService';
import { SettingsSection } from '../components/settings/SettingsSection';
import { SettingsCard } from '../components/settings/SettingsCard';
import { SettingsMenuItem } from '../components/settings/SettingsMenuItem';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { UnitSelector } from '../components/settings/UnitSelector';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { colors, setThemeMode } = useTheme();
  const { setWeightUnit, setCarbonUnit } = useUnits();
  const styles = createStyles(colors);
  const [isClearing, setIsClearing] = useState(false);

  const resetContextsToDefaults = () => {
    setThemeMode('light');

    setWeightUnit('lb');

    setCarbonUnit('kg');
  };

  const handleDataClear = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your eco-actions and progress. This action cannot be undone.\n\nAre you absolutely sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: confirmDataClear,
        },
      ]
    );
  };

  const confirmDataClear = () => {
    Alert.alert(
      'Final Confirmation',
      'This is your last chance to cancel. All your eco-actions, progress, and statistics will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Delete Everything',
          style: 'destructive',
          onPress: performDataClear,
        },
      ]
    );
  };

  const performDataClear = async () => {
    setIsClearing(true);

    try {
      await storageService.clearAllData();

      resetContextsToDefaults();

      Alert.alert(
        'Data Cleared Successfully',
        'All your data has been permanently deleted. The app will now show as if you\'re starting fresh.',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsClearing(false);
              onBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error clearing data:', error);
      setIsClearing(false);

      Alert.alert(
        'Clear Data Failed',
        'There was an error clearing your data. Please try again or contact support if the problem persists.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={colors.primary}
          onPress={onBack}
        />
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SettingsSection title="Appearance">
          <SettingsCard
            title="Theme"
            description="Choose how EcoTrack looks on your device"
          >
            <ThemeSelector />
          </SettingsCard>
        </SettingsSection>

        <SettingsSection title="Units & Measurements">
          <SettingsCard
            title="Weight Units"
            description="Choose your preferred weight measurement system"
          >
            <UnitSelector />
          </SettingsCard>
        </SettingsSection>

        <SettingsSection title="Data & Privacy">
          <SettingsMenuItem
            icon="delete-forever"
            title={isClearing ? "Clearing Data..." : "Clear All Data"}
            subtitle={isClearing ? "Please wait..." : "Permanently delete all data"}
            onPress={isClearing ? () => {} : handleDataClear}
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsCard title="EcoTrack">
            <View style={styles.aboutContent}>
              <Text style={styles.aboutDescription}>
                Your companion for responsible outdoor adventures
              </Text>
              <View style={styles.versionRow}>
                <Text style={styles.versionLabel}>Version</Text>
                <Text style={styles.versionValue}>1.0.0</Text>
              </View>
            </View>
          </SettingsCard>
        </SettingsSection>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    aboutContent: {
      gap: 12,
    },
    aboutDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    versionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    versionLabel: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    versionValue: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    bottomSpacing: {
      height: 40,
    },
  });