import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  loadingText?: string;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  loadingText
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors, variant);

  return (
    <Pressable
      style={[styles.button, (loading || disabled) && styles.buttonDisabled]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.buttonText}>
        {loading && loadingText ? loadingText : title}
      </Text>
    </Pressable>
  );
};

const createStyles = (colors: any, variant: 'primary' | 'secondary') => StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: variant === 'primary' ? colors.primary : colors.primaryLight,
    borderRadius: 12,
    height: 48,
    borderWidth: variant === 'secondary' ? 1 : 0,
    borderColor: variant === 'secondary' ? colors.border : 'transparent',
    gap: 8,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: variant === 'primary' ? '600' : '500',
    color: variant === 'primary' ? 'white' : colors.text,
  },
  icon: {
    fontSize: 16,
  },
});