import AsyncStorage from '@react-native-async-storage/async-storage';
import { EcoActionData, UserStats } from '../types';

class StorageService {
  private readonly ECO_ACTIONS_KEY = 'eco_actions';
  private readonly USER_STATS_KEY = 'user_stats';

  generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2);

  calculateBadges = (ecoScore: number, totalActions: number): string[] => {
    const badges = [];
    if (totalActions >= 1) badges.push('First Action');
    if (totalActions >= 5) badges.push('Getting Started');
    if (totalActions >= 10) badges.push('Action Hero');
    if (totalActions >= 25) badges.push('Eco Warrior');
    if (totalActions >= 50) badges.push('Environmental Champion');
    if (ecoScore >= 50) badges.push('Impact Maker');
    if (ecoScore >= 100) badges.push('High Impact');
    if (ecoScore >= 250) badges.push('Eco Legend');
    if (ecoScore >= 500) badges.push('Planet Guardian');
    return badges;
  };

  async getEcoActions(): Promise<EcoActionData[]> {
    try {
      const actionsJson = await AsyncStorage.getItem(this.ECO_ACTIONS_KEY);
      if (!actionsJson) return [];
      const actions = JSON.parse(actionsJson);
      return actions.map((action: any) => ({
        ...action,
        timestamp: new Date(action.timestamp)
      }));
    } catch (error) {
      console.error('Error getting eco actions:', error);
      return [];
    }
  }

  async saveEcoAction(action: EcoActionData): Promise<void> {
    try {
      const existingActions = await this.getEcoActions();
      const updatedActions = [action, ...existingActions];
      await AsyncStorage.setItem(this.ECO_ACTIONS_KEY, JSON.stringify(updatedActions));
      await this.updateUserStats(updatedActions);
    } catch (error) {
      console.error('Error saving eco action:', error);
      throw error;
    }
  }

  async getUserStats(): Promise<UserStats> {
    try {
      const statsJson = await AsyncStorage.getItem(this.USER_STATS_KEY);
      if (!statsJson) {
        return {
          totalActions: 0,
          totalWasteCollected: 0,
          totalCO2Offset: 0,
          ecoScore: 0,
          badgesEarned: 0,
          lastActionDate: null,
          lastUpdated: new Date().toISOString()
        };
      }
      return JSON.parse(statsJson);
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalActions: 0,
        totalWasteCollected: 0,
        totalCO2Offset: 0,
        ecoScore: 0,
        badgesEarned: 0,
        lastActionDate: null,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  private async updateUserStats(actions: EcoActionData[]): Promise<void> {
    try {
      let totalWasteCollected = 0;
      let totalCO2Offset = 0;

      actions.forEach(action => {
        switch (action.actionType) {
          case 'trash_pickup':
          case 'recycling':
            totalWasteCollected += action.impact;
            totalCO2Offset += action.impact * 0.5;
            break;
          case 'zero_waste_camping':
            totalCO2Offset += action.impact * 2;
            break;
          case 'education':
            totalCO2Offset += action.impact * 0.1;
            break;
        }
      });

      const ecoScore = Math.floor(totalCO2Offset * 2 + totalWasteCollected * 3);
      const badges = this.calculateBadges(ecoScore, actions.length);

      const userStats: UserStats = {
        totalActions: actions.length,
        totalWasteCollected: Math.round(totalWasteCollected * 10) / 10,
        totalCO2Offset: Math.round(totalCO2Offset * 10) / 10,
        ecoScore,
        badgesEarned: badges.length,
        lastActionDate: actions.length > 0 ? actions[0].timestamp.toISOString() : null,
        lastUpdated: new Date().toISOString()
      };

      await AsyncStorage.setItem(this.USER_STATS_KEY, JSON.stringify(userStats));
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  async getRecentActions(limit: number = 3): Promise<EcoActionData[]> {
    const actions = await this.getEcoActions();
    return actions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getNextBadgeText = (totalActions: number, ecoScore: number): string => {
    if (totalActions < 5) return `${5 - totalActions} more actions for "Getting Started"`;
    if (totalActions < 10) return `${10 - totalActions} more actions for "Action Hero"`;
    if (totalActions < 25) return `${25 - totalActions} more actions for "Eco Warrior"`;
    if (totalActions < 50) return `${50 - totalActions} more actions for "Environmental Champion"`;
    if (ecoScore < 100) return `${100 - ecoScore} more points for "High Impact"`;
    if (ecoScore < 250) return `${250 - ecoScore} more points for "Eco Legend"`;
    if (ecoScore < 500) return `${500 - ecoScore} more points for "Planet Guardian"`;
    return 'All badges earned!';
  };

  getNextBadgeProgress = (totalActions: number, ecoScore: number): number => {
    if (totalActions < 5) return (totalActions / 5) * 100;
    if (totalActions < 10) return (totalActions / 10) * 100;
    if (totalActions < 25) return (totalActions / 25) * 100;
    if (totalActions < 50) return (totalActions / 50) * 100;
    if (ecoScore < 100) return (ecoScore / 100) * 100;
    if (ecoScore < 250) return (ecoScore / 250) * 100;
    if (ecoScore < 500) return (ecoScore / 500) * 100;
    return 100;
  };

  formatActionType = (actionType: string): string => {
    return actionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 18) return 'Good afternoon!';
    return 'Good evening!';
  };

  getSubtitle = (totalActions: number): string => {
    if (totalActions === 0) return 'Ready to start your eco journey?';
    if (totalActions < 5) return 'Great start! Keep up the momentum!';
    if (totalActions < 10) return 'You\'re building great eco habits!';
    return 'Amazing work protecting our planet!';
  };

  getLastActionText = (lastActionDate: string | null): string => {
    if (!lastActionDate) return 'No actions yet';
    const lastAction = new Date(lastActionDate);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - lastAction.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  async clearAllData(): Promise<void> {
    try {
      const keysToRemove = [
        this.ECO_ACTIONS_KEY,
        this.USER_STATS_KEY,
        'weightUnit',
        'carbonUnit',
        'themeMode',
      ];
      
      console.log('Clearing keys:', keysToRemove);
      
      await AsyncStorage.multiRemove(keysToRemove);
      
      console.log('All EcoTrack data cleared successfully');
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear data');
    }
  }

  async resetToDefaults(): Promise<void> {
    try {
      await this.clearAllData();
      
      await this.updateUserStats([]);
      
      console.log('App reset to defaults successfully');
    } catch (error) {
      console.error('Error resetting to defaults:', error);
      throw new Error('Failed to reset app');
    }
  }
}

export const storageService = new StorageService();