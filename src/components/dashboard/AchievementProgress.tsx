import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { DashboardCard } from '../ui/DashboardCard';

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

  const getNextBadgeText = (actions: number, score: number): string => {
    if (actions < 5) return `${5 - actions} more actions for "Getting Started"`;
    if (actions < 10) return `${10 - actions} more actions for "Action Hero"`;
    if (actions < 25) return `${25 - actions} more actions for "Eco Warrior"`;
    if (actions < 50) return `${50 - actions} more actions for "Environmental Champion"`;
    if (score < 100) return `${100 - score} more points for "High Impact"`;
    if (score < 250) return `${250 - score} more points for "Eco Legend"`;
    if (score < 500) return `${500 - score} more points for "Planet Guardian"`;
    return 'All badges earned!';
  };

  const getNextBadgeProgress = (actions: number, score: number): number => {
    if (actions < 5) return (actions / 5) * 100;
    if (actions < 10) return (actions / 10) * 100;
    if (actions < 25) return (actions / 25) * 100;
    if (actions < 50) return (actions / 50) * 100;
    if (score < 100) return (score / 100) * 100;
    if (score < 250) return (score / 250) * 100;
    if (score < 500) return (score / 500) * 100;
    return 100;
  };

  return (
    <DashboardCard title="Achievement Progress" icon="emoji-events" iconFamily="MaterialIcons">
      <View style={styles.achievementSection}>
        <View style={styles.achievementItem}>
          <View style={styles.achievementLabelRow}>
            <MaterialIcons name="flag" size={16} color={colors.primary} />
            <Text style={styles.achievementLabel}>Next Badge</Text>
          </View>
          <Text style={styles.achievementValue}>
            {getNextBadgeText(totalActions, ecoScore)}
          </Text>
        </View>
        <View style={styles.achievementProgress}>
          <View 
            style={[
              styles.achievementProgressBar,
              { 
                width: `${getNextBadgeProgress(totalActions, ecoScore)}%`,
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