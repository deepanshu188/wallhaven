import { FontAwesome, AntDesign, Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useContext } from "react";
import Theme from "../contexts/ThemeContexts";

interface TabScreenOptionsProps {
  title: string;
  opts?: any;
}

export default function TabLayout() {
  const { theme } = useContext(Theme.ThemeContext);
  const tabScreenOptions = ({ title, opts }: TabScreenOptionsProps) => ({
    title,
    headerStyle: {
      backgroundColor: theme.background,
      height: 55,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: '600',
      letterSpacing: 0.5,
      paddingBottom: 2,
    },
    headerTitleAlign: 'center',
    headerTintColor: theme.text,
    ...opts,
  })

  const homeScreenOptions = {
    ...tabScreenOptions({
      title: 'Home', opts: {
        tabBarIcon: ({ color }: { color: string }) => <AntDesign name="home" size={20} color={color} />,
        headerStyle: { backgroundColor: theme.background },
        headerShown: false
      }
    }),
  }
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarInactiveTintColor: theme.tabIconInactive,
        tabBarActiveTintColor: theme.tabIconActive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={homeScreenOptions}
      />
      <Tabs.Screen
        name="downloads"
        options={tabScreenOptions({
          title: 'Downloads', opts: {
            tabBarIcon: ({ color }: { color: string }) => <Feather name="download" size={20} color={color} />
          }
        })}
      />
      <Tabs.Screen
        name="settings"
        options={tabScreenOptions({
          title: 'Settings', opts:
          {
            tabBarIcon: ({ color }: { color: string }) => <FontAwesome name="cog" size={20} color={color} />
          }
        })}
      />
    </Tabs>
  );
}
