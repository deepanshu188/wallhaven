import { Stack } from 'expo-router/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StyleSheet, StatusBar } from 'react-native';
import Theme from './contexts/ThemeContexts';
import ThemedView from './components/ThemedView';

const queryClient = new QueryClient();

StatusBar.setBarStyle('dark-content');
StatusBar.setTranslucent(false);
StatusBar.setBackgroundColor('#000000');

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme.ThemeProvider>
        <ThemedView style={styles.container}>
          <Stack >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ThemedView>
      </Theme.ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
