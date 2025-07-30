import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useTrip } from '../hooks/useTrip';
import { TripData } from '../types/trip';
import { tripService } from '../services/tripService';
import { LoadingState } from '../components/common/LoadingState';
import { TripCard } from '../components/trip/TripCard';
import { TripDetailsModal } from '../components/trip/TripDetailsModal';

export default function TripsScreen() {
  const { colors } = useTheme();
  const { allTrips, loading } = useTrip();
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const styles = createStyles(colors);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Trips refresh automatically via useTrip hook
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatsOverview = () => {
    const completedTrips = allTrips.filter(trip => trip.status === 'completed');
    return {
      totalTrips: completedTrips.length,
      totalDistance: completedTrips.reduce((sum, trip) => sum + trip.distance, 0),
      totalDuration: completedTrips.reduce((sum, trip) => sum + trip.duration, 0),
      totalActions: completedTrips.reduce((sum, trip) => sum + trip.actionsLogged, 0),
    };
  };

  if (loading) {
    return <LoadingState message="Loading your trips..." />;
  }

  const stats = getStatsOverview();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="map" size={32} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Your Adventures</Text>
            <Text style={styles.subtitle}>
              {stats.totalTrips} trips • {tripService.formatDistance(stats.totalDistance)} explored
            </Text>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialIcons name="hiking" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{stats.totalTrips}</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="straighten" size={24} color={colors.primary} />
              <Text style={styles.statValue}>
                {tripService.formatDistance(stats.totalDistance)}
              </Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="schedule" size={24} color={colors.primary} />
              <Text style={styles.statValue}>
                {tripService.formatDuration(stats.totalDuration)}
              </Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="eco" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{stats.totalActions}</Text>
              <Text style={styles.statLabel}>Actions</Text>
            </View>
          </View>
        </View>

        {/* Trip List */}
        <View style={styles.tripsContainer}>
          <Text style={styles.sectionTitle}>Trip History</Text>
          {allTrips.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="explore-off" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>No trips yet</Text>
              <Text style={styles.emptySubtitle}>
                Start your first adventure to see it here!
              </Text>
            </View>
          ) : (
            <View style={styles.tripsList}>
              {allTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onPress={() => setSelectedTrip(trip)}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Trip Details Modal */}
      {selectedTrip && (
        <TripDetailsModal
          trip={selectedTrip}
          visible={!!selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  tripsContainer: {
    marginBottom: 24,
  },
  tripsList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});