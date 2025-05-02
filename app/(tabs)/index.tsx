import { StyleSheet } from 'react-native';
import ThemedView from '../components/ThemedView';
import ImageGrid from '../components/ImageGrid';
import SearchInput from '../components/SearchInput';

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      <SearchInput />
      <ImageGrid numColumns={3} />
    </ThemedView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 0
  }
});

export default Home;
