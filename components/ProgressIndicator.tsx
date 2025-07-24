import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <ProgressDot key={i} isActive={i <= currentStep} index={i} />
      ))}
    </View>
  );
};

const ProgressDot: React.FC<{ isActive: boolean; index: number }> = ({ 
  isActive, 
  index 
}) => {
  const width = useSharedValue(10);
  const backgroundColor = useSharedValue(isActive ? '#2D5A3D' : '#E0E0E0');

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(width.value, { duration: 300 }),
    backgroundColor: backgroundColor.value,
  }));

  React.useEffect(() => {
    width.value = isActive ? 24 : 10;
    backgroundColor.value = withTiming(isActive ? '#2D5A3D' : '#E0E0E0', {
      duration: 300,
    });
  }, [isActive, width, backgroundColor]);

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
});