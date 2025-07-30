import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useUnits } from '../../contexts/UnitsContext';
import { EcoActionData } from '../../types';
import { DashboardCard } from '../ui/DashboardCard';

interface RecentActionsProps {
  actions: EcoActionData[];
}

const ACTION_CONFIG = {
  trash_pickup: { icon: 'delete', title: 'Trash Pickup' },
  recycling: { icon: 'recycling', title: 'Recycling' },
  zero_waste_camping: { icon: 'nature', title: 'Zero Waste Camping' },
  education: { icon: 'school', title: 'Education' },
} as const;

export const RecentActions: React.FC<RecentActionsProps> = ({ actions = [] }) => {
  const { colors } = useTheme();
  const { weightUnit, convertWeight } = useUnits();
  const styles = createStyles(colors);

  const safeActions = Array.isArray(actions) ? actions : [];

  const formatDate = (timestamp: string) => {
    try {
      const diffMs = Date.now() - new Date(timestamp).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return new Date(timestamp).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  if (safeActions.length === 0) {
    return (
      <DashboardCard title="Recent Actions" icon="history" iconFamily="MaterialIcons">
        <View style={styles.emptyState}>
          <MaterialIcons name="eco" size={48} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No actions logged yet</Text>
          <Text style={styles.emptySubtext}>
            Start logging your eco-friendly actions to see them here!
          </Text>
        </View>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Recent Actions" icon="history" iconFamily="MaterialIcons">
      <View style={styles.container}>
        {safeActions.map((action, index) => {
          const config = ACTION_CONFIG[action.type] || { icon: 'eco', title: action.type };
          
          return (
            <View key={action.id || index} style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <MaterialIcons 
                  name={config.icon as any} 
                  size={24} 
                  color={colors.primary} 
                />
              </View>
              
              <View style={styles.actionContent}>
                <View style={styles.actionHeader}>
                  <Text style={styles.actionTitle}>{config.title}</Text>
                  <Text style={styles.actionTime}>{formatDate(action.timestamp)}</Text>
                </View>
                
                <Text style={styles.actionDescription} numberOfLines={2}>
                  {action.description}
                </Text>
                
                <View style={styles.actionStats}>
                  <View style={styles.statBadge}>
                    <Text style={styles.statText}>
                      {convertWeight(action.impact, action.impactUnit, weightUnit).toFixed(1)} {weightUnit}
                    </Text>
                  </View>
                  {action.co2Offset > 0 && (
                    <View style={[styles.statBadge, styles.co2Badge]}>
                      <Text style={styles.co2Text}>
                        {action.co2Offset.toFixed(1)}kg CO₂
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </DashboardCard>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionItem: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
    gap: 4,
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  actionTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actionStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  statBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  co2Badge: {
    backgroundColor: '#E8F5E8',
  },
  co2Text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50',
  },
});