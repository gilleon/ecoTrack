import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { AuthProvider } from '../src/contexts/AuthContext';
import { UnitsProvider } from '../src/contexts/UnitsContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <UnitsProvider>
            <Stack 
              screenOptions={{ 
                headerShown: false,
                contentStyle: { paddingTop: 30 }
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen 
                name="settings" 
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  contentStyle: { paddingTop: 20 }
                }}
              />
            </Stack>
            <StatusBar style="auto" />
          </UnitsProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}