import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useUnits } from '../../contexts/UnitsContext';
import { DashboardCard } from '../ui/DashboardCard';
import { useUserStats } from '../../hooks/useUserStats';
import { useHotReload } from '../../hooks/useHotReload';

export const ImpactSummary: React.FC = () => {
  const { colors } = useTheme();
  const { formatWeight } = useUnits();
  const { userStats, refreshStats } = useUserStats();
  const styles = createStyles(colors);

  useHotReload({
    refreshStats,
    debugLabel: 'ImpactSummary'
  });

  return (
    <DashboardCard title="Your Impact Summary" icon="eco" iconFamily="MaterialIcons">
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats.totalActions}</Text>
          <Text style={styles.statLabel}>Total Actions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatWeight(userStats.totalWasteCollected)}</Text>
          <Text style={styles.statLabel}>Waste Collected</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats.totalCO2Offset.toFixed(1)} kg</Text>
          <Text style={styles.statLabel}>CO₂ Offset</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userStats.ecoScore}</Text>
          <Text style={styles.statLabel}>Eco Score</Text>
        </View>
      </View>
    </DashboardCard>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});