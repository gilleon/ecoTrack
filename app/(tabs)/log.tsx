import { router } from 'expo-router';
import LogActionScreen from '../../src/screens/LogActionScreen';

export default function LogAction() {
  const handleActionLogged = () => {
    router.push('/(tabs)');
  };

  return <LogActionScreen onActionLogged={handleActionLogged} />;
}