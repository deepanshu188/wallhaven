import { Link, useLocalSearchParams } from "expo-router";
import ThemedText from "@/app/components/ThemedText";
import ThemedView from "@/app/components/ThemedView";
import { StyleSheet } from "react-native";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import Loader from "@/app/components/Loader";
import CollectionCard from "./CollectionCard";

interface Collection {
  id: number;
  label: string;
  views: number;
  public: number;
  count: number;
}

interface CollectionsListProps {
  isLoading: boolean;
  data: Collection[];
  self_username?: string;
}

const CollectionsList = ({
  isLoading,
  data,
  self_username,
}: CollectionsListProps) => {
  const { username } = useLocalSearchParams();

  if (isLoading) {
    return (
      <ThemedView style={[styles.center, { flex: 1 }]}>
        <Loader />
      </ThemedView>
    );
  } else if (!data || data?.length === 0) {
    return (
      <ThemedView style={[styles.center, { flex: 1 }]}>
        <ThemedText style={styles.noResultsText}>No results found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, padding: 18 }}>
      <LegendList
        data={data ?? []}
        keyExtractor={(item) => item.id.toString()}
        recycleItems={true}
        numColumns={2}
        renderItem={({ item }: LegendListRenderItemProps<Collection>) => {
          return (
            <>
              <Link
                style={{ margin: 5 }}
                href={`/collections/${self_username || username}/${item.id}?label=${item.label}`}
              >
                <CollectionCard name={item.label} count={item.count} />
              </Link>
            </>
          );
        }}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "500",
  },
});

export default CollectionsList;
