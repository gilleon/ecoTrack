import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { storageService } from '../../services/storageService';

interface DashboardHeaderProps {
  totalActions: number;
  lastActionDate: string | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  totalActions,
  lastActionDate,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.header}>
      <View style={styles.greetingRow}>
        <MaterialIcons name="wb-sunny" size={24} color={colors.primary} />
        <Text style={styles.greeting}>{storageService.getGreeting()}</Text>
      </View>
      <Text style={styles.subtitle}>{storageService.getSubtitle(totalActions)}</Text>
      {lastActionDate && (
        <View style={styles.lastActionRow}>
          <MaterialIcons name="schedule" size={16} color={colors.textSecondary} />
          <Text style={styles.lastAction}>
            Last action: {storageService.getLastActionText(lastActionDate)}
          </Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  lastActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastAction: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});