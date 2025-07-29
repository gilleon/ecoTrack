import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { UserStats } from '../types';

const INITIAL_STATS: UserStats = {
  totalActions: 0,
  totalWasteCollected: 0,
  totalCO2Offset: 0,
  ecoScore: 0,
  badgesEarned: 0,
  lastActionDate: null,
  lastUpdated: new Date().toISOString()
};

export const useUserStats = () => {
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      const stats = await storageService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    loadUserStats();
  };

  useEffect(() => {
    loadUserStats();
  }, []);

  return {
    userStats,
    loading,
    refreshStats,
  };
};