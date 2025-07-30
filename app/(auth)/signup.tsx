import { router } from 'expo-router';
import SignUpScreen from '../../src/screens/SignUpScreen';

export default function SignUp() {
  const handleSignUpComplete = () => {
    router.replace('/(tabs)');
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SignUpScreen
      onSignUp={handleSignUpComplete}
      onBackToLogin={handleBackToLogin}
    />
  );
}