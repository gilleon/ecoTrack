import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconFamily?: 'MaterialIcons' | 'Ionicons';
  children?: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  icon,
  iconFamily = 'MaterialIcons',
  children,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const renderIcon = () => {
    if (!icon) return null;
    
    switch (iconFamily) {
      case 'MaterialIcons':
        return <MaterialIcons name={icon as any} size={20} color={colors.text} />;
      case 'Ionicons':
        return <Ionicons name={icon as any} size={20} color={colors.text} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {renderIcon()}
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
});