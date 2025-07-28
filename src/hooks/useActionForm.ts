import { useCallback } from 'react';
import { storageService } from '../services/storageService';
import { showAlert, showSuccessAlert } from '../utils/alertUtils';
import { validateEcoActionForm } from '../utils/validationUtils';
import { createEcoActionData } from '../utils/dataFactory';
import { useForm } from './useForm';
import { EcoActionType, actionTypes } from '../types';

interface FormState {
  selectedAction: EcoActionType | null;
  description: string;
  impact: string;
  location: string;
  isLogging: boolean;
}

const INITIAL_FORM_STATE: FormState = {
  selectedAction: null,
  description: '',
  impact: '',
  location: '',
  isLogging: false,
};

export const useActionForm = (onActionLogged: () => void) => {
  const { formState, updateField, resetForm } = useForm<FormState>(INITIAL_FORM_STATE);

  const selectedActionType = actionTypes.find(action => action.id === formState.selectedAction);

  const handleLogAction = useCallback(async () => {
    const validation = validateEcoActionForm(
      formState.selectedAction,
      formState.description,
      formState.impact
    );

    if (!validation.isValid) {
      showAlert('Invalid Input', validation.error!);
      return;
    }

    if (!selectedActionType) return;

    updateField('isLogging', true);

    try {
      const actionData = createEcoActionData(
        formState.selectedAction!,
        formState.description,
        parseFloat(formState.impact),
        selectedActionType.impactUnit,
        formState.location
      );

      await storageService.saveEcoAction(actionData);
      updateField('isLogging', false);
      
      showSuccessAlert(
        'Action Logged!',
        `Your ${selectedActionType.title.toLowerCase()} action has been saved successfully.\n\nImpact: ${parseFloat(formState.impact)} ${selectedActionType.impactUnit}`,
        [
          { text: 'Log Another', onPress: resetForm },
          { text: 'View Dashboard', onPress: onActionLogged }
        ]
      );
    } catch (error) {
      updateField('isLogging', false);
      showAlert('Save Failed', 'Failed to save your action. Please try again.');
    }
  }, [formState, selectedActionType, updateField, resetForm, onActionLogged]);

  return {
    formState,
    updateField,
    resetForm,
    selectedActionType,
    handleLogAction,
  };
};