import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ImpactWidget } from '../ui/ImpactWidget';

interface StatsRowProps {
  ecoScore: number;
  badgesEarned: number;
}

export const StatsRow: React.FC<StatsRowProps> = ({
  ecoScore,
  badgesEarned,
}) => {
  const styles = createStyles();

  return (
    <View style={styles.statsRow}>
      <ImpactWidget
        icon="eco"
        iconFamily="MaterialIcons"
        title="EcoScore"
        value={ecoScore.toString()}
        unit=""
        color="#4CAF50"
      />
      <ImpactWidget
        icon="star"
        iconFamily="MaterialIcons"
        title="Badges Earned"
        value={badgesEarned.toString()}
        unit=""
        color="#FF9800"
      />
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
});