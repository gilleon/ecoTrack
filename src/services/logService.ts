import { LogAction } from '../types/log';
import { tripService } from './tripService';

class LogService {
  async logAction(action: LogAction, weight?: number, notes?: string): Promise<{ 
    success: boolean; 
    error?: string; 
  }> {
    try {
      const actionWeight = weight || this.getDefaultWeight(action);
      const co2Offset = this.calculateCO2Offset(action, actionWeight);

      const activeTrip = await tripService.getActiveTrip();
      if (activeTrip) {
        await tripService.updateTripAction(actionWeight, co2Offset);
      }

      return { success: true };
    } catch (error) {
      console.error('Error logging action:', error);
      return { 
        success: false, 
        error: 'Failed to log action. Please try again.' 
      };
    }
  }

  private getDefaultWeight(action: LogAction): number {
    const weights: Record<LogAction, number> = {
      'trash-pickup': 0.5,
      'recycling': 0.3,
      'wildlife-observation': 0,
      'trail-maintenance': 1.0,
      'invasive-species-removal': 0.8,
      'water-quality-testing': 0,
      'education-outreach': 0,
      'habitat-restoration': 2.0,
    };
    return weights[action] || 0;
  }

  private calculateCO2Offset(action: LogAction, weight: number): number {
    const co2Factors: Record<LogAction, number> = {
      'trash-pickup': 2.1,
      'recycling': 3.2,
      'wildlife-observation': 0.1,
      'trail-maintenance': 1.5,
      'invasive-species-removal': 1.8,
      'water-quality-testing': 0.2,
      'education-outreach': 0.5,
      'habitat-restoration': 4.2,
    };
    return (co2Factors[action] || 0) * weight;
  }
}

export const logService = new LogService();