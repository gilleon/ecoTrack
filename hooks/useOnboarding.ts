import { useState } from 'react';

export interface OnboardingStep {
  icon: string;
  title: string;
  description: string;
  highlight: string;
}

export const useOnboarding = (steps: OnboardingStep[]) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;
  const currentStepData = steps[currentStep];
  
  const goNext = () => {
    if (!isLast) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const goPrevious = () => {
    if (!isFirst) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };
  
  return {
    currentStep,
    currentStepData,
    isLast,
    isFirst,
    goNext,
    goPrevious,
    goToStep,
    totalSteps: steps.length,
  };
};