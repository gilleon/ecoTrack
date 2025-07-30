import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';

interface UserStats {
  totalActions: number;
  ecoScore: number;
  badgesEarned: number;
  totalWasteCollected: number;
  totalCO2Offset: number;
  lastActionDate: string | null;
}

const DEFAULT_STATS: UserStats = {
  totalActions: 0,
  ecoScore: 0,
  badgesEarned: 0,
  totalWasteCollected: 0,
  totalCO2Offset: 0,
  lastActionDate: null,
};

export const useUserStats = () => {
  const [userStats, setUserStats] = useState<UserStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  const loadUserStats = useCallback(async () => {
    try {
      setLoading(true);
      const recentActions = await storageService.getRecentActions(1000);
      
      if (!Array.isArray(recentActions) || recentActions.length === 0) {
        setUserStats(DEFAULT_STATS);
        return;
      }
      
      const totalActions = recentActions.length;
      const totalCO2Offset = recentActions.reduce((total, action) => total + (action?.co2Offset || 0), 0);
      const totalWasteCollected = recentActions.reduce((total, action) => total + (action?.impact || 0), 0);

      setUserStats({
        totalActions,
        ecoScore: Math.round(totalCO2Offset * 10),
        badgesEarned: Math.floor(totalActions / 5),
        totalWasteCollected,
        totalCO2Offset,
        lastActionDate: recentActions[0]?.timestamp || null,
      });
    } catch (error) {
      setUserStats(DEFAULT_STATS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserStats();
  }, [loadUserStats]);

  return { 
    userStats, 
    loading, 
    refreshStats: loadUserStats 
  };
};