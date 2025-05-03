import { StyleSheet, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import ImageItem from './ImageItem';
import { api } from '@/axiosConfig';
import ThemedView from '../components/ThemedView';
import { LegendList } from '@legendapp/list';
import { useFilters } from '@/store/filters';
import FiltersModal from './FiltersModal';
import Loader from './Loader';

interface ImageGridProps {
  numColumns: number;
}

const ImageGrid = ({ numColumns = 3 }: ImageGridProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { filters } = useFilters();
  const GET_IMAGES_QUERY_KEY = ['images', filters.q];

  const fetchPage = async (page: number) => {
    try {
      const nonEmptyFilters = Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, value]).filter(([_, value]) => value !== '')
      );
      const query = { ...nonEmptyFilters, page };
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
    isLoading,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: GET_IMAGES_QUERY_KEY,
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
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const data = images?.pages?.flatMap((item) => item.data);

  const clearAndRefetch = () => {
    queryClient.resetQueries({ queryKey: GET_IMAGES_QUERY_KEY, exact: true })
    refetch();
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.center, { flex: 1 }]}>
        <Loader />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <LegendList
        data={data ?? []}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => {
          if (!item) return <ThemedView style={[styles.item, styles.itemInvisible]} />
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
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={clearAndRefetch} />
        }
        ListFooterComponent={
          <ThemedView>
            <Loader />
          </ThemedView>
        }
      />
      <FiltersModal clearAndRefetch={clearAndRefetch} />
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
