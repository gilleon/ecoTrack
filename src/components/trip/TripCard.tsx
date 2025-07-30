import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { TripData } from '../../types/trip';
import { tripService } from '../../services/tripService';

interface TripCardProps {
  trip: TripData;
  onPress: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onPress }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'paused': return '#FF9800';
      case 'completed': return '#2196F3';
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'play-circle-filled';
      case 'paused': return 'pause-circle-filled';
      case 'completed': return 'check-circle';
      default: return 'help';
    }
  };

  const formatDate = (dateString: string) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressedCard
      ]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.tripName} numberOfLines={1}>
            {trip.name}
          </Text>
          <View style={styles.statusBadge}>
            <MaterialIcons
              name={getStatusIcon(trip.status)}
              size={16}
              color={getStatusColor(trip.status)}
            />
            <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
              {trip.status}
            </Text>
          </View>
        </View>
        <Text style={styles.date}>{formatDate(trip.startTime)}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <MaterialIcons name="schedule" size={16} color={colors.primary} />
          <Text style={styles.statText}>
            {tripService.formatDuration(trip.duration || 0)}
          </Text>
        </View>
        
        <View style={styles.stat}>
          <MaterialIcons name="straighten" size={16} color={colors.primary} />
          <Text style={styles.statText}>
            {tripService.formatDistance(trip.distance)}
          </Text>
        </View>
        
        <View style={styles.stat}>
          <MaterialIcons name="eco" size={16} color={colors.primary} />
          <Text style={styles.statText}>{trip.actionsLogged} actions</Text>
        </View>
      </View>

      {trip.wasteCollected > 0 && (
        <View style={styles.impactRow}>
          <MaterialIcons name="delete" size={16} color={colors.primary} />
          <Text style={styles.impactText}>
            {trip.wasteCollected.toFixed(1)}kg waste collected
          </Text>
        </View>
      )}

      <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} style={styles.chevron} />
    </Pressable>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  pressedCard: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tripName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: colors.text,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  impactText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  chevron: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -12,
  },
});