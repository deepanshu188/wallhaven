import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "./ThemedText";
import { LinearGradient } from "expo-linear-gradient";

interface CollectionCardProps {
  name: string;
  count: number;
}

// Curated palette of gradient pairs for visual variety
const GRADIENT_PALETTES = [
  ["#4A3AFF", "#7B68EE"],
  ["#FF6B6B", "#EE5A70"],
  ["#00C9A7", "#00B09B"],
  ["#FF9A56", "#FF6348"],
  ["#A855F7", "#7C3AED"],
  ["#F472B6", "#DB2777"],
  ["#38BDF8", "#0EA5E9"],
  ["#34D399", "#059669"],
];

const getGradient = (name: string): [string, string] => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[index] as [string, string];
};

const CollectionCard = ({ name, count }: CollectionCardProps) => {
  const [colorA, colorB] = getGradient(name);

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[colorA, colorB]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Decorative pattern circles */}
        <View style={styles.patternContainer}>
          <View style={[styles.circle, styles.circleTopRight]} />
          <View style={[styles.circle, styles.circleBottomLeft]} />
        </View>

        {/* Folder icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="folder-open" size={32} color="rgba(255,255,255,0.9)" />
        </View>
      </LinearGradient>

      {/* Card Body */}
      <View style={styles.body}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {name}
        </ThemedText>
        <View style={styles.countRow}>
          <Ionicons name="images-outline" size={13} color="#8E8E93" />
          <ThemedText style={styles.countText}>
            {count} {count === 1 ? "item" : "items"}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#111113",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    width: "100%",
    height: 190,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  circleTopRight: {
    width: 90,
    height: 90,
    top: -30,
    right: -25,
  },
  circleBottomLeft: {
    width: 60,
    height: 60,
    bottom: -15,
    left: -15,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  countText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
});

export default CollectionCard;
