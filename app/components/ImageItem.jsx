import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import LinearGradient from 'expo-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const ImageItem = ({ item }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View style={styles.container}>
      <ShimmerPlaceHolder
        visible={!imageLoading}
        style={styles.shimmer}
        shimmerStyle={styles.shimmer}
      >
        <Image
          source={{ uri: item.path }}
          style={styles.image}
          onLoad={() => setImageLoading(false)}
          resizeMode="cover"
        />
      </ShimmerPlaceHolder>
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
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});

export default ImageItem;
