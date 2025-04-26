import {
  FlatList,
  StyleSheet,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import ImageItem from '../components/ImageItem';
import { useInfiniteQuery } from '@tanstack/react-query';

const numColumns = 3;

const App = () => {
  const router = useRouter();

  const fetchPage = async (pageParam: number) => {
    const response = await fetch(`https://wallhaven.cc/api/v1/search?q=id&page=${pageParam}`);
    return await response.json();
  };

  const { fetchNextPage, data: images, isLoading: loading } = useInfiniteQuery({
    queryKey: ['images'],
    queryFn: ({ pageParam }: { pageParam: number }) => fetchPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page < lastPage.meta.last_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
  })

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const data = images?.pages?.flatMap((item) => item.data)

  console.log(images?.pages?.flatMap((item) => item.data), 'images');
  console.log(data, 'data')

  // Function to format the data into rows of `numColumns`
  const formatData = (data: any[] | undefined, numColumns: number) => {
    if (!data) return [];
    const numberOfFullRows = Math.floor(data?.length / numColumns);
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
    padding: 5,
  },
  item: {
    flex: 1,
    margin: 3,
    height: 120,
    borderRadius: 10,
    overflow: 'hidden', // Clip the image within the rounded border
    backgroundColor: '#eee', // Add a background color for a cleaner look
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
});

export default App;
