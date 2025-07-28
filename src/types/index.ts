import { useUnits } from '../contexts/UnitsContext';

export type EcoActionType = 'trash_pickup' | 'recycling' | 'zero_waste_camping' | 'education';

export interface EcoActionData {
  id: string;
  actionType: EcoActionType;
  description: string;
  impact: number;
  impactUnit: string;
  location?: string;
  timestamp: Date;
}

export interface UserStats {
  totalActions: number;
  totalWasteCollected: number;
  totalCO2Offset: number;
  ecoScore: number;
  badgesEarned: number;
  lastActionDate: string | null;
  lastUpdated: string;
}

export interface ActionTypeOption {
  id: EcoActionType;
  title: string;
  description: string;
  icon: string;
  color: string;
  impactUnit: string;
}

export const getActionTypes = (weightUnit: 'lb' | 'kg'): ActionTypeOption[] => [
  {
    id: 'trash_pickup',
    title: 'Trash Pickup',
    description: 'Clean up litter from trails and campsites',
    icon: 'delete',
    color: '#FF6B6B',
    impactUnit: weightUnit,
  },
  {
    id: 'recycling',
    title: 'Recycling',
    description: 'Properly recycle materials',
    icon: 'recycling',
    color: '#4ECDC4',
    impactUnit: weightUnit,
  },
  {
    id: 'zero_waste_camping',
    title: 'Zero Waste Camping',
    description: 'Leave no trace camping practices',
    icon: 'nature',
    color: '#45B7D1',
    impactUnit: 'days',
  },
  {
    id: 'education',
    title: 'Education & Awareness',
    description: 'Teach others about environmental responsibility',
    icon: 'school',
    color: '#96CEB4',
    impactUnit: 'people',
  },
];

export const actionTypes: ActionTypeOption[] = [
  {
    id: 'trash_pickup',
    title: 'Trash Pickup',
    description: 'Clean up litter from trails and campsites',
    icon: 'delete',
    color: '#FF6B6B',
    impactUnit: 'lbs',
  },
  {
    id: 'recycling',
    title: 'Recycling',
    description: 'Properly recycle materials',
    icon: 'recycling',
    color: '#4ECDC4',
    impactUnit: 'lbs',
  },
  {
    id: 'zero_waste_camping',
    title: 'Zero Waste Camping',
    description: 'Leave no trace camping practices',
    icon: 'nature',
    color: '#45B7D1',
    impactUnit: 'days',
  },
  {
    id: 'education',
    title: 'Education & Awareness',
    description: 'Teach others about environmental responsibility',
    icon: 'school',
    color: '#96CEB4',
    impactUnit: 'people',
  },
];