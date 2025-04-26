import React, { useState } from 'react';
import { View, ActivityIndicator, Image } from 'react-native';

const ImageItem = ({ item }) => {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View>
      {imageLoading && (
        <ActivityIndicator
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          size="large"
          color="#fff"
        />
      )}
      <Image
        source={{ uri: item.path }}
        style={{ height: 200, width: '100%' }}
        onLoad={() => setImageLoading(false)}
      />
    </View>
  );
};

export default ImageItem;
