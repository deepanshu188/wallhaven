import { useContext, useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import ThemedView from "../components/ThemedView";
import Theme from '../contexts/ThemeContexts';
import ThemedText from "../components/ThemedText";
import * as SecureStore from 'expo-secure-store';
import RadioGroup from "../components/RadioGroup";
import Button from "../components/Button";

const SettingsScreen = () => {
  const context = useContext(Theme.ThemeContext);
  const isDarkMode = context.isDarkMode;

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isKeySaved, setIsKeySaved] = useState(false);

  const handleThemeChange = (value: 'system' | 'light' | 'dark') => {
    context.setColorScheme(value);
  };

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        let key = await SecureStore.getItemAsync("apiKey");
        setApiKey(key);
        setIsKeySaved(key !== null);
      } catch (error) {
        console.log("Error loading API key from AsyncStorage:", error);
      }
    };

    loadApiKey();
  }, []);

  const saveApiKey = async () => {
    try {
      if (!apiKey) return;
      await SecureStore.setItemAsync("apiKey", apiKey);
      setApiKey(apiKey);
      setIsKeySaved(true);
    } catch (error) {
      console.log("Error saving API key to AsyncStorage:", error);
    }
  };

  const clearApiKey = async () => {
    try {
      await SecureStore.deleteItemAsync("apiKey")
      setApiKey(null);
      setIsKeySaved(false);
    } catch (error) {
      console.log("Error clearing API key from AsyncStorage:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText>Appearance</ThemedText>
      <RadioGroup options={[
        { label: 'System', value: 'system' },
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' },
      ]}
        callBack={(value: string) => handleThemeChange(value as 'system' | 'light' | 'dark')}
        selectedOption={context.colorScheme}
      />
      <ThemedText style={styles.label}>Account</ThemedText>
      {isKeySaved ? (
        <ThemedText style={styles.asterisk}>********************</ThemedText>
      ) : (
        <>
          <TextInput
            style={[styles.input, { backgroundColor: isDarkMode ? "#3e3e3e" : "#f4f3f4", color: isDarkMode ? "#fff" : "#000" }]}
            placeholder="Enter your API key"
            placeholderTextColor={isDarkMode ? "#fff" : "#000"}
            value={apiKey || ""}
            onChangeText={(text) => setApiKey(text)}
            onKeyPress={(e) => {
              if (e.nativeEvent.key === "Enter") {
                saveApiKey();
              }
            }}
          />
          <Button onPress={saveApiKey} title="Save Api Key" buttonStyle={{ backgroundColor: '#6200ee' }} disabled={!apiKey} />
        </>
      )}
      {isKeySaved && (
        <Button onPress={clearApiKey} title="Remove API Key " buttonStyle={{ backgroundColor: '#ff0000' }} />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    marginBottom: 5,
  },
  input: {
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    color: "black",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  asterisk: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default SettingsScreen;
