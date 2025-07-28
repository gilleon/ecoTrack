import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useUnits } from '../contexts/UnitsContext';
import { getActionTypes } from '../types';
import { useActionForm } from '../hooks/useActionForm';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { ActionCard } from '../components/forms/ActionCard';
import { SelectedActionHeader } from '../components/forms/SelectedActionHeader';
import { ActionFormInput } from '../components/forms/ActionFormInput';
import { SubmitButton } from '../components/forms/SubmitButton';

interface LogActionScreenProps {
  onActionLogged: () => void;
}

export default function LogActionScreen({ onActionLogged }: LogActionScreenProps) {
  const { colors } = useTheme();
  const { weightUnit } = useUnits();
  const styles = createStyles(colors);
  
  const actionTypes = getActionTypes(weightUnit);
  
  const {
    formState,
    updateField,
    selectedActionType,
    handleLogAction,
  } = useActionForm(onActionLogged, actionTypes);

  const renderActionTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Action Type</Text>
      <View style={styles.actionGrid}>
        {actionTypes.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            isSelected={formState.selectedAction === action.id}
            onSelect={(actionType) => updateField('selectedAction', actionType)}
          />
        ))}
      </View>
    </View>
  );

  const renderForm = () => {
    if (!formState.selectedAction || !selectedActionType) return null;

    return (
      <View style={styles.section}>
        <SelectedActionHeader actionType={selectedActionType} />

        <ActionFormInput
          label="Description"
          value={formState.description}
          onChangeText={(text) => updateField('description', text)}
          placeholder="Describe what you did..."
          multiline
          numberOfLines={3}
          required
        />

        <ActionFormInput
          label={`Impact (${selectedActionType.impactUnit})`}
          value={formState.impact}
          onChangeText={(text) => updateField('impact', text)}
          placeholder={`Amount in ${selectedActionType.impactUnit}`}
          keyboardType="numeric"
          required
        />

        <ActionFormInput
          label="Location"
          value={formState.location}
          onChangeText={(text) => updateField('location', text)}
          placeholder="Where did this happen?"
        />

        <SubmitButton
          onPress={handleLogAction}
          isLoading={formState.isLogging}
          title="Log Action"
          loadingTitle="Saving..."
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          icon="eco"
          title="Log Eco Action"
          subtitle="Record your positive environmental impact"
        />
        {renderActionTypeSelector()}
        {renderForm()}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bottomSpacing: {
    height: 20,
  },
});