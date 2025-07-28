import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { DashboardCard } from '../ui/DashboardCard';
import { storageService } from '../../services/storageService';

interface AchievementProgressProps {
  totalActions: number;
  ecoScore: number;
}

export const AchievementProgress: React.FC<AchievementProgressProps> = ({
  totalActions,
  ecoScore,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (totalActions === 0) return null;

  return (
    <DashboardCard title="Achievement Progress" icon="emoji-events" iconFamily="MaterialIcons">
      <View style={styles.achievementSection}>
        <View style={styles.achievementItem}>
          <View style={styles.achievementLabelRow}>
            <MaterialIcons name="flag" size={16} color={colors.primary} />
            <Text style={styles.achievementLabel}>Next Badge</Text>
          </View>
          <Text style={styles.achievementValue}>
            {storageService.getNextBadgeText(totalActions, ecoScore)}
          </Text>
        </View>
        <View style={styles.achievementProgress}>
          <View 
            style={[
              styles.achievementProgressBar,
              { 
                width: `${storageService.getNextBadgeProgress(totalActions, ecoScore)}%`,
                backgroundColor: colors.primary 
              }
            ]} 
          />
        </View>
      </View>
    </DashboardCard>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  achievementSection: {
    gap: 8,
  },
  achievementItem: {
    gap: 4,
  },
  achievementLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  achievementLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  achievementValue: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  achievementProgress: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  achievementProgressBar: {
    height: '100%',
    borderRadius: 4,
  },
});