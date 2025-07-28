import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useUnits } from '../../contexts/UnitsContext';
import { DashboardCard } from '../ui/DashboardCard';
import { storageService } from '../../services/storageService';
import { EcoActionData } from '../../types';

interface RecentActionsProps {
  actions: EcoActionData[];
}

export const RecentActions: React.FC<RecentActionsProps> = ({ actions }) => {
  const { colors } = useTheme();
  const { weightUnit, convertWeight } = useUnits();
  const styles = createStyles(colors);

  if (actions.length === 0) return null;

  const formatImpactValue = (action: EcoActionData): string => {
    const isWeightAction = action.actionType === 'trash_pickup' || action.actionType === 'recycling';
    
    if (isWeightAction) {
      const convertedValue = convertWeight(action.impact, 'lb', weightUnit);
      return `${convertedValue.toFixed(1)} ${weightUnit}`;
    }
    
    return `${action.impact} ${action.impactUnit}`;
  };

  const renderRecentAction = (action: EcoActionData) => (
    <View key={action.id} style={styles.recentActionItem}>
      <View style={styles.recentActionContent}>
        <Text style={styles.recentActionTitle}>
          {storageService.formatActionType(action.actionType)}
        </Text>
        <Text style={styles.recentActionDescription} numberOfLines={1}>
          {action.description}
        </Text>
        <Text style={styles.recentActionImpact}>
          {formatImpactValue(action)}
          {action.location && ` • ${action.location}`}
        </Text>
      </View>
      <Text style={styles.recentActionTime}>
        {storageService.formatDate(new Date(action.timestamp))}
      </Text>
    </View>
  );

  return (
    <DashboardCard title="Recent Actions" icon="history" iconFamily="MaterialIcons">
      <View style={styles.recentActionsSection}>
        {actions.map(renderRecentAction)}
      </View>
    </DashboardCard>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  recentActionsSection: {
    gap: 12,
  },
  recentActionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recentActionContent: {
    flex: 1,
    marginRight: 12,
  },
  recentActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  recentActionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  recentActionImpact: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  recentActionTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});