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
import Button from "./Button";

interface ImageGridProps {
  numColumns: number;
  ListHeaderComponent?: React.ReactElement;
}

const ImageGrid = ({ numColumns = 3, ListHeaderComponent }: ImageGridProps) => {
  const router = useRouter();

  const { filters, setFilter, resetFilters } = useFilters();
  const GET_IMAGES_QUERY_KEY = ["get-images"];

  const { clear } = useQueryCache(GET_IMAGES_QUERY_KEY);

  const fetchPage = async (page: number) => {
    try {
      const nonEmptyFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );

      const response = await api.get("/search", {
        params: {
          ...nonEmptyFilters,
          page,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch page:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
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
  }

  const renderEmpty = () => (
    <ThemedView style={styles.emptyContainer}>
      <ThemedText style={styles.noResultsText}>No results found</ThemedText>
      {filters.q && (
        <Button
          title="Clear Search"
          onPress={() => {
            resetFilters();
            setFilter('q', '');
          }}
          buttonStyle={styles.clearButton}
          textStyle={styles.clearButtonText}
        />
      )}
    </ThemedView>
  );

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
              style={[styles.item, numColumns > 1 && { borderRadius: 12 }]}
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
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 100, // Space for the floating tab bar
    flexGrow: 1, // Ensure ListEmptyComponent can center itself
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100, // Offset from top since header is present
  },
  clearButton: {
    backgroundColor: 'rgba(177, 162, 255, 0.15)',
    borderRadius: 100,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(177, 162, 255, 0.3)',
  },
  clearButtonText: {
    color: '#B1A2FF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  item: {
    flex: 1,
    margin: 4,
    aspectRatio: 1, // Make images square
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
    height: 80,
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
