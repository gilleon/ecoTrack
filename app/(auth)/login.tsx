import { router } from 'expo-router';
import LoginScreen from '../../src/screens/LoginScreen';

export default function Login() {
  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  const handleDemoMode = () => {
    router.replace('/(tabs)');
  };

  return (
    <LoginScreen
      onLogin={handleLogin}
      onSignUp={handleSignUp}
      onDemoMode={handleDemoMode}
    />
  );
}