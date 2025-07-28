import { EcoActionType } from '../types';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value.trim()) {
    return { isValid: false, error: `${fieldName} is required.` };
  }
  return { isValid: true };
};

export const validateNumber = (value: string, fieldName: string): ValidationResult => {
  const number = parseFloat(value);
  if (isNaN(number) || number <= 0) {
    return { isValid: false, error: `Please enter a valid positive number for ${fieldName}.` };
  }
  return { isValid: true };
};

export const validateEcoActionForm = (
  selectedAction: EcoActionType | null,
  description: string,
  impact: string
): ValidationResult => {
  if (!selectedAction || !description.trim() || !impact.trim()) {
    return { isValid: false, error: 'Please fill in all required fields.' };
  }

  const impactValidation = validateNumber(impact, 'impact');
  if (!impactValidation.isValid) {
    return impactValidation;
  }

  return { isValid: true };
};