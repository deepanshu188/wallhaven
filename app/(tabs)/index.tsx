import React from "react";
import { StyleSheet, View } from "react-native";
import ThemedView from "../components/ThemedView";
import ImageGrid from "../components/ImageGrid";
import SearchInput from "../components/SearchInput";

const Home = () => {
  const HeaderComponent = (
    <View style={styles.headerContent}>
      <View style={styles.paddedContent}>
        <SearchInput />
        <View style={styles.sectionHeader}>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ImageGrid numColumns={3} ListHeaderComponent={HeaderComponent} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    backgroundColor: 'transparent',
  },
  paddedContent: {
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: 'bold',
    marginTop: 4,
  },
  viewAll: {
    color: '#B1A2FF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Home;
