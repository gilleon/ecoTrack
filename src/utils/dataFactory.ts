import { EcoActionData, EcoActionType } from '../types';
import { storageService } from '../services/storageService';

export const createEcoActionData = (
  actionType: EcoActionType,
  description: string,
  impact: number,
  impactUnit: string,
  location?: string
): EcoActionData => ({
  id: storageService.generateId(),
  actionType,
  description: description.trim(),
  impact,
  impactUnit,
  location: location?.trim() || undefined,
  timestamp: new Date()
});