import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

interface HotReloadOptions {
  refreshStats?: () => Promise<void> | void;
  refreshTrips?: () => Promise<void> | void;
  refreshActions?: () => Promise<void> | void;
  refreshProfile?: () => Promise<void> | void;
  customRefresh?: () => Promise<void> | void;
  debugLabel?: string;
}

export const useHotReload = (options: HotReloadOptions) => {
  const {
    refreshStats,
    refreshTrips,
    refreshActions,
    refreshProfile,
    customRefresh,
    debugLabel = 'Component'
  } = options;

  useFocusEffect(
    useCallback(() => {
      const executeRefresh = async () => {
        
        try {
          const refreshPromises = [];
          
          if (refreshStats) refreshPromises.push(Promise.resolve(refreshStats()));
          if (refreshTrips) refreshPromises.push(Promise.resolve(refreshTrips()));
          if (refreshActions) refreshPromises.push(Promise.resolve(refreshActions()));
          if (refreshProfile) refreshPromises.push(Promise.resolve(refreshProfile()));
          if (customRefresh) refreshPromises.push(Promise.resolve(customRefresh()));
          
          await Promise.all(refreshPromises);
        } catch (error) {
          console.error(`${debugLabel} refresh error:`, error);
        }
      };

      executeRefresh();
    }, [refreshStats, refreshTrips, refreshActions, refreshProfile, customRefresh, debugLabel])
  );
};