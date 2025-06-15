import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import ThemedView from "./ThemedView";

const ImageItem = ({ item }) => {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={item.thumbs.large}
        style={styles.image}
        contentFit="cover"
        transition={300}
        cachePolicy="memory"
        recyclingKey={item.id}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImageItem;
