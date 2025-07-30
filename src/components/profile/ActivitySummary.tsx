import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { DashboardCard } from '../ui/DashboardCard';
import { useUserStats } from '../../hooks/useUserStats';
import { useHotReload } from '../../hooks/useHotReload';

export const ActivitySummary: React.FC = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { userStats, refreshStats } = useUserStats();
  
  useHotReload({
    refreshStats,
    debugLabel: 'ActivitySummary'
  });

  const formatLastAction = (lastActionDate: string | null): string => {
    if (!lastActionDate) return 'No actions yet';
    
    const diffMs = Date.now() - new Date(lastActionDate).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(lastActionDate).toLocaleDateString();
  };

  return (
    <DashboardCard title="Activity" icon="timeline" iconFamily="MaterialIcons">
      <View style={styles.activitySection}>
        <View style={styles.activityItem}>
          <MaterialIcons name="today" size={20} color={colors.primary} />
          <Text style={styles.activityLabel}>Last Action</Text>
          <Text style={styles.activityValue}>
            {formatLastAction(userStats.lastActionDate)}
          </Text>
        </View>
        <View style={styles.activityItem}>
          <MaterialIcons name="emoji-events" size={20} color={colors.primary} />
          <Text style={styles.activityLabel}>Badges Earned</Text>
          <Text style={styles.activityValue}>{userStats.badgesEarned}</Text>
        </View>
      </View>
    </DashboardCard>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  activitySection: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  activityLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  activityValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});