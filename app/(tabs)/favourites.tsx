import React, { useContext, } from 'react';
import { StyleSheet } from 'react-native';
import ThemedView from '../components/ThemedView';
import Theme from '../contexts/ThemeContexts';
import ThemedText from '../components/ThemedText';

const SearchScreen = () => {
  const { theme } = useContext(Theme.ThemeContext);

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={{ fontSize: 16, marginBottom: 10, marginTop: 5 }}>Coming soon ;)</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingTop: 0
  },
});

export default SearchScreen;
