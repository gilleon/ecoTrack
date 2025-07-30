import AsyncStorage from '@react-native-async-storage/async-storage';
import { EcoActionData } from '../types';

const ACTIONS_STORAGE_KEY = 'ecotrack_actions';

class StorageService {
  async saveAction(action: EcoActionData): Promise<void> {
    try {
      const existingActions = await this.getRecentActions(1000);
      const updatedActions = [action, ...existingActions];
      await AsyncStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(updatedActions));
    } catch (error) {
      console.error('Error saving action:', error);
      throw error;
    }
  }

  async getRecentActions(limit: number = 10): Promise<EcoActionData[]> {
    try {
      const actionsData = await AsyncStorage.getItem(ACTIONS_STORAGE_KEY);
      if (!actionsData) return [];

      const actions: EcoActionData[] = JSON.parse(actionsData);
      return actions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting actions:', error);
      return [];
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        ACTIONS_STORAGE_KEY,
        'ecotrack_trips',
        'ecotrack_active_trip'
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();