import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { storageService } from '../services/storageService';
import { useUserStats } from '../hooks/useUserStats';
import { useTrip } from '../hooks/useTrip';
import { eventEmitter, EVENTS } from '../utils/eventEmitter';
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

const PROGRESS_TARGETS = { maxWaste: 50, maxCO2: 100 };

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { userStats, loading: statsLoading, refreshStats } = useUserStats();
  const { activeTrip, startTrip, stopTrip, pauseTrip, resumeTrip, refreshActiveTrip } = useTrip();
  const styles = createStyles(colors);

  const [recentActions, setRecentActions] = useState<EcoActionData[]>([]);
  const [actionsLoading, setActionsLoading] = useState(true);
  const [showTripModal, setShowTripModal] = useState(false);

  const loadRecentActions = async () => {
    try {
      setActionsLoading(true);
      const actions = await storageService.getRecentActions(3);
      setRecentActions(Array.isArray(actions) ? actions : []);
    } catch (error) {
      console.error('Error loading recent actions:', error);
      setRecentActions([]);
    } finally {
      setActionsLoading(false);
    }
  };

  const refreshAllData = useCallback(async () => {
    await Promise.all([refreshStats(), refreshActiveTrip(), loadRecentActions()]);
  }, [refreshStats, refreshActiveTrip]);

  useEffect(() => {
    loadRecentActions();
  }, []);

  useEffect(() => {
    const unsubscribeActionLogged = eventEmitter.on(EVENTS.ACTION_LOGGED, refreshAllData);
    const unsubscribeTripUpdated = eventEmitter.on(EVENTS.TRIP_UPDATED, refreshActiveTrip);

    return () => {
      unsubscribeActionLogged();
      unsubscribeTripUpdated();
    };
  }, [refreshAllData, refreshActiveTrip]);

  useEffect(() => {
    if (!activeTrip) return;
    const interval = setInterval(refreshActiveTrip, 10000);
    return () => clearInterval(interval);
  }, [activeTrip, refreshActiveTrip]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const handleStartTrip = () => {
    if (activeTrip) return;
    setShowTripModal(true);
  };

  const handleTripUpdate = useCallback(async () => {
    await refreshAllData();
  }, [refreshAllData]);

  if (statsLoading || actionsLoading) {
    return <LoadingState message="Loading your impact..." />;
  }

  const safeUserStats = userStats || {
    totalActions: 0,
    ecoScore: 0,
    badgesEarned: 0,
    totalWasteCollected: 0,
    totalCO2Offset: 0,
    lastActionDate: null,
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <DashboardHeader
          totalActions={safeUserStats.totalActions}
          lastActionDate={safeUserStats.lastActionDate}
        />

        {activeTrip && (
          <ActiveTripCard
            trip={activeTrip}
            onStop={stopTrip}
            onPause={pauseTrip}
            onResume={resumeTrip}
            onTripUpdate={handleTripUpdate}
          />
        )}
        
        <AdventureCard
          totalActions={safeUserStats.totalActions}
          onStartTrip={handleStartTrip}
        />

        <StatsRow
          ecoScore={safeUserStats.ecoScore}
          badgesEarned={safeUserStats.badgesEarned}
        />

        <ImpactSection
          totalWasteCollected={safeUserStats.totalWasteCollected}
          totalCO2Offset={safeUserStats.totalCO2Offset}
          totalActions={safeUserStats.totalActions}
          progressTargets={PROGRESS_TARGETS}
        />

        <RecentActions actions={recentActions} />

        <AchievementProgress
          totalActions={safeUserStats.totalActions}
          ecoScore={safeUserStats.ecoScore}
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