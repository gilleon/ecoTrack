import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface OnboardingButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
  showArrow?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  showArrow = false,
  style,
  textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[
        styles.buttonText,
        variant === 'primary' ? styles.primaryText : styles.secondaryText,
        textStyle,
      ]}>
        {title}
      </Text>
      {showArrow && <Text style={styles.arrow}>→</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#2D5A3D',
    paddingHorizontal: 24,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
  },
  primaryText: {
    color: 'white',
    fontWeight: '500',
  },
  secondaryText: {
    color: '#6B7280',
  },
  arrow: {
    fontSize: 16,
    color: 'white',
  },
});