import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import ThemedText from "../components/ThemedText";
import Theme from "../contexts/ThemeContexts";
import { useThemeColor } from "@/hooks/useThemeColor";
import { apiKeyStorage, storage } from "@/utils/mmkv";

import appConfig from "../../app.json";

import { useAuth } from "@/store/auth";

const { width } = Dimensions.get("window");
const APP_VERSION = appConfig.expo.version;

const SettingsScreen = () => {
  const { setHasApiKey } = useAuth();
  const context = useContext(Theme.ThemeContext);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const primaryPurple = "#B1A2FF";
  const darkBg = "#000000";
  const cardBg = "#111113";
  const textSecondary = "#8E8E93";

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [highQualityEnabled, setHighQualityEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [tempApiKey, setTempApiKey] = useState("");

  useEffect(() => {
    try {
      const key = apiKeyStorage.getString("apiKey");
      const name = storage.getString("username");
      if (key) {
        setApiKey(key);
        setIsKeySaved(true);
      }
      if (name) {
        setUsername(name);
      }
    } catch (error) {
      console.log("Error loading settings:", error);
    }
  }, []);

  const handleThemeChange = (value: "system" | "light" | "dark") => {
    context.setColorScheme(value);
  };

  const openModal = () => {
    setTempUsername(username);
    setTempApiKey(apiKey || "");
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSave = () => {
    if (!tempUsername || !tempApiKey) {
      Alert.alert("Error", "Please enter both username and API key.");
      return;
    }
    try {
      apiKeyStorage.set("apiKey", tempApiKey);
      storage.set("username", tempUsername);
      setApiKey(tempApiKey);
      setUsername(tempUsername);
      setIsKeySaved(true);
      setHasApiKey(true);
      closeModal();
    } catch (error) {
      console.log("Error saving API key:", error);
      Alert.alert("Error", "Failed to save API key.");
    }
  };

  const clearApiKey = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          try {
            apiKeyStorage.delete("apiKey");
            storage.delete("username");
            setApiKey(null);
            setUsername("");
            setIsKeySaved(false);
            setHasApiKey(false);
          } catch (error) {
            console.log("Error clearing API key:", error);
          }
        },
      },
    ]);
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <ThemedText style={styles.sectionHeader}>{title}</ThemedText>
  );

  const SettingRow = ({
    icon,
    label,
    value,
    onPress,
    rightElement,
    showChevron = true,
  }: any) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconContainer}>{icon}</View>
        <View>
          <ThemedText style={styles.rowLabel}>{label}</ThemedText>
          {value && (
            <ThemedText style={styles.rowValue} numberOfLines={1}>
              {value}
            </ThemedText>
          )}
        </View>
      </View>
      <View style={styles.rowRight}>
        {rightElement}
        {showChevron && !rightElement && (
          <Ionicons name="chevron-forward" size={20} color={textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <ThemedText style={styles.profileTitle}>Settings</ThemedText>
        </View>

        {/* ACCOUNT Section */}
        <SectionHeader title="ACCOUNT" />
        <View style={styles.card}>
          <SettingRow
            icon={
              <MaterialCommunityIcons
                name="key-variant"
                size={22}
                color={primaryPurple}
              />
            }
            label={apiKey ? "Manage API Key" : "Setup API Key"}
            value={apiKey ? `•••• •••• •••• ${apiKey.slice(-4)}` : "Tap to enter your API key"}
            showChevron={true}
            onPress={openModal}
          />
        </View>

        {/* APPEARANCE Section */}
        <SectionHeader title="APPEARANCE" />
        <View style={styles.segmentedControl}>
          {["system", "dark", "light"].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.segmentButton,
                context.colorScheme === mode && styles.segmentButtonActive,
              ]}
              onPress={() => handleThemeChange(mode as any)}
            >
              <ThemedText
                style={[
                  styles.segmentText,
                  context.colorScheme === mode && styles.segmentTextActive,
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* PREFERENCES Section */}
        <SectionHeader title="PREFERENCES" />
        <View style={styles.card}>
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <ThemedText style={styles.preferenceLabel}>High-Quality Previews</ThemedText>
              <ThemedText style={styles.preferenceSubLabel}>
                Load high-res assets in browse mode
              </ThemedText>
            </View>
            <Switch
              value={highQualityEnabled}
              onValueChange={setHighQualityEnabled}
              trackColor={{ false: "#333", true: primaryPurple }}
              thumbColor={"#fff"}
            />
          </View>
        </View>

        {/* SUPPORT Section */}
        <SectionHeader title="SUPPORT" />
        <View style={styles.card}>
          <SettingRow
            icon={<Ionicons name="logo-github" size={22} color="#fff" />}
            label="GitHub"
            rightElement={
              <Ionicons name="open-outline" size={20} color={textSecondary} />
            }
            onPress={() => Linking.openURL("https://github.com/deepanshu188/wallhaven")}
          />
          <View style={{ height: 1, backgroundColor: "#222", marginHorizontal: 16 }} />
          <SettingRow
            icon={<Ionicons name="information-circle-outline" size={22} color="#fff" />}
            label="About"
            rightElement={
              <ThemedText style={styles.versionText}>v{APP_VERSION}</ThemedText>
            }
          />
        </View>

        {isKeySaved && (
          <TouchableOpacity style={styles.signOutButton} onPress={clearApiKey}>
            <MaterialCommunityIcons name="logout" size={22} color="#FF4D4D" />
            <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
          </TouchableOpacity>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* API Key Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Manage API Key</ThemedText>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color={textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Username</ThemedText>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter username"
                  placeholderTextColor="#666"
                  value={tempUsername}
                  onChangeText={setTempUsername}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>API Key</ThemedText>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your wallhaven API key"
                  placeholderTextColor="#666"
                  value={tempApiKey}
                  onChangeText={setTempApiKey}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
              </TouchableOpacity>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  profileHeader: {
    marginBottom: 24,
    marginTop: 12,
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  versionText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8E8E93",
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#111113",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },


  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },
  rowValue: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#111113",
    borderRadius: 100,
    padding: 4,
    height: 48,
  },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  segmentButtonActive: {
    backgroundColor: "rgba(177, 162, 255, 0.2)",
  },
  segmentText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  segmentTextActive: {
    color: "#B1A2FF",
    fontWeight: "600",
  },
  cacheContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  cacheLabel: {
    fontSize: 13,
    color: "#8E8E93",
  },
  cacheValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 2,
  },
  clearButton: {
    backgroundColor: "#222",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#222",
    marginHorizontal: 16,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#B1A2FF",
    borderRadius: 3,
  },
  cacheFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 8,
  },
  cacheFooterText: {
    fontSize: 11,
    color: "#8E8E93",
    flex: 1,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  preferenceLeft: {
    flex: 1,
    marginRight: 16,
  },
  preferenceLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  preferenceSubLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },

  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF4D4D",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: "#000000",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#262626",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  saveButton: {
    backgroundColor: "rgba(177, 162, 255, 0.15)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(177, 162, 255, 0.3)",
  },
  saveButtonText: {
    color: "#B1A2FF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default SettingsScreen;

