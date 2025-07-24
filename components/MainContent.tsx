import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface MainContentProps {
  title?: string;
  subtitle?: string;
  onOpenSettings?: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({
  title = "Welcome to EcoTrack!",
  subtitle = "Main app content goes here",
  onOpenSettings
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      
      {onOpenSettings && (
        <Pressable style={styles.settingsButton} onPress={onOpenSettings}>
          <Text style={styles.settingsText}>⚙️ Settings</Text>
        </Pressable>
      )}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  settingsButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  settingsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});