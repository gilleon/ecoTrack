import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUnits } from '../contexts/UnitsContext';
import { storageService } from '../services/storageService';
import { UserStats } from '../types';
import { SettingsMenuItem } from '../components/settings/SettingsMenuItem';
import { SettingsSection } from '../components/settings/SettingsSection';
import { DashboardCard } from '../components/ui/DashboardCard';
import SettingsScreen from './SettingsScreen';

const INITIAL_STATS: UserStats = {
  totalActions: 0,
  totalWasteCollected: 0,
  totalCO2Offset: 0,
  ecoScore: 0,
  badgesEarned: 0,
  lastActionDate: null,
  lastUpdated: new Date().toISOString()
};

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { weightUnit, formatWeight } = useUnits();
  const styles = createStyles(colors);
  
  const [showSettings, setShowSettings] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const stats = await storageService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
  }

  const formatLastAction = (lastActionDate: string | null): string => {
    if (!lastActionDate) return 'No actions yet';
    
    const date = new Date(lastActionDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <MaterialIcons name="account-circle" size={80} color={colors.primary} />
          </View>
          <Text style={styles.userName}>Eco Warrior</Text>
          <Text style={styles.userEmail}>eco.warrior@example.com</Text>
        </View>

        {/* Stats Overview */}
        <DashboardCard title="Your Impact Summary" icon="eco" iconFamily="MaterialIcons">
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.totalActions}</Text>
              <Text style={styles.statLabel}>Total Actions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatWeight(userStats.totalWasteCollected)}</Text>
              <Text style={styles.statLabel}>Waste Collected</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.totalCO2Offset.toFixed(1)} kg</Text>
              <Text style={styles.statLabel}>CO₂ Offset</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userStats.ecoScore}</Text>
              <Text style={styles.statLabel}>Eco Score</Text>
            </View>
          </View>
        </DashboardCard>

        {/* Activity Summary */}
        <DashboardCard title="Activity" icon="timeline" iconFamily="MaterialIcons">
          <View style={styles.activitySection}>
            <View style={styles.activityItem}>
              <MaterialIcons name="today" size={20} color={colors.primary} />
              <Text style={styles.activityLabel}>Last Action</Text>
              <Text style={styles.activityValue}>
                {formatLastAction(userStats.lastActionDate)}
              </Text>
            </View>
            <View style={styles.activityItem}>
              <MaterialIcons name="emoji-events" size={20} color={colors.primary} />
              <Text style={styles.activityLabel}>Badges Earned</Text>
              <Text style={styles.activityValue}>{userStats.badgesEarned}</Text>
            </View>
          </View>
        </DashboardCard>

        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsMenuItem
            icon="person"
            title="Edit Profile"
            subtitle="Update your information"
            onPress={() => console.log('Edit profile')}
          />
          
          <SettingsMenuItem
            icon="privacy-tip"
            title="Privacy"
            subtitle="Control your data and privacy"
            onPress={() => console.log('Privacy')}
          />
        </SettingsSection>

        {/* App Section */}
        <SettingsSection title="App">
          <SettingsMenuItem
            icon="settings"
            title="Settings"
            subtitle="App preferences and configuration"
            onPress={() => setShowSettings(true)}
          />
          <SettingsMenuItem
            icon="help"
            title="Help & Support"
            subtitle="Get help with using EcoTrack"
            onPress={() => console.log('Help')}
          />
          <SettingsMenuItem
            icon="star"
            title="Rate App"
            subtitle="Share your feedback on the app store"
            onPress={() => console.log('Rate app')}
          />
        </SettingsSection>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 24,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activitySection: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  activityLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  activityValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bottomSpacing: {
    height: 20,
  },
});