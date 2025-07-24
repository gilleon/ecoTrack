import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthInputProps extends TextInputProps {
  label: string;
  icon: React.ReactNode;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
  disabled?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label,
  icon,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePassword,
  disabled = false,
  ...textInputProps
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <View style={styles.iconContainer}>
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<any>, { color: colors.textSecondary })
            : icon}
        </View>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textSecondary}
          editable={!disabled}
          {...textInputProps}
        />
        {showPasswordToggle && onTogglePassword && (
          <Pressable
            onPress={onTogglePassword}
            style={styles.eyeButton}
            disabled={disabled}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'} 
              size={20} 
              color={colors.textSecondary} 
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 48,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  eyeButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});