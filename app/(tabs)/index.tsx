import React, { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import ImageItem from '../components/ImageItem';

const numColumns = 3;

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = () => {
    setLoading(true);
    fetch(`https://wallhaven.cc/api/v1/search?q=id&page=${page}`)
      .then(response => response.json())
      .then(json => {
        setData([...data, ...json.data]);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  // Function to format the data into rows of `numColumns`
  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);

    // Add empty elements to the end of the data array to fill the last row
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }

    return data;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={formatData(data, numColumns)}
        keyExtractor={item => item.id || item.key}
        renderItem={({ item }) => {
          if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
          }
          return (
            <View style={styles.item}>
              <Pressable onPress={() => router.push(`/${item.id}`)}>
                <ImageItem item={item} />
              </Pressable>
            </View>
          );
        }}
        numColumns={numColumns}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => loading && <ActivityIndicator size="large" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5, // Add some padding around the FlatList
  },
  item: {
    flex: 1,
    margin: 3,
    height: 120, // Adjust as needed
    borderRadius: 10,
    overflow: 'hidden', // Clip the image within the rounded border
    backgroundColor: '#eee', // Add a background color for a cleaner look
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
});

export default App;
