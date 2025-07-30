import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardScreen from '../../src/screens/DashboardScreen';

export default function HomeTab() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DashboardScreen />
    </SafeAreaView>
  );
}