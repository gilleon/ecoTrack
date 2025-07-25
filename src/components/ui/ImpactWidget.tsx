import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface ImpactWidgetProps {
  icon: string;
  iconFamily: 'MaterialIcons' | 'Ionicons';
  title: string;
  value: string;
  unit: string;
  color: string;
}

export const ImpactWidget: React.FC<ImpactWidgetProps> = ({
  icon,
  iconFamily,
  title,
  value,
  unit,
  color,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors, color);

  const renderIcon = () => {
    switch (iconFamily) {
      case 'MaterialIcons':
        return <MaterialIcons name={icon as any} size={24} color={color} />;
      case 'Ionicons':
        return <Ionicons name={icon as any} size={24} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <Text style={styles.value}>
        {value}
        {unit && <Text style={styles.unit}> {unit}</Text>}
      </Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const createStyles = (colors: any, accentColor: string) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${accentColor}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  unit: {
    fontSize: 16,
    fontWeight: '400',
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
});