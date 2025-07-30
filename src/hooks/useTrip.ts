import { useState, useEffect, useCallback } from 'react';
import { tripService } from '../services/tripService';
import { TripData } from '../types/trip';

export const useTrip = () => {
  const [activeTrip, setActiveTrip] = useState<TripData | null>(null);
  const [allTrips, setAllTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActiveTrip = useCallback(async () => {
    try {
      const trip = await tripService.getActiveTrip();
      setActiveTrip(trip);
    } catch (error) {
      console.error('Error loading active trip:', error);
      setActiveTrip(null);
    }
  }, []);

  const loadAllTrips = useCallback(async () => {
    try {
      setLoading(true);
      const trips = await tripService.getAllTrips();
      setAllTrips(trips);
    } catch (error) {
      console.error('Error loading trips:', error);
      setAllTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActiveTrip();
    loadAllTrips();
  }, [loadActiveTrip, loadAllTrips]);

  const startTrip = async (name: string) => {
    try {
      const result = await tripService.startTrip(name);
      if (result.success) {
        await loadActiveTrip();
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to start trip' };
    }
  };

  const stopTrip = async () => {
    try {
      const result = await tripService.stopTrip();
      if (result.success) {
        await Promise.all([loadActiveTrip(), loadAllTrips()]);
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to stop trip' };
    }
  };

  const pauseTrip = async () => {
    try {
      const result = await tripService.pauseTrip();
      if (result.success) {
        await loadActiveTrip();
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to pause trip' };
    }
  };

  const resumeTrip = async () => {
    try {
      const result = await tripService.resumeTrip();
      if (result.success) {
        await loadActiveTrip();
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to resume trip' };
    }
  };

  const refreshActiveTrip = useCallback(async () => {
    await loadActiveTrip();
  }, [loadActiveTrip]);

  return {
    activeTrip,
    allTrips,
    loading,
    startTrip,
    stopTrip,
    pauseTrip,
    resumeTrip,
    refreshActiveTrip,
  };
};