import React from 'react';
import { AuthInput } from './AuthInput';

interface EmailPasswordFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  password: string;
  onPasswordChange: (password: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  disabled?: boolean;
  showConfirmPassword?: boolean;
  confirmPassword?: string;
  onConfirmPasswordChange?: (password: string) => void;
}

export const EmailPasswordForm: React.FC<EmailPasswordFormProps> = ({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onTogglePassword,
  disabled = false,
  showConfirmPassword = false,
  confirmPassword = '',
  onConfirmPasswordChange,
}) => {
  return (
    <>
      <AuthInput
        label="Email"
        icon="✉️"
        placeholder="Enter your email"
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        disabled={disabled}
      />

      <AuthInput
        label="Password"
        icon="🔒"
        placeholder="Enter your password"
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry={!showPassword}
        showPasswordToggle
        isPasswordVisible={showPassword}
        onTogglePassword={onTogglePassword}
        disabled={disabled}
      />

      {showConfirmPassword && onConfirmPasswordChange && (
        <AuthInput
          label="Confirm Password"
          icon="🔒"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={onConfirmPasswordChange}
          secureTextEntry={!showPassword}
          disabled={disabled}
        />
      )}
    </>
  );
};