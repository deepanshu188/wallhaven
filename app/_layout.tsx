import { Stack } from "expo-router/stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Theme from "./contexts/ThemeContexts";
import ThemedView from "./components/ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const queryClient = new QueryClient();

function AppLayout() {
  const insets = useSafeAreaInsets(); 

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemedView>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Theme.ThemeProvider>
        <AppLayout />
      </Theme.ThemeProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
