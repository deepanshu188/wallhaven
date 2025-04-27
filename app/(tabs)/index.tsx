import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import ImageGrid from '../components/ImageGrid';

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <ImageGrid numColumns={3} queryObject={{ sorting: 'toplist' }} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
});

export default Home;
