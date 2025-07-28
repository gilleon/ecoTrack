import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { ActionTypeOption, EcoActionType } from '../../types';

interface ActionCardProps {
  action: ActionTypeOption;
  isSelected: boolean;
  onSelect: (actionType: EcoActionType) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  action,
  isSelected,
  onSelect,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      style={[
        styles.actionCard,
        isSelected && styles.actionCardSelected
      ]}
      onPress={() => onSelect(action.id)}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
        <MaterialIcons name={action.icon as any} size={24} color={action.color} />
      </View>
      <Text style={styles.actionTitle}>{action.title}</Text>
      <Text style={styles.actionDescription}>{action.description}</Text>
    </Pressable>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});