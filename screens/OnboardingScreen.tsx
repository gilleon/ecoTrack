import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useOnboarding } from '../hooks/useOnboarding';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { OnboardingButton } from '../components/OnboardingButton';
import { onboardingSteps } from '../data/onboardingSteps';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { 
    currentStep, 
    currentStepData, 
    isLast, 
    goNext, 
    totalSteps 
  } = useOnboarding(onboardingSteps);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      goNext();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>{currentStepData.icon}</Text>
          </View>

          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.description}>{currentStepData.description}</Text>
          <Text style={styles.highlight}>{currentStepData.highlight}</Text>
        </View>

        <View style={styles.navigationContainer}>
          <OnboardingButton
            onPress={onComplete}
            title="Skip"
            variant="secondary"
          />
          
          <OnboardingButton
            onPress={handleNext}
            title={isLast ? 'Get Started' : 'Next'}
            variant="primary"
            showArrow={!isLast}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F0',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#C3E6C3',
  },
  iconText: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  highlight: {
    fontSize: 14,
    color: '#2D5A3D',
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
});