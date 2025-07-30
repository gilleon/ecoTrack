import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { DashboardCard } from '../ui/DashboardCard';
import { TripData } from '../../types/trip';
import { tripService } from '../../services/tripService';

interface ActiveTripCardProps {
  trip: TripData;
  onStop: () => Promise<{ success: boolean; error?: string }>;
  onPause: () => Promise<{ success: boolean; error?: string }>;
  onResume: () => Promise<{ success: boolean; error?: string }>;
  onTripUpdate?: () => void;
}

export const ActiveTripCard: React.FC<ActiveTripCardProps> = ({
  trip,
  onStop,
  onPause,
  onResume,
  onTripUpdate,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [currentTrip, setCurrentTrip] = useState(trip);
  const [duration, setDuration] = useState(0);

  // Update current trip when prop changes
  useEffect(() => {
    setCurrentTrip(trip);
  }, [trip]);

  // Update duration every second
  useEffect(() => {
    const updateDuration = () => {
      const now = new Date().getTime();
      const start = new Date(currentTrip.startTime).getTime();
      setDuration(now - start);
    };

    updateDuration(); // Initial update
    const interval = setInterval(updateDuration, 1000);
    return () => clearInterval(interval);
  }, [currentTrip.startTime]);

  // Refresh trip data from storage periodically
  const refreshTripData = useCallback(async () => {
    try {
      const activeTrip = await tripService.getActiveTrip();
      if (activeTrip && activeTrip.id === currentTrip.id) {
        setCurrentTrip(activeTrip);
        console.log('Trip refreshed:', {
          actions: activeTrip.actionsLogged,
          waste: activeTrip.wasteCollected,
          co2: activeTrip.co2Offset
        });
      }
    } catch (error) {
      console.error('Error refreshing trip data:', error);
    }
  }, [currentTrip.id]);

  // Set up periodic refresh
  useEffect(() => {
    const interval = setInterval(refreshTripData, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [refreshTripData]);

  const handleStop = () => {
    Alert.alert(
      'End Trip',
      'Are you sure you want to end this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Trip',
          style: 'destructive',
          onPress: async () => {
            const result = await onStop();
            if (result.success) {
              Alert.alert('Trip Ended', 'Your trip has been saved successfully!');
              onTripUpdate?.();
            } else {
              Alert.alert('Error', result.error || 'Failed to end trip');
            }
          },
        },
      ]
    );
  };

  const handlePauseResume = async () => {
    const result = currentTrip.status === 'active' 
      ? await onPause() 
      : await onResume();
    
    if (!result.success) {
      Alert.alert('Error', result.error || 'Operation failed');
    } else {
      await refreshTripData();
      onTripUpdate?.();
    }
  };

  return (
    <DashboardCard 
      title="Current Trip" 
      icon="navigation" 
      iconFamily="MaterialIcons"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.statusBadge}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: currentTrip.status === 'active' ? '#4CAF50' : '#FF9800' }
            ]} />
            <Text style={styles.statusText}>
              {currentTrip.status === 'active' ? 'Recording' : 'Paused'}
            </Text>
          </View>
          <Text style={styles.tripName}>{currentTrip.name}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <MaterialIcons name="schedule" size={20} color={colors.primary} />
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{tripService.formatDuration(duration)}</Text>
          </View>
          
          <View style={styles.stat}>
            <MaterialIcons name="eco" size={20} color={colors.primary} />
            <Text style={styles.statLabel}>Actions</Text>
            <Text style={styles.statValue}>{currentTrip.actionsLogged}</Text>
          </View>
          
          <View style={styles.stat}>
            <MaterialIcons name="delete" size={20} color={colors.primary} />
            <Text style={styles.statLabel}>Waste</Text>
            <Text style={styles.statValue}>{currentTrip.wasteCollected.toFixed(1)}kg</Text>
          </View>
        </View>

        {/* Add CO2 offset if it's greater than 0 */}
        {currentTrip.co2Offset > 0 && (
          <View style={styles.impactRow}>
            <MaterialIcons name="eco" size={16} color={colors.primary} />
            <Text style={styles.impactText}>
              {currentTrip.co2Offset.toFixed(1)}kg CO₂ offset
            </Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.button, 
              styles.pauseButton,
              pressed && styles.pressedButton
            ]}
            onPress={handlePauseResume}
          >
            <MaterialIcons 
              name={currentTrip.status === 'active' ? 'pause' : 'play-arrow'} 
              size={20} 
              color={colors.primary} 
            />
            <Text style={[styles.buttonText, { color: colors.primary }]}>
              {currentTrip.status === 'active' ? 'Pause' : 'Resume'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button, 
              styles.stopButton,
              pressed && styles.pressedButton
            ]}
            onPress={handleStop}
          >
            <MaterialIcons name="stop" size={20} color="white" />
            <Text style={styles.stopButtonText}>End Trip</Text>
          </Pressable>
        </View>
      </View>
    </DashboardCard>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  tripName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  impactText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  pauseButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  stopButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  pressedButton: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});