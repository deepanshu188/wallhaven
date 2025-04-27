import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const ImageItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.path }}
        style={styles.image}
        transition={1000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
  },
  shimmer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0553',
  },

});

export default ImageItem;
