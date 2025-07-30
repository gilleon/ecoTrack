import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  Share,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { TripData } from '../../types/trip';
import { tripService } from '../../services/tripService';

interface TripDetailsModalProps {
  trip: TripData;
  visible: boolean;
  onClose: () => void;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
  trip,
  visible,
  onClose,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const handleShare = async () => {
    try {
      const shareContent = `🌿 EcoTrack: ${trip.name}

      📍 Duration: ${tripService.formatDuration(trip.duration || 0)}
      📏 Distance: ${tripService.formatDistance(trip.distance)}
      🌱 Actions: ${trip.actionsLogged}
      ♻️ Waste: ${trip.wasteCollected.toFixed(1)}kg
      🌍 CO₂ Offset: ${trip.co2Offset.toFixed(1)}kg

      Started: ${new Date(trip.startTime).toLocaleDateString()}`;

      await Share.share({
        message: shareContent,
        title: `${trip.name} - EcoTrack`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share trip details');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialIcons name="map" size={24} color={colors.primary} />
              <Text style={styles.title} numberOfLines={2}>
                {trip.name}
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.statusRow}>
                <View style={styles.statusBadge}>
                  <MaterialIcons
                    name={trip.status === 'completed' ? 'check-circle' : 'pause-circle-filled'}
                    size={20}
                    color={trip.status === 'completed' ? '#4CAF50' : '#FF9800'}
                  />
                  <Text style={styles.statusText}>{trip.status}</Text>
                </View>
                <Text style={styles.dateText}>
                  {formatDate(trip.startTime)}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <MaterialIcons name="schedule" size={24} color={colors.primary} />
                  <Text style={styles.statValue}>
                    {tripService.formatDuration(trip.duration || 0)}
                  </Text>
                  <Text style={styles.statLabel}>Duration</Text>
                </View>
                <View style={styles.statBox}>
                  <MaterialIcons name="straighten" size={24} color={colors.primary} />
                  <Text style={styles.statValue}>
                    {tripService.formatDistance(trip.distance)}
                  </Text>
                  <Text style={styles.statLabel}>Distance</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Impact</Text>
              <View style={styles.impactGrid}>
                <View style={styles.impactItem}>
                  <MaterialIcons name="eco" size={20} color={colors.primary} />
                  <Text style={styles.impactValue}>{trip.actionsLogged}</Text>
                  <Text style={styles.impactLabel}>Actions</Text>
                </View>
                <View style={styles.impactItem}>
                  <MaterialIcons name="delete" size={20} color={colors.primary} />
                  <Text style={styles.impactValue}>{trip.wasteCollected.toFixed(1)}kg</Text>
                  <Text style={styles.impactLabel}>Waste</Text>
                </View>
                <View style={styles.impactItem}>
                  <MaterialIcons name="cloud" size={20} color={colors.primary} />
                  <Text style={styles.impactValue}>{trip.co2Offset.toFixed(1)}kg</Text>
                  <Text style={styles.impactLabel}>CO₂ Offset</Text>
                </View>
              </View>
            </View>

            {trip.startLocation && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.locationBox}>
                  <View style={styles.locationRow}>
                    <MaterialIcons name="place" size={20} color={colors.primary} />
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationLabel}>Coordinates</Text>
                      <Text style={styles.locationValue}>
                        {trip.startLocation.latitude.toFixed(4)}, {trip.startLocation.longitude.toFixed(4)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.locationRow}>
                    <MaterialIcons name="my-location" size={20} color={colors.primary} />
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationLabel}>Points Recorded</Text>
                      <Text style={styles.locationValue}>{trip.locations.length}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable style={styles.shareButton} onPress={handleShare}>
              <MaterialIcons name="share" size={20} color="white" />
              <Text style={styles.shareButtonText}>Share Trip</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textTransform: 'capitalize',
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactItem: {
    alignItems: 'center',
    gap: 4,
  },
  impactValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  impactLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  locationBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  actions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});