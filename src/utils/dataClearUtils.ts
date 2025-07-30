import { Alert } from 'react-native';
import { storageService } from '../services/storageService';

interface DataClearOptions {
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  resetContexts?: () => void;
}

export const dataClearUtils = {
  showClearDataConfirmation: (options: DataClearOptions = {}) => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your eco-actions and progress. This action cannot be undone.\n\nAre you absolutely sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: () => dataClearUtils.showFinalConfirmation(options),
        },
      ]
    );
  },

  showFinalConfirmation: (options: DataClearOptions = {}) => {
    Alert.alert(
      'Final Confirmation',
      'Talk a walk to the windows and be certain you want to perform this action. All your eco-actions, progress, and statistics will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Delete Everything',
          style: 'destructive',
          onPress: () => dataClearUtils.performDataClear(options),
        },
      ]
    );
  },

  performDataClear: async (options: DataClearOptions = {}) => {
    try {
      options.onStart?.();

      await storageService.clearAllData();

      options.resetContexts?.();

      Alert.alert(
        'Data Cleared Successfully',
        'All your data has been permanently deleted. The app will now show as if you\'re starting fresh.',
        [
          {
            text: 'OK',
            onPress: () => {
              options.onSuccess?.();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error clearing data:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'There was an error clearing your data. Please try again or contact support if the problem persists.';
      
      Alert.alert(
        'Clear Data Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
      
      options.onError?.(errorMessage);
    }
  },

  clearDataWithDefaults: (
    resetContexts: () => void,
    onComplete?: () => void
  ) => {
    let isClearing = false;

    const options: DataClearOptions = {
      onStart: () => {
        isClearing = true;
      },
      onSuccess: () => {
        isClearing = false;
        onComplete?.();
      },
      onError: () => {
        isClearing = false;
      },
      resetContexts,
    };

    dataClearUtils.showClearDataConfirmation(options);
    
    return () => isClearing;
  },
};