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
      setActiveTrip(null);
    }
  }, []);

  const loadAllTrips = useCallback(async () => {
    try {
      setLoading(true);
      const trips = await tripService.getAllTrips();
      setAllTrips(trips);
    } catch (error) {
      setAllTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadActiveTrip(), loadAllTrips()]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [loadActiveTrip, loadAllTrips]);

  useEffect(() => {
    loadActiveTrip();
    loadAllTrips();
  }, [loadActiveTrip, loadAllTrips]);

  const startTrip = async (name: string) => {
    const result = await tripService.startTrip(name);
    if (result.success) {
      await loadActiveTrip();
    }
    return result;
  };

  const stopTrip = async () => {
    const result = await tripService.stopTrip();
    if (result.success) {
      await Promise.all([loadActiveTrip(), loadAllTrips()]);
    }
    return result;
  };

  const pauseTrip = async () => {
    const result = await tripService.pauseTrip();
    if (result.success) {
      await loadActiveTrip();
    }
    return result;
  };

  const resumeTrip = async () => {
    const result = await tripService.resumeTrip();
    if (result.success) {
      await loadActiveTrip();
    }
    return result;
  };

  return {
    activeTrip,
    allTrips,
    loading,
    startTrip,
    stopTrip,
    pauseTrip,
    resumeTrip,
    refreshActiveTrip: refreshAllData,
    refreshAllData,
  };
};