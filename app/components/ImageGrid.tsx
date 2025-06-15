import { StyleSheet, Pressable, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import ImageItem from "./ImageItem";
import { api } from "@/axiosConfig";
import ThemedView from "../components/ThemedView";
import { LegendList } from "@legendapp/list";
import { useFilters } from "@/store/filters";
import FiltersModal from "./FiltersModal";
import Loader from "./Loader";
import ThemedText from "./ThemedText";
import { useEffect } from "react";
import { useQueryCache } from "@/hooks/useQueryCache";

interface ImageGridProps {
  numColumns: number;
}

const ImageGrid = ({ numColumns = 3 }: ImageGridProps) => {
  const router = useRouter();

  const { filters } = useFilters();
  const GET_IMAGES_QUERY_KEY = ["get-images"];

  const { clear } = useQueryCache(GET_IMAGES_QUERY_KEY);

  const fetchPage = async (page: number) => {
    try {
      const nonEmptyFilters = Object.fromEntries(
        Object.entries(filters)
          .map(([key, value]) => [key, value])
          .filter(([_, value]) => value !== ""),
      );
      const query = { ...nonEmptyFilters, page };
      const queryString = new URLSearchParams(query).toString();
      const url = "/search" + `?${queryString}`;
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
    refetch,
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
    clear();
    refetch();
  };

  useEffect(() => {
    clearAndRefetch();
  }, [filters.q]);

  if (isLoading) {
    return (
      <ThemedView style={[styles.center, { flex: 1 }]}>
        <Loader />
      </ThemedView>
    );
  } else if (!data || data.length === 0) {
    return (
      <ThemedView style={[styles.center, { flex: 1 }]}>
        <ThemedText style={styles.noResultsText}>No results found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <LegendList
        data={data ?? []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          if (!item)
            return <ThemedView style={[styles.item, styles.itemInvisible]} />;
          return (
            <ThemedView
              style={[styles.item, numColumns > 1 && { borderRadius: 10 }]}
            >
              <Pressable onPress={() => router.push(`/${item.id}`)}>
                <ImageItem item={item} />
              </Pressable>
            </ThemedView>
          );
        }}
        recycleItems
        numColumns={numColumns}
        onEndReached={handleLoadMore}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={clearAndRefetch} />
        }
        ListFooterComponent={
          hasNextPage ? (
            <ThemedView style={styles.footerContainer}>
              {isFetchingNextPage && <Loader />}
            </ThemedView>
          ) : null
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
    overflow: "hidden",
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  footerContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "500",
  },
});

export default ImageGrid;
