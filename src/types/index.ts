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

export const actionTypes: ActionTypeOption[] = [
  {
    id: 'trash_pickup',
    title: 'Trash Pickup',
    description: 'Remove litter from trails and campsites',
    icon: 'delete',
    color: '#FF6B6B',
    impactUnit: 'lbs'
  },
  {
    id: 'recycling',
    title: 'Recycling',
    description: 'Properly sort and recycle materials',
    icon: 'recycling',
    color: '#4ECDC4',
    impactUnit: 'lbs'
  },
  {
    id: 'zero_waste_camping',
    title: 'Zero Waste Camping',
    description: 'Leave no trace camping practices',
    icon: 'eco',
    color: '#45B7D1',
    impactUnit: 'days'
  },
  {
    id: 'education',
    title: 'Education & Awareness',
    description: 'Share eco-knowledge with others',
    icon: 'school',
    color: '#A55EEA',
    impactUnit: 'people'
  }
];