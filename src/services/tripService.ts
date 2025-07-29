import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { TripData, TripLocation } from '../types/trip';

const TRIPS_STORAGE_KEY = 'ecotrack_trips';
const ACTIVE_TRIP_KEY = 'ecotrack_active_trip';

class TripService {
  private activeTripId: string | null = null;
  private locationWatcher: Location.LocationSubscription | null = null;

  async checkLocationPermissions(): Promise<{ 
    foreground: boolean; 
    background: boolean; 
    message: string 
  }> {
    try {
      const foregroundStatus = await Location.getForegroundPermissionsAsync();
      const backgroundStatus = await Location.getBackgroundPermissionsAsync();

      return {
        foreground: foregroundStatus.status === 'granted',
        background: backgroundStatus.status === 'granted',
        message: this.getPermissionMessage(foregroundStatus.status, backgroundStatus.status)
      };
    } catch (error) {
      return {
        foreground: false,
        background: false,
        message: 'Unable to check location permissions'
      };
    }
  }

  private getPermissionMessage(foreground: string, background: string): string {
    if (foreground !== 'granted') {
      return 'Location access is required to track your trip. Please allow location access in settings.';
    }
    if (background !== 'granted') {
      return 'Foreground location tracking enabled. Keep the app open for best results.';
    }
    return 'All permissions granted';
  }

  async requestPermissions(): Promise<{ 
    success: boolean; 
    message: string;
    canProceed: boolean;
  }> {
    try {
      let foregroundStatus;
      try {
        const result = await Location.requestForegroundPermissionsAsync();
        foregroundStatus = result.status;
      } catch (permissionError) {
        if (
          typeof permissionError === 'object' &&
          permissionError !== null &&
          'message' in permissionError &&
          typeof (permissionError as any).message === 'string' &&
          (
            (permissionError as any).message.includes('NSLocation') ||
            (permissionError as any).message.includes('Info.plist')
          )
        ) {
          return {
            success: false,
            message: 'App configuration issue. Please restart the development server with: npx expo start --clear',
            canProceed: false
          };
        }
        
        return {
          success: false,
          message: 'Failed to request location permission. Please check your device settings.',
          canProceed: false
        };
      }
      
      if (foregroundStatus !== 'granted') {
        return {
          success: false,
          message: 'Location permission is required to track your trip. Please enable location access in your device settings.',
          canProceed: false
        };
      }

      return {
        success: true,
        message: 'Location permission granted. Trip tracking enabled.',
        canProceed: true
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to request permissions. Please try again.',
        canProceed: false
      };
    }
  }

  async startTrip(name: string): Promise<{ 
    success: boolean; 
    tripId?: string; 
    error?: string;
    warning?: string;
  }> {
    try {
      const permissionResult = await this.requestPermissions();
      
      if (!permissionResult.canProceed) {
        return { 
          success: false, 
          error: permissionResult.message 
        };
      }

      let location;
      try {
        location = await this.getCurrentLocationWithFallback();
      } catch (locationError) {
        return { 
          success: false, 
          error: 'Unable to get your current location. Please check if location services are enabled and try again.' 
        };
      }

      const tripId = `trip_${Date.now()}`;
      const startLocation: TripLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        altitude: location.altitude || undefined,
        accuracy: location.accuracy || undefined,
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
      await this.startForegroundLocationTracking();

      return { 
        success: true, 
        tripId,
        warning: 'Keep the app open for continuous location tracking.'
      };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to start trip. Please try again.' 
      };
    }
  }

  private async getCurrentLocationWithFallback(): Promise<{
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
  }> {
    try {
      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Location timeout')), 12000)
        )
      ]) as Location.LocationObject;

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || undefined,
        accuracy: location.coords.accuracy || undefined,
      };
    } catch (error) {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          altitude: location.coords.altitude || undefined,
          accuracy: location.coords.accuracy || undefined,
        };
      } catch (fallbackError) {
        if (__DEV__) {
          return {
            latitude: 37.7749,
            longitude: -122.4194,
            altitude: 100,
            accuracy: 10,
          };
        }
        
        throw fallbackError;
      }
    }
  }

  private async startForegroundLocationTracking(): Promise<void> {
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
        (location) => {
          this.handleLocationUpdate(location);
        }
      );
    } catch (error) {
      console.error('Error starting foreground location tracking:', error);
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

  private async stopForegroundLocationTracking(): Promise<void> {
    try {
      if (this.locationWatcher) {
        this.locationWatcher.remove();
        this.locationWatcher = null;
      }
    } catch (error) {
      console.error('Error stopping foreground location tracking:', error);
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
        const location = await this.getCurrentLocationWithFallback();
        endLocation = {
          latitude: location.latitude,
          longitude: location.longitude,
          altitude: location.altitude || undefined,
          accuracy: location.accuracy || undefined,
          timestamp: Date.now(),
        };
      } catch (error) {
        endLocation = {
          ...trip.startLocation!,
          timestamp: Date.now(),
        };
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
      await this.stopForegroundLocationTracking();

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

      const updatedTrip: TripData = {
        ...trip,
        status: 'paused',
      };

      await this.saveTrip(updatedTrip);
      await this.stopForegroundLocationTracking();

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

      const updatedTrip: TripData = {
        ...trip,
        status: 'active',
      };

      await this.saveTrip(updatedTrip);
      await this.startForegroundLocationTracking();

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
    try {
      const tripsData = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
      const trips: Record<string, TripData> = tripsData ? JSON.parse(tripsData) : {};

      trips[trip.id] = trip;
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
    } catch (error) {
      throw error;
    }
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
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }
}

export const tripService = new TripService();