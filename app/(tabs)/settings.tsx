import { useContext } from 'react';
import { StyleSheet, Switch } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import { ThemeContext } from '../contexts/ThemeContexts';
import { ThemedText } from '../components/ThemedText';

const SettingsScreen = () => {
  const context = useContext(ThemeContext)
  const isDarkMode = context.isDarkMode;
  const toggleSwitch = () => {
    context.toggleTheme();
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Dark Mode</ThemedText>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isDarkMode}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;
