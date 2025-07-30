import { SafeAreaView } from "react-native-safe-area-context";
import TripsScreen from "../../src/screens/TripsScreen";

export default function TripsTab() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TripsScreen />
    </SafeAreaView>
  );
}
