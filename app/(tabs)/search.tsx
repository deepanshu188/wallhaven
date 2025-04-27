import React from 'react';
import { View, StyleSheet } from 'react-native';
import ImageGrid from '../components/ImageGrid';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <ImageGrid numColumns={3} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
  },
});

export default SearchScreen;
