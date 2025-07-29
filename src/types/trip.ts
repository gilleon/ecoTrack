export interface TripLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: number;
}

export interface TripData {
  id: string;
  name: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'paused' | 'completed';
  locations: TripLocation[];
  distance: number; // in meters
  duration: number; // in milliseconds
  actionsLogged: number;
  wasteCollected: number;
  co2Offset: number;
  startLocation?: TripLocation;
  endLocation?: TripLocation;
  createdAt: string;
}

export interface TripStats {
  totalTrips: number;
  totalDistance: number;
  totalDuration: number;
  averageActionsPerTrip: number;
  favoriteLocation?: string;
}