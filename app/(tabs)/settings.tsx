import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ThemedView from "../components/ThemedView";
import Theme from "../contexts/ThemeContexts";
import ThemedText from "../components/ThemedText";
import RadioGroup from "../components/RadioGroup";
import Button from "../components/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { apiKeyStorage, storage } from "@/utils/mmkv";
import { Image } from "expo-image";
import Input from "@/app/components/Input";

const SettingsScreen = () => {
  const context = useContext(Theme.ThemeContext);

  const primaryColor = useThemeColor({}, "primaryColor");

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [isKeySaved, setIsKeySaved] = useState(false);

  const handleThemeChange = (value: "system" | "light" | "dark") => {
    context.setColorScheme(value);
  };

  useEffect(() => {
    try {
      const key = apiKeyStorage.getString("apiKey");
      const username = storage.getString("username");
      if (!key || !username) return;
      setApiKey(key);
      setUsername(username);
      setIsKeySaved(key !== null);
    } catch (error) {
      console.log("Error loading API key from AsyncStorage:", error);
    }
  }, []);

  const saveApiKey = () => {
    try {
      if (!apiKey) return;
      apiKeyStorage.set("apiKey", apiKey);
      storage.set("username", username);
      setIsKeySaved(true);
    } catch (error) {
      console.log("Error saving API key to AsyncStorage:", error);
    }
  };

  const clearApiKey = () => {
    try {
      apiKeyStorage.delete("apiKey");
      storage.delete("username");
      setApiKey(null);
      setIsKeySaved(false);
    } catch (error) {
      console.log("Error clearing API key from AsyncStorage:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerSection}>
        <Image
          source={require("../../assets/images/splash-icon.png")}
          style={styles.appIcon}
        />
        <ThemedText style={styles.appTitle}>Wallhaven</ThemedText>
        <ThemedText style={styles.appVersion}>Version 1.1.0</ThemedText>
      </View>
      <ThemedText style={styles.label}>Appearance</ThemedText>
      <RadioGroup
        options={[
          { label: "System", value: "system" },
          { label: "Dark", value: "dark" },
          { label: "Light", value: "light" },
        ]}
        callBack={(value: string) =>
          handleThemeChange(value as "system" | "light" | "dark")
        }
        selectedOption={context.colorScheme}
        variant="outlined"
      />
      <ThemedText style={styles.label}>Account</ThemedText>
      {isKeySaved ? (
        <ThemedText style={styles.asterisk}>********************</ThemedText>
      ) : (
        <>
          <Input
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <Input
            value={apiKey || ""}
            placeholder="Enter your API key"
            onChangeText={(text) => setApiKey(text)}
          />
          <Button
            onPress={saveApiKey}
            title="Save User"
            buttonStyle={{ backgroundColor: primaryColor }}
            disabled={!apiKey || !username}
          />
        </>
      )}
      {isKeySaved && (
        <Button
          onPress={clearApiKey}
          title="Remove API Key "
          buttonStyle={{ backgroundColor: "#ff0000" }}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  appIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
    borderRadius: 24,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  appVersion: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  label: {
    marginBottom: 5,
    marginTop: 4,
  },
  asterisk: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default SettingsScreen;
