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
import { AuthDivider } from '../components/auth/AuthDivider';
import { AuthLink } from '../components/auth/AuthLink';

interface LoginScreenProps {
  onLogin: () => void;
  onDemoMode: () => void;
  onSignUp: () => void;
}

export default function LoginScreen({ onLogin, onDemoMode, onSignUp }: LoginScreenProps) {
  const { signIn, isLoading } = useAuth();
  const { validateLoginForm } = useAuthValidation();
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    getCleanEmail,
  } = useAuthForm();

  const handleLogin = async () => {
    if (!validateLoginForm(email, password)) {
      return;
    }

    const result = await signIn(getCleanEmail(), password);
    
    if (result.success) {
      onLogin();
    } else {
      Alert.alert('Login Failed', result.error || 'Please check your credentials and try again');
    }
  };

  return (
    <AuthContainer>
      <AuthHeader 
        title="Welcome Back"
        subtitle="Continue your eco-journey"
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
          />

          <AuthButton
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            loadingText="Signing In..."
          />

          <AuthDivider />

          <AuthButton
            title="Try Demo Mode"
            onPress={onDemoMode}
            variant="secondary"
            icon="leaf-outline"
            disabled={isLoading}
          />

          <AuthLink
            text="Don't have an account? "
            linkText="Sign up"
            onPress={onSignUp}
            disabled={isLoading}
          />

      </AuthCard>
    </AuthContainer>
  );
}