import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useDashboardData } from '../hooks/useDashboardData';
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
  const {
    userStats,
    activeTrip,
    recentActions,
    isLoading,
    refreshing,
    handleRefresh,
    refreshAllData,
    startTrip,
    stopTrip,
    pauseTrip,
    resumeTrip,
  } = useDashboardData();

  const [showTripModal, setShowTripModal] = useState(false);
  const styles = createStyles(colors);

  const handleStartTrip = () => {
    if (activeTrip) return;
    setShowTripModal(true);
  };

  const handleTripUpdate = useCallback(async () => {
    await refreshAllData();
  }, [refreshAllData]);

  if (isLoading) {
    return <LoadingState message="Loading your impact..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
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
            onTripUpdate={handleTripUpdate}
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