import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export const ProfileHeader: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const styles = createStyles(colors);

  const getUserDisplayName = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Eco Warrior';
  };

  const getUserEmail = () => {
    return user?.email || 'demo@ecotrack.app';
  };

  return (
    <View style={styles.header}>
      <View style={styles.profileImageContainer}>
        <MaterialIcons name="account-circle" size={80} color={colors.primary} />
      </View>
      <Text style={styles.userName}>{getUserDisplayName()}</Text>
      <Text style={styles.userEmail}>{getUserEmail()}</Text>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 24,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});