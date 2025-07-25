import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { DashboardCard } from '../components/ui/DashboardCard';
import { ImpactWidget } from '../components/ui/ImpactWidget';
import { ImpactProgressBar } from '../components/ui/ImpactProgressBar';

interface DashboardScreenProps {
  onStartTrip: () => void;
}

export default function DashboardScreen({ onStartTrip }: DashboardScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning! 🌱</Text>
          <Text style={styles.subtitle}>Ready to make a positive impact today?</Text>
        </View>
        
        <DashboardCard
          title="Current Adventure"
          icon="terrain"
          iconFamily="MaterialIcons"
        >
          <Text style={styles.adventureSubtitle}>Ready for your next adventure?</Text>
          <Pressable style={styles.startTripButton} onPress={onStartTrip}>
            <MaterialIcons name="terrain" size={20} color="white" />
            <Text style={styles.startTripText}>Start New Trip</Text>
          </Pressable>
        </DashboardCard>

        <View style={styles.statsRow}>
          <ImpactWidget
            icon="eco"
            iconFamily="MaterialIcons"
            title="EcoScore"
            value="45"
            unit=""
            color="#4CAF50"
          />
          <ImpactWidget
            icon="star"
            iconFamily="MaterialIcons"
            title="Badges Earned"
            value="2"
            unit=""
            color="#FF9800"
          />
        </View>

        <DashboardCard
          title="Your Impact"
          icon="trending-up"
          iconFamily="MaterialIcons"
        >
          <View style={styles.impactSection}>
            <ImpactProgressBar
              icon="delete"
              title="Waste Collected"
              value="2.5 lbs"
              progress={0.6}
              color="#FF6B6B"
            />
            <ImpactProgressBar
              icon="eco"
              title="CO₂ Offset"
              value="12 kg"
              progress={0.8}
              color="#4CAF50"
            />
            <View style={styles.totalActions}>
              <Text style={styles.totalActionsLabel}>Total Actions</Text>
              <Text style={styles.totalActionsValue}>3</Text>
            </View>
          </View>
        </DashboardCard>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    header: {
      paddingTop: 20,
      paddingBottom: 16,
    },
    greeting: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    adventureSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 16,
      textAlign: "center",
    },
    startTripButton: {
      backgroundColor: colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      gap: 8,
    },
    startTripText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
    statsRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    impactSection: {
      gap: 16,
    },
    totalActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    totalActionsLabel: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    totalActionsValue: {
      fontSize: 20,
      color: colors.text,
      fontWeight: "700",
    },
    bottomSpacing: {
      height: 20,
    },
  });