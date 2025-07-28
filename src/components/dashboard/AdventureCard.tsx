import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { DashboardCard } from '../ui/DashboardCard';

interface AdventureCardProps {
  totalActions: number;
  onStartTrip: () => void;
}

export const AdventureCard: React.FC<AdventureCardProps> = ({
  totalActions,
  onStartTrip,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <DashboardCard title="Current Adventure" icon="terrain" iconFamily="MaterialIcons">
      <Text style={styles.adventureSubtitle}>
        {totalActions === 0 ? 'Ready for your first eco action?' : 'Ready for your next adventure?'}
      </Text>
      <Pressable style={styles.startTripButton} onPress={onStartTrip}>
        <MaterialIcons name="terrain" size={20} color="white" />
        <Text style={styles.startTripText}>Start New Trip</Text>
      </Pressable>
    </DashboardCard>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  adventureSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  startTripButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  startTripText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});