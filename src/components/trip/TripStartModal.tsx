import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface TripStartModalProps {
  visible: boolean;
  onClose: () => void;
  onStartTrip: (name: string) => Promise<{ 
    success: boolean; 
    error?: string; 
    tripId?: string;
  }>;
}

export const TripStartModal: React.FC<TripStartModalProps> = ({
  visible,
  onClose,
  onStartTrip,
}) => {
  const { colors } = useTheme();
  const [tripName, setTripName] = useState('');
  const [loading, setLoading] = useState(false);
  const styles = createStyles(colors);

  const handleStartTrip = async () => {
    if (!tripName.trim()) {
      Alert.alert('Trip Name Required', 'Please enter a name for your trip.');
      return;
    }

    try {
      setLoading(true);
      const result = await onStartTrip(tripName.trim());
      
      if (result.success) {
        setTripName('');
        onClose();
        Alert.alert('Trip Started!', 'Your adventure is now being tracked. Have a great time!');
      } else {
        const isPermissionError = result.error?.toLowerCase().includes('permission');
        
        if (isPermissionError) {
          Alert.alert(
            'Location Permission Required',
            result.error || 'Location access is needed to track your trip.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() }
            ]
          );
        } else {
          Alert.alert('Failed to Start Trip', result.error || 'Please try again.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <MaterialIcons name="map" size={24} color={colors.primary} />
            <Text style={styles.title}>Start New Trip</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Trip Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Mt. Whitney Day Hike"
              value={tripName}
              onChangeText={setTripName}
              placeholderTextColor={colors.textSecondary}
              maxLength={50}
              editable={!loading}
            />

            <View style={styles.infoBox}>
              <MaterialIcons name="info" size={20} color={colors.primary} />
              <Text style={styles.infoText}>
                GPS tracking will record your route and help calculate your environmental impact.
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button, 
                  styles.startButton,
                  (loading || !tripName.trim()) && styles.disabledButton
                ]}
                onPress={handleStartTrip}
                disabled={loading || !tripName.trim()}
              >
                <MaterialIcons 
                  name={loading ? "hourglass-empty" : "play-arrow"} 
                  size={20} 
                  color="white" 
                />
                <Text style={styles.startButtonText}>
                  {loading ? 'Starting...' : 'Start Trip'}
                </Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
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
    gap: 8,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  startButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});