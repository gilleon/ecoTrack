import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TripData, TripLocation } from '../types/trip';

const TRIPS_STORAGE_KEY = 'ecotrack_trips';
const ACTIVE_TRIP_KEY = 'ecotrack_active_trip';

class TripService {
  private activeTripId: string | null = null;
  private locationWatcher: Location.LocationSubscription | null = null;

  async requestPermissions(): Promise<{ success: boolean; message: string; canProceed: boolean }> {
    try {
      const result = await Location.requestForegroundPermissionsAsync();
      
      if (result.status !== 'granted') {
        return {
          success: false,
          message: 'Location permission is required to track your trip.',
          canProceed: false
        };
      }

      return {
        success: true,
        message: 'Location permission granted.',
        canProceed: true
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to request permissions.',
        canProceed: false
      };
    }
  }

  async startTrip(name: string): Promise<{ success: boolean; tripId?: string; error?: string }> {
    try {
      const permissionResult = await this.requestPermissions();
      if (!permissionResult.canProceed) {
        return { success: false, error: permissionResult.message };
      }

      const location = await this.getCurrentLocation();
      const tripId = `trip_${Date.now()}`;
      const startLocation: TripLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        altitude: location.altitude,
        accuracy: location.accuracy,
        timestamp: Date.now(),
      };

      const newTrip: TripData = {
        id: tripId,
        name,
        startTime: new Date().toISOString(),
        status: 'active',
        locations: [startLocation],
        distance: 0,
        duration: 0,
        actionsLogged: 0,
        wasteCollected: 0,
        co2Offset: 0,
        startLocation,
        createdAt: new Date().toISOString(),
      };

      await this.saveTrip(newTrip);
      await AsyncStorage.setItem(ACTIVE_TRIP_KEY, tripId);
      this.activeTripId = tripId;
      await this.startLocationTracking();

      return { success: true, tripId };
    } catch (error) {
      return { success: false, error: 'Failed to start trip.' };
    }
  }

  private async getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
  }> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || undefined,
        accuracy: location.coords.accuracy || undefined,
      };
    } catch (error) {
      if (__DEV__) {
        return { latitude: 37.7749, longitude: -122.4194, altitude: 100, accuracy: 10 };
      }
      throw error;
    }
  }

  private async startLocationTracking(): Promise<void> {
    try {
      if (this.locationWatcher) {
        this.locationWatcher.remove();
      }

      this.locationWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 30000,
          distanceInterval: 10,
        },
        (location) => this.handleLocationUpdate(location)
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  }

  private async handleLocationUpdate(location: Location.LocationObject): Promise<void> {
    try {
      if (!this.activeTripId) return;

      const trip = await this.getTrip(this.activeTripId);
      if (!trip || trip.status !== 'active') return;

      const newLocation: TripLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || undefined,
        accuracy: location.coords.accuracy || undefined,
        timestamp: Date.now(),
      };

      const updatedTrip: TripData = {
        ...trip,
        locations: [...trip.locations, newLocation],
        distance: this.calculateDistance([...trip.locations, newLocation]),
      };

      await this.saveTrip(updatedTrip);
    } catch (error) {
      console.error('Error handling location update:', error);
    }
  }

  private async stopLocationTracking(): Promise<void> {
    if (this.locationWatcher) {
      this.locationWatcher.remove();
      this.locationWatcher = null;
    }
  }

  async stopTrip(): Promise<{ success: boolean; trip?: TripData; error?: string }> {
    try {
      if (!this.activeTripId) {
        return { success: false, error: 'No active trip' };
      }

      const trip = await this.getTrip(this.activeTripId);
      if (!trip) {
        return { success: false, error: 'Trip not found' };
      }

      let endLocation: TripLocation;
      try {
        const location = await this.getCurrentLocation();
        endLocation = {
          latitude: location.latitude,
          longitude: location.longitude,
          altitude: location.altitude,
          accuracy: location.accuracy,
          timestamp: Date.now(),
        };
      } catch (error) {
        endLocation = { ...trip.startLocation!, timestamp: Date.now() };
      }

      const endTime = new Date().toISOString();
      const duration = new Date(endTime).getTime() - new Date(trip.startTime).getTime();

      const updatedTrip: TripData = {
        ...trip,
        endTime,
        status: 'completed',
        duration,
        endLocation,
        locations: [...trip.locations, endLocation],
        distance: this.calculateDistance([...trip.locations, endLocation]),
      };

      await this.saveTrip(updatedTrip);
      await AsyncStorage.removeItem(ACTIVE_TRIP_KEY);
      this.activeTripId = null;
      await this.stopLocationTracking();

      return { success: true, trip: updatedTrip };
    } catch (error) {
      return { success: false, error: 'Failed to stop trip' };
    }
  }

  async pauseTrip(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.activeTripId) {
        return { success: false, error: 'No active trip' };
      }

      const trip = await this.getTrip(this.activeTripId);
      if (!trip) {
        return { success: false, error: 'Trip not found' };
      }

      const updatedTrip: TripData = { ...trip, status: 'paused' };
      await this.saveTrip(updatedTrip);
      await this.stopLocationTracking();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to pause trip' };
    }
  }

  async resumeTrip(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.activeTripId) {
        return { success: false, error: 'No active trip' };
      }

      const trip = await this.getTrip(this.activeTripId);
      if (!trip) {
        return { success: false, error: 'Trip not found' };
      }

      const updatedTrip: TripData = { ...trip, status: 'active' };
      await this.saveTrip(updatedTrip);
      await this.startLocationTracking();

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to resume trip' };
    }
  }

  async getActiveTrip(): Promise<TripData | null> {
    try {
      const activeTripId = await AsyncStorage.getItem(ACTIVE_TRIP_KEY);
      if (!activeTripId) {
        this.activeTripId = null;
        return null;
      }

      this.activeTripId = activeTripId;
      return await this.getTrip(activeTripId);
    } catch (error) {
      return null;
    }
  }

  async getAllTrips(): Promise<TripData[]> {
    try {
      const tripsData = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
      if (!tripsData) return [];

      const trips: Record<string, TripData> = JSON.parse(tripsData);
      return Object.values(trips).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      return [];
    }
  }

  async getTrip(tripId: string): Promise<TripData | null> {
    try {
      const tripsData = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
      if (!tripsData) return null;

      const trips: Record<string, TripData> = JSON.parse(tripsData);
      return trips[tripId] || null;
    } catch (error) {
      return null;
    }
  }

  async saveTrip(trip: TripData): Promise<void> {
    const tripsData = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
    const trips: Record<string, TripData> = tripsData ? JSON.parse(tripsData) : {};
    trips[trip.id] = trip;
    await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  }

  async updateTripAction(actionWeight: number, co2Offset: number): Promise<void> {
    try {
      if (!this.activeTripId) return;

      const trip = await this.getTrip(this.activeTripId);
      if (!trip) return;

      const updatedTrip: TripData = {
        ...trip,
        actionsLogged: trip.actionsLogged + 1,
        wasteCollected: trip.wasteCollected + actionWeight,
        co2Offset: trip.co2Offset + co2Offset,
      };

      await this.saveTrip(updatedTrip);
    } catch (error) {
      console.error('Error updating trip action:', error);
    }
  }

  calculateDistance(locations: TripLocation[]): number {
    if (locations.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < locations.length; i++) {
      const prev = locations[i - 1];
      const curr = locations[i];
      totalDistance += this.getDistanceBetweenPoints(prev, curr);
    }
    return totalDistance;
  }

  private getDistanceBetweenPoints(point1: TripLocation, point2: TripLocation): number {
    const R = 6371000;
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.latitude)) * Math.cos(this.toRadians(point2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }

  formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m`;
    }
    return `${seconds}s`;
  }
}

export const tripService = new TripService();