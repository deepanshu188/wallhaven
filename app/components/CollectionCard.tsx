import { StyleSheet, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";

interface CollectionCardProps {
  name: string;
  count: number;
}

const CollectionCard = ({ name, count }: CollectionCardProps) => {
  return (
    <ThemedView style={styles.card}>
      <View style={styles.colored}></View>
      <ThemedView style={styles.body}>
        <ThemedText>{name}</ThemedText>
        <View style={styles.count}>
          <AntDesign name="tago" size={16} color={"#ccc"} />
          <ThemedText>{count} items</ThemedText>
        </View>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    gap: 8,
    borderColor: "#414141",
    borderWidth: 1,
    elevation: 4,
    borderRadius: 10,
    height: 200,
    width: "100%",
  },
  colored: {
    backgroundColor: "#373a4d",
    width: "100%",
    flex: 1,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  body: {
    justifyContent: "space-between",
    padding: 8,
    borderRadius: 10,
  },
  count: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
});

export default CollectionCard;
