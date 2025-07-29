import DashboardScreen from '../../src/screens/DashboardScreen';

export default function Dashboard() {
  const handleStartTrip = () => {
    console.log('Starting new trip...');
  };

  return <DashboardScreen onStartTrip={handleStartTrip} />;
}