import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backText?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  backText = '← Back'
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.header}>
      {showBackButton && onBackPress && (
        <Pressable onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backText}>{backText}</Text>
        </Pressable>
      )}
      
      <View style={styles.logoContainer}>
        <Text style={styles.logoIcon}>🏔️</Text>
        <Text style={styles.logoText}>EcoTrack</Text>
      </View>
      <Text style={styles.subtitle}>Track your impact, one adventure at a time</Text>
      
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{subtitle}</Text>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: colors.primary,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});