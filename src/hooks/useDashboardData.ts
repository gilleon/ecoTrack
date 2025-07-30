import { useState, useCallback, useEffect } from 'react';
import { useUserStats } from './useUserStats';
import { useTrip } from './useTrip';
import { useHotReload } from './useHotReload';
import { storageService } from '../services/storageService';
import { eventEmitter, EVENTS } from '../utils/eventEmitter';
import { EcoActionData } from '../types';

export const useDashboardData = () => {
  const { userStats, loading: statsLoading, refreshStats } = useUserStats();
  const { activeTrip, startTrip, stopTrip, pauseTrip, resumeTrip, refreshActiveTrip } = useTrip();
  
  const [recentActions, setRecentActions] = useState<EcoActionData[]>([]);
  const [actionsLoading, setActionsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecentActions = useCallback(async () => {
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
  }, []);

  const refreshAllData = useCallback(async () => {
    await Promise.all([refreshStats(), refreshActiveTrip(), loadRecentActions()]);
  }, [refreshStats, refreshActiveTrip, loadRecentActions]);

  useHotReload({
    refreshStats,
    refreshTrips: refreshActiveTrip,
    refreshActions: loadRecentActions,
    debugLabel: 'DashboardData'
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAllData();
    setTimeout(() => setRefreshing(false), 500);
  }, [refreshAllData]);

  useEffect(() => {
    loadRecentActions();
  }, [loadRecentActions]);

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

  const safeUserStats = userStats || {
    totalActions: 0,
    ecoScore: 0,
    badgesEarned: 0,
    totalWasteCollected: 0,
    totalCO2Offset: 0,
    lastActionDate: null,
  };

  const isLoading = statsLoading || actionsLoading;

  return {
    userStats: safeUserStats,
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
  };
};