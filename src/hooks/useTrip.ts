import { useState, useEffect } from 'react';
import { tripService } from '../services/tripService';
import { TripData } from '../types/trip';

export const useTrip = () => {
  const [activeTrip, setActiveTrip] = useState<TripData | null>(null);
  const [allTrips, setAllTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActiveTrip = async () => {
    try {
      const trip = await tripService.getActiveTrip();
      setActiveTrip(trip);
    } catch (error) {
      console.error('Error loading active trip:', error);
    }
  };

  const loadAllTrips = async () => {
    try {
      const trips = await tripService.getAllTrips();
      setAllTrips(trips);
    } catch (error) {
      console.error('Error loading trips:', error);
    }
  };

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
      await loadActiveTrip();
      await loadAllTrips();
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

  const refreshTrips = async () => {
    await Promise.all([loadActiveTrip(), loadAllTrips()]);
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([loadActiveTrip(), loadAllTrips()]);
      setLoading(false);
    };

    initialize();
  }, []);

  return {
    activeTrip,
    allTrips,
    loading,
    startTrip,
    stopTrip,
    pauseTrip,
    resumeTrip,
    refreshTrips,
  };
};