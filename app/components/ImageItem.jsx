import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import ThemedView from './ThemedView';

const ImageItem = ({ item }) => {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={item.thumbs.large}
        style={styles.image}
        transition={1000}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageItem;
