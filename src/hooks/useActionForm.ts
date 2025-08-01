import { useCallback } from 'react';
import { storageService } from '../services/storageService';
import { tripService } from '../services/tripService';
import { showAlert, showSuccessAlert } from '../utils/alertUtils';
import { validateEcoActionForm } from '../utils/validationUtils';
import { createEcoActionData } from '../utils/dataFactory';
import { eventEmitter, EVENTS } from '../utils/eventEmitter';
import { useForm } from './useForm';
import { EcoActionType, ActionTypeOption } from '../types';
import * as FileSystem from 'expo-file-system';

interface FormState {
  selectedAction: EcoActionType | null;
  description: string;
  impact: string;
  location: string;
  isLogging: boolean;
  photos: string[];
}

const INITIAL_FORM_STATE: FormState = {
  selectedAction: null,
  description: '',
  impact: '',
  location: '',
  isLogging: false,
  photos: [],
};

const savePhotosToStorage = async (photos: string[]): Promise<string[]> => {
  if (!photos.length) return [];
  
  const savedPhotos: string[] = [];
  const photosDir = `${FileSystem.documentDirectory}ecotrack_photos/`;
  
  const dirInfo = await FileSystem.getInfoAsync(photosDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
  }
  
  for (const photo of photos) {
    try {
      if (photo.startsWith(photosDir)) {
        savedPhotos.push(photo);
        continue;
      }
      
      const filename = `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
      const newPath = `${photosDir}${filename}`;
      
      await FileSystem.copyAsync({
        from: photo,
        to: newPath,
      });
      
      savedPhotos.push(newPath);
    } catch (error) {
      console.warn('Failed to save photo:', error);
    }
  }
  
  return savedPhotos;
};

export const useActionForm = (onActionLogged: () => void, actionTypes: ActionTypeOption[]) => {
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
      const savedPhotos = await savePhotosToStorage(formState.photos);
      
      const actionData = createEcoActionData(
        formState.selectedAction!,
        formState.description,
        parseFloat(formState.impact),
        selectedActionType.impactUnit,
        formState.location
      );

      if (savedPhotos.length > 0) {
        actionData.photos = savedPhotos;
      }

      await storageService.saveAction(actionData);

      const activeTrip = await tripService.getActiveTrip();
      if (activeTrip) {
        const co2Offset = actionData.co2Offset || 0;
        await tripService.updateTripAction(actionData.impact, co2Offset);
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