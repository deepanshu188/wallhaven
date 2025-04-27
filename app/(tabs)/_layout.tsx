import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContexts";

export default function TabLayout() {
  const { theme } = useContext(ThemeContext);
  const tabScreenOptions = (title: string, icon?: React.ComponentProps<typeof FontAwesome>['name']) => ({
    title: title,
    headerStyle: { backgroundColor: theme.background },
    headerTintColor: theme.text,
    tabBarIcon: ({ color }: { color: string }) => <FontAwesome name={icon} size={20} color={color} />,
  })
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.background,
        },
        tabBarInactiveTintColor: theme.tabIconInactive,
        tabBarActiveTintColor: theme.tabIconActive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={tabScreenOptions('Wallhaven', 'home')}
      />
      <Tabs.Screen
        name="search"
        options={tabScreenOptions('Search', 'search')}
      />
      <Tabs.Screen
        name="settings"
        options={tabScreenOptions('Settings', 'cog')}
      />
    </Tabs>
  );
}
