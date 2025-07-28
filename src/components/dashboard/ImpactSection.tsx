import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { DashboardCard } from '../ui/DashboardCard';
import { ImpactProgressBar } from '../ui/ImpactProgressBar';

interface ImpactSectionProps {
  totalWasteCollected: number;
  totalCO2Offset: number;
  totalActions: number;
  progressTargets: { maxWaste: number; maxCO2: number };
}

export const ImpactSection: React.FC<ImpactSectionProps> = ({
  totalWasteCollected,
  totalCO2Offset,
  totalActions,
  progressTargets,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const getProgress = (value: number, max: number) => Math.min(value / max, 1);

  return (
    <DashboardCard title="Your Impact" icon="trending-up" iconFamily="MaterialIcons">
      <View style={styles.impactSection}>
        <ImpactProgressBar
          icon="delete"
          title="Waste Collected"
          value={`${totalWasteCollected} lbs`}
          progress={getProgress(totalWasteCollected, progressTargets.maxWaste)}
          color="#FF6B6B"
        />
        <ImpactProgressBar
          icon="eco"
          title="CO₂ Offset"
          value={`${totalCO2Offset} kg`}
          progress={getProgress(totalCO2Offset, progressTargets.maxCO2)}
          color="#4CAF50"
        />
        <View style={styles.totalActions}>
          <Text style={styles.totalActionsLabel}>Total Actions</Text>
          <Text style={styles.totalActionsValue}>{totalActions}</Text>
        </View>
      </View>
    </DashboardCard>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  impactSection: {
    gap: 16,
  },
  totalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalActionsLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  totalActionsValue: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '700',
  },
});