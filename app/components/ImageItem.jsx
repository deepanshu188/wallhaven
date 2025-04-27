import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ThemedView } from './ThemedView';

const ImageItem = ({ item }) => {
  return (
    <ThemedView style={styles.container}>
      <Image
        source={{ uri: item.path }}
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
    flex: 1,
    width: '100%',
    backgroundColor: '#0553',
  },

});

export default ImageItem;
