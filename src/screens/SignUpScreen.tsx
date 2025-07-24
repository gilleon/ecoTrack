import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useAuthForm } from '../hooks/useAuthForm';
import { useAuthValidation } from '../hooks/useAuthValidation';
import { AuthContainer } from '../components/auth/AuthContainer';
import { AuthHeader } from '../components/auth/AuthHeader';
import { AuthCard } from '../components/auth/AuthCard';
import { EmailPasswordForm } from '../components/auth/EmailPasswordForm';
import { AuthButton } from '../components/auth/AuthButton';
import { AuthLink } from '../components/auth/AuthLink';

interface SignUpScreenProps {
  onSignUp: () => void;
  onBackToLogin: () => void;
}

export default function SignUpScreen({ onSignUp, onBackToLogin }: SignUpScreenProps) {
  const { signUp, isLoading } = useAuth();
  const { validateSignUpForm } = useAuthValidation();
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    togglePasswordVisibility,
    getCleanEmail,
  } = useAuthForm();

  const handleSignUp = async () => {
    if (!validateSignUpForm(email, password, confirmPassword)) {
      return;
    }

    const result = await signUp(getCleanEmail(), password);
    
    if (result.success) {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: onSignUp }
      ]);
    } else {
      Alert.alert('Sign Up Failed', result.error || 'Please try again');
    }
  };

  return (
    <AuthContainer>
      <AuthHeader 
        title="Create Account"
        subtitle="Start your eco-journey today"
      />

      <AuthCard>

          <EmailPasswordForm
            email={email}
            onEmailChange={setEmail}
            password={password}
            onPasswordChange={setPassword}
            showPassword={showPassword}
            onTogglePassword={togglePasswordVisibility}
            disabled={isLoading}
            showConfirmPassword
            confirmPassword={confirmPassword}
            onConfirmPasswordChange={setConfirmPassword}
          />

          <AuthButton
            title="Create Account"
            onPress={handleSignUp}
            loading={isLoading}
            loadingText="Creating Account..."
          />

          <AuthLink
            text="Already have an account? "
            linkText="Sign in"
            onPress={onBackToLogin}
            disabled={isLoading}
          />
        
      </AuthCard>
    </AuthContainer>
  );
}