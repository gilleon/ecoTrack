import { router } from 'expo-router';
import SettingsScreen from '../src/screens/SettingsScreen';

export default function Settings() {
  const handleBack = () => {
    router.back();
  };

  return <SettingsScreen onBack={handleBack} />;
}