import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
}

export const ActiveTripCard: React.FC<ActiveTripCardProps> = ({
  trip,
  onStop,
  onPause,
  onResume,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const formatDuration = () => {
    const now = new Date().getTime();
    const start = new Date(trip.startTime).getTime();
    const duration = now - start;
    return tripService.formatDuration(duration);
  };

  const handleStop = () => {
    Alert.alert(
      'End Trip',
      'Are you sure you want to end this trip? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Trip',
          style: 'destructive',
          onPress: async () => {
            const result = await onStop();
            if (result.success) {
              Alert.alert('Trip Ended', 'Your trip has been saved successfully!');
            } else {
              Alert.alert('Error', result.error || 'Failed to end trip');
            }
          },
        },
      ]
    );
  };

  const handlePauseResume = async () => {
    if (trip.status === 'active') {
      const result = await onPause();
      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to pause trip');
      }
    } else {
      const result = await onResume();
      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to resume trip');
      }
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
              { backgroundColor: trip.status === 'active' ? '#4CAF50' : '#FF9800' }
            ]} />
            <Text style={styles.statusText}>
              {trip.status === 'active' ? 'Recording' : 'Paused'}
            </Text>
          </View>
          <Text style={styles.tripName}>{trip.name}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <MaterialIcons name="schedule" size={20} color={colors.primary} />
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{formatDuration()}</Text>
          </View>
          
          <View style={styles.stat}>
            <MaterialIcons name="eco" size={20} color={colors.primary} />
            <Text style={styles.statLabel}>Actions</Text>
            <Text style={styles.statValue}>{trip.actionsLogged}</Text>
          </View>
          
          <View style={styles.stat}>
            <MaterialIcons name="delete" size={20} color={colors.primary} />
            <Text style={styles.statLabel}>Waste</Text>
            <Text style={styles.statValue}>{trip.wasteCollected.toFixed(1)}kg</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.pauseButton]}
            onPress={handlePauseResume}
          >
            <MaterialIcons 
              name={trip.status === 'active' ? 'pause' : 'play-arrow'} 
              size={20} 
              color={colors.primary} 
            />
            <Text style={[styles.buttonText, { color: colors.primary }]}>
              {trip.status === 'active' ? 'Pause' : 'Resume'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={handleStop}
          >
            <MaterialIcons name="stop" size={20} color="white" />
            <Text style={styles.stopButtonText}>End Trip</Text>
          </TouchableOpacity>
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
});