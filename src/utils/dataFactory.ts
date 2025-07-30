import { EcoActionData, EcoActionType } from '../types';

export const createEcoActionData = (
  action: EcoActionType,
  description: string,
  impact: number,
  impactUnit: string,
  location: string
): EcoActionData => {
  const co2Offset = calculateCO2Offset(action, impact);
  
  return {
    id: `action_${Date.now()}`,
    type: action,
    description,
    impact,
    impactUnit,
    location,
    timestamp: new Date().toISOString(),
    co2Offset,
  };
};

const calculateCO2Offset = (action: EcoActionType, impact: number): number => {
  const co2Factors: Record<EcoActionType, number> = {
    'trash_pickup': 2.1,
    'recycling': 3.2,
    'zero_waste_camping': 1.5,
    'education': 0.5,
  };
  
  return (co2Factors[action] || 0) * impact;
};