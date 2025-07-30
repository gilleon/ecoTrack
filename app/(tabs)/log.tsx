import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import LogActionScreen from '../../src/screens/LogActionScreen';

export default function LogTab() {
  const handleActionLogged = () => {
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LogActionScreen onActionLogged={handleActionLogged} />
    </SafeAreaView>
  );
}