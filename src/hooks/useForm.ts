import { useState } from 'react';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function useForm<T>(initialState: T) {
  const [formState, setFormState] = useState<T>(initialState);

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => setFormState(initialState);

  const updateFormState = (updates: Partial<T>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  return {
    formState,
    updateField,
    resetForm,
    updateFormState,
    setFormState
  };
}