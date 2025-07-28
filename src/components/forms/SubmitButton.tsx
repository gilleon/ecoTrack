import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface SubmitButtonProps {
  onPress: () => void;
  isLoading: boolean;
  title?: string;
  loadingTitle?: string;
  disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onPress,
  isLoading,
  title = 'Submit',
  loadingTitle = 'Submitting...',
  disabled = false,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Pressable
      style={[
        styles.submitButton,
        (isLoading || disabled) && styles.submitButtonDisabled
      ]}
      onPress={onPress}
      disabled={isLoading || disabled}
    >
      <MaterialIcons 
        name={isLoading ? "hourglass-empty" : "add-circle"} 
        size={20} 
        color="white" 
      />
      <Text style={styles.submitButtonText}>
        {isLoading ? loadingTitle : title}
      </Text>
    </Pressable>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});