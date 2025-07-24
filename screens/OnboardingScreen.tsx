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
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>{currentStepData.icon}</Text>
            </View>

            <Text style={styles.title}>{currentStepData.title}</Text>
            <Text style={styles.description}>{currentStepData.description}</Text>
            
            <View style={styles.highlightContainer}>
              <Text style={styles.highlight}>{currentStepData.highlight}</Text>
            </View>
          </View>
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
    paddingHorizontal: 10,
    paddingVertical: 40,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    maxWidth: 400,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F9F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E0F2E0',
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  highlightContainer: {
    backgroundColor: '#F0F9F0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0F2E0',
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