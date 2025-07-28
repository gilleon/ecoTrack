import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { storageService } from '../services/storageService';
import { UserStats, EcoActionData } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { AdventureCard } from '../components/dashboard/AdventureCard';
import { StatsRow } from '../components/dashboard/StatsRow';
import { ImpactSection } from '../components/dashboard/ImpactSection';
import { RecentActions } from '../components/dashboard/RecentActions';
import { AchievementProgress } from '../components/dashboard/AchievementProgress';

interface DashboardScreenProps {
  onStartTrip: () => void;
}

const INITIAL_STATS: UserStats = {
  totalActions: 0,
  totalWasteCollected: 0,
  totalCO2Offset: 0,
  ecoScore: 0,
  badgesEarned: 0,
  lastActionDate: null,
  lastUpdated: new Date().toISOString()
};

const PROGRESS_TARGETS = { maxWaste: 50, maxCO2: 100 };

export default function DashboardScreen({ onStartTrip }: DashboardScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [userStats, setUserStats] = useState<UserStats>(INITIAL_STATS);
  const [recentActions, setRecentActions] = useState<EcoActionData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = async () => {
    try {
      const [stats, actions] = await Promise.all([
        storageService.getUserStats(),
        storageService.getRecentActions(3)
      ]);
      setUserStats(stats);
      setRecentActions(actions);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
    const interval = setInterval(loadUserData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingState message="Loading your impact..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <DashboardHeader
          totalActions={userStats.totalActions}
          lastActionDate={userStats.lastActionDate}
        />
        
        <AdventureCard
          totalActions={userStats.totalActions}
          onStartTrip={onStartTrip}
        />

        <StatsRow
          ecoScore={userStats.ecoScore}
          badgesEarned={userStats.badgesEarned}
        />

        <ImpactSection
          totalWasteCollected={userStats.totalWasteCollected}
          totalCO2Offset={userStats.totalCO2Offset}
          totalActions={userStats.totalActions}
          progressTargets={PROGRESS_TARGETS}
        />

        <RecentActions actions={recentActions} />

        <AchievementProgress
          totalActions={userStats.totalActions}
          ecoScore={userStats.ecoScore}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});