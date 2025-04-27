import React from 'react';
import { FlatList, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import ImageItem from './ImageItem';
import { api } from '@/axiosConfig';
import { ThemedView } from '../components/ThemedView';

interface ImageGridProps {
  numColumns: number;
  queryObject?: any;
}

const ImageGrid = ({ numColumns = 3, queryObject = {} }: ImageGridProps) => {
  const router = useRouter();

  const fetchPage = async (page: number) => {
    try {
      const query = { ...queryObject, page };
      const queryString = new URLSearchParams(query).toString();
      const url = '/search' + `?${queryString}`;
      console.log(url);

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch page", error);
      throw error;
    }
  };

  const {
    data: images,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['images', queryObject],
    queryFn: ({ pageParam = 1 }) => fetchPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page < lastPage.meta.last_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
  });

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const data = images?.pages?.flatMap((item) => item.data);

  const formatData = (data) => {
    if (!data) return [];
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;

    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.center, { flex: 1 }]}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={formatData(data)}
        keyExtractor={(item) => item.id || item.key}
        renderItem={({ item }) => {
          if (item.empty === true) {
            return <ThemedView style={[styles.item, styles.itemInvisible]} />;
          }
          return (
            <ThemedView style={styles.item}>
              <Pressable onPress={() => router.push(`/${item.id}`)}>
                <ImageItem item={item} />
              </Pressable>
            </ThemedView>
          );
        }}
        numColumns={numColumns}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() =>
          isFetchingNextPage ? (
            <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
          ) : null
        }
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 3,
    height: 120,
    borderRadius: 10,
    overflow: 'hidden',
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageGrid;
