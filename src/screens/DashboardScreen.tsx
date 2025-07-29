import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { storageService } from '../services/storageService';
import { useUserStats } from '../hooks/useUserStats';
import { useTrip } from '../hooks/useTrip';
import { EcoActionData } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { AdventureCard } from '../components/dashboard/AdventureCard';
import { StatsRow } from '../components/dashboard/StatsRow';
import { ImpactSection } from '../components/dashboard/ImpactSection';
import { RecentActions } from '../components/dashboard/RecentActions';
import { AchievementProgress } from '../components/dashboard/AchievementProgress';
import { TripStartModal } from '../components/trip/TripStartModal';
import { ActiveTripCard } from '../components/trip/ActiveTripCard';

interface DashboardScreenProps {
  onStartTrip: () => void;
}

const PROGRESS_TARGETS = { maxWaste: 50, maxCO2: 100 };

export default function DashboardScreen({ onStartTrip }: DashboardScreenProps) {
  const { colors } = useTheme();
  const { userStats, loading: statsLoading } = useUserStats();
  const { activeTrip, startTrip, stopTrip, pauseTrip, resumeTrip } = useTrip();
  const styles = createStyles(colors);

  const [recentActions, setRecentActions] = useState<EcoActionData[]>([]);
  const [actionsLoading, setActionsLoading] = useState(true);
  const [showTripModal, setShowTripModal] = useState(false);

  const loadRecentActions = async () => {
    try {
      setActionsLoading(true);
      const actions = await storageService.getRecentActions(3);
      setRecentActions(actions);
    } catch (error) {
      console.error('Error loading recent actions:', error);
    } finally {
      setActionsLoading(false);
    }
  };

  useEffect(() => {
    loadRecentActions();
  }, []);

  const handleStartTrip = () => {
    if (activeTrip) {
      // If there's an active trip, just close any modal
      return;
    }
    setShowTripModal(true);
  };

  if (statsLoading || actionsLoading) {
    return <LoadingState message="Loading your impact..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <DashboardHeader
          totalActions={userStats.totalActions}
          lastActionDate={userStats.lastActionDate}
        />

        {activeTrip && (
          <ActiveTripCard
            trip={activeTrip}
            onStop={stopTrip}
            onPause={pauseTrip}
            onResume={resumeTrip}
          />
        )}
        
        <AdventureCard
          totalActions={userStats.totalActions}
          onStartTrip={handleStartTrip}
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

      <TripStartModal
        visible={showTripModal}
        onClose={() => setShowTripModal(false)}
        onStartTrip={startTrip}
      />
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