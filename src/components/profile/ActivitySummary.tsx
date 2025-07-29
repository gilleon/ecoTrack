import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { DashboardCard } from '../ui/DashboardCard';
import { useUserStats } from '../../hooks/useUserStats';
import { dateUtils } from '../../utils/dateUtils';

export const ActivitySummary: React.FC = () => {
  const { colors } = useTheme();
  const { userStats } = useUserStats();
  const styles = createStyles(colors);

  return (
    <DashboardCard title="Activity" icon="timeline" iconFamily="MaterialIcons">
      <View style={styles.activitySection}>
        <View style={styles.activityItem}>
          <MaterialIcons name="today" size={20} color={colors.primary} />
          <Text style={styles.activityLabel}>Last Action</Text>
          <Text style={styles.activityValue}>
            {dateUtils.formatLastAction(userStats.lastActionDate)}
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