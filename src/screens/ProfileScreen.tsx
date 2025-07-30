import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ImpactSummary } from '../components/profile/ImpactSummary';
import { ActivitySummary } from '../components/profile/ActivitySummary';
import { ProfileActions } from '../components/profile/ProfileActions';

interface ProfileScreenProps {
  onLogout?: () => Promise<void>;
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileHeader />
        <ImpactSummary />
        <ActivitySummary />
        <ProfileActions onLogout={onLogout} />
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});