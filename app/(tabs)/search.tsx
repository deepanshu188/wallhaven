import React from 'react';
import { StyleSheet } from 'react-native';
import ImageGrid from '../components/ImageGrid';
import { ThemedView } from '../components/ThemedView';

const SearchScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <ImageGrid numColumns={3} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
});

export default SearchScreen;
