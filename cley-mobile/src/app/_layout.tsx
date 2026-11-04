import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: THEME.colors.surface,
          },
          headerTintColor: THEME.colors.primary,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: THEME.typography.h3,
            color: THEME.colors.textPrimary,
          },
          contentStyle: {
            backgroundColor: THEME.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            title: "Conociéndonos",
            headerBackTitle: "Atrás",
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            title: "Menú Principal",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="assistant"
          options={{
            title: "Hablar con Cley",
          }}
        />
        <Stack.Screen
          name="lessons"
          options={{
            title: "Aprender a usar Apps",
          }}
        />
        <Stack.Screen
          name="medications"
          options={{
            title: "Mis Pastillas",
          }}
        />
        <Stack.Screen
          name="sos"
          options={{
            title: "Ayuda SOS",
            headerStyle: { backgroundColor: THEME.colors.dangerLight },
            headerTintColor: THEME.colors.danger,
          }}
        />
        <Stack.Screen
          name="evaluation"
          options={{
            title: "Tu Opinión",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
