import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { ActionTypeOption } from '../../types';

interface SelectedActionHeaderProps {
  actionType: ActionTypeOption;
}

export const SelectedActionHeader: React.FC<SelectedActionHeaderProps> = ({
  actionType,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.selectedActionHeader}>
      <View style={[styles.selectedActionIcon, { backgroundColor: `${actionType.color}20` }]}>
        <MaterialIcons name={actionType.icon as any} size={20} color={actionType.color} />
      </View>
      <Text style={styles.selectedActionTitle}>{actionType.title}</Text>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  selectedActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  selectedActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedActionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
});