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
import { ScreenHeader } from '../components/common/ScreenHeader';
import { SettingsSection } from '../components/settings/SettingsSection';
import { SettingsCard } from '../components/settings/SettingsCard';
import { SettingsMenuItem } from '../components/settings/SettingsMenuItem';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { SettingsSwitch } from '../components/settings/SettingsSwitch';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'Export your eco-action data to share or backup.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Exporting data...') },
      ]
    );
  };

  const handleDataClear = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your eco-actions and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => console.log('Clearing data...'),
        },
      ]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Feedback',
      'Thank you for your interest! Feedback system coming soon.'
    );
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Need help? Contact us at support@ecotrack.app');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy details coming soon.');
  };

  const handleTerms = () => {
    Alert.alert('Terms of Service', 'Terms of service details coming soon.');
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

        <SettingsSection title="Notifications">
          <SettingsMenuItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Get reminders and achievements"
            onPress={() => {}}
            rightElement={
              <SettingsSwitch
                value={notifications}
                onValueChange={setNotifications}
              />
            }
            showArrow={false}
          />
        </SettingsSection>

        <SettingsSection title="Data & Privacy">
          <SettingsMenuItem
            icon="sync"
            title="Auto Sync"
            subtitle="Automatically sync your data"
            onPress={() => {}}
            rightElement={
              <SettingsSwitch
                value={autoSync}
                onValueChange={setAutoSync}
              />
            }
            showArrow={false}
          />
          <SettingsMenuItem
            icon="analytics"
            title="Usage Analytics"
            subtitle="Help improve EcoTrack"
            onPress={() => {}}
            rightElement={
              <SettingsSwitch
                value={analytics}
                onValueChange={setAnalytics}
              />
            }
            showArrow={false}
          />
          <SettingsMenuItem
            icon="file-download"
            title="Export Data"
            subtitle="Download your eco-action data"
            onPress={handleDataExport}
          />
          <SettingsMenuItem
            icon="delete-forever"
            title="Clear All Data"
            subtitle="Permanently delete all data"
            onPress={handleDataClear}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsMenuItem
            icon="feedback"
            title="Send Feedback"
            subtitle="Help us improve EcoTrack"
            onPress={handleFeedback}
          />
          <SettingsMenuItem
            icon="help"
            title="Help & Support"
            subtitle="Get help with using EcoTrack"
            onPress={handleSupport}
          />
          <SettingsMenuItem
            icon="bug-report"
            title="Report a Bug"
            subtitle="Let us know about issues"
            onPress={handleFeedback}
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
              <View style={styles.versionRow}>
                <Text style={styles.versionLabel}>Build</Text>
                <Text style={styles.versionValue}>2025.1.28</Text>
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