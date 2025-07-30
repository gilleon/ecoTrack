import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface DashboardHeaderProps {
  totalActions: number;
  lastActionDate: string | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  totalActions = 0,
  lastActionDate = null,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    return 'Good evening!';
  };

  const getSubtitle = (totalActions: number) => {
    if (totalActions === 0) return 'Ready to start your eco journey?';
    if (totalActions < 5) return 'Great start! Keep up the momentum!';
    if (totalActions < 10) return 'You\'re building great eco habits!';
    return 'Amazing work protecting our planet!';
  };

  const formatLastActionDate = () => {
    if (!lastActionDate) return null;
    
    try {
      const date = new Date(lastActionDate);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'today';
      if (diffDays === 1) return 'yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return null;
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.greetingRow}>
        <MaterialIcons name="wb-sunny" size={24} color={colors.primary} />
        <Text style={styles.greeting}>{getGreeting()}</Text>
      </View>
      <Text style={styles.subtitle}>{getSubtitle(totalActions)}</Text>
      {lastActionDate && (
        <View style={styles.lastActionRow}>
          <MaterialIcons name="schedule" size={16} color={colors.textSecondary} />
          <Text style={styles.lastAction}>
            Last action: {formatLastActionDate()}
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