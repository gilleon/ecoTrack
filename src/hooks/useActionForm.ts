import { useCallback } from 'react';
import { storageService } from '../services/storageService';
import { logService } from '../services/logService';
import { showAlert, showSuccessAlert } from '../utils/alertUtils';
import { validateEcoActionForm } from '../utils/validationUtils';
import { createEcoActionData } from '../utils/dataFactory';
import { eventEmitter, EVENTS } from '../utils/eventEmitter';
import { useForm } from './useForm';
import { EcoActionType, ActionTypeOption, LogAction } from '../types';

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

export const useActionForm = (onActionLogged: () => void, actionTypes: ActionTypeOption[]) => {
  const { formState, updateField, resetForm } = useForm<FormState>(INITIAL_FORM_STATE);
  const selectedActionType = actionTypes.find(action => action.id === formState.selectedAction);

  const getLogAction = (actionType: EcoActionType): LogAction | null => {
    const actionMapping: Record<EcoActionType, LogAction> = {
      'trash_pickup': 'trash-pickup',
      'recycling': 'recycling',
      'zero_waste_camping': 'habitat-restoration',
      'education': 'education-outreach',
    };
    return actionMapping[actionType] || null;
  };

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

      await storageService.saveAction(actionData);

      const logAction = getLogAction(formState.selectedAction!);
      if (logAction) {
        await logService.logAction(logAction, parseFloat(formState.impact), formState.description);
        eventEmitter.emit(EVENTS.TRIP_UPDATED);
      }

      eventEmitter.emit(EVENTS.ACTION_LOGGED);
      updateField('isLogging', false);
      
      showSuccessAlert(
        'Action Logged!',
        `Your ${selectedActionType.title.toLowerCase()} action has been saved successfully.`,
        [
          { text: 'Log Another', onPress: resetForm },
          { text: 'View Dashboard', onPress: onActionLogged }
        ]
      );

    } catch (error) {
      console.error('Error logging action:', error);
      updateField('isLogging', false);
      showAlert('Save Failed', 'Failed to save your action. Please try again.');
    }
  }, [formState, selectedActionType, updateField, resetForm, onActionLogged]);

  return { formState, updateField, resetForm, selectedActionType, handleLogAction };
};