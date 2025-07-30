import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import ProfileScreen from '../../src/screens/ProfileScreen';

export default function Profile() {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return <ProfileScreen onLogout={handleLogout} />;
}