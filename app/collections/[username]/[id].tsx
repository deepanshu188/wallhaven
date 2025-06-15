import { api } from "@/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import ThemedView from "@/app/components/ThemedView";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import Theme from "@/app/contexts/ThemeContexts";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import ImageItem from "@/app/components/ImageItem";
import { StyleSheet, TouchableOpacity } from "react-native";
import Loader from "@/app/components/Loader";
import ThemedText from "@/app/components/ThemedText";

const numColumns = 3;

const UserCollections = () => {
  const { theme } = useContext(Theme.ThemeContext);
  const navigation = useNavigation();
  const router = useRouter();
  const { id, username, label } = useLocalSearchParams();
  const USER_COLLECTION_KEY = ["collection", id];

  const fetchUserCollection = async () => {
    const response = await api.get(`/collections/${username}/${id}`);
    return response.data;
  };

  const { data: collection, isLoading } = useQuery({
    queryKey: USER_COLLECTION_KEY,
    queryFn: fetchUserCollection,
  });

  useEffect(() => {
    navigation.setOptions({
      title: label,
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
    });
  }, [id]);

  if (isLoading) {
    return (
      <ThemedView style={[styles.center, { flex: 1 }]}>
        <Loader />
      </ThemedView>
    );
  } else if (!collection?.data || collection?.data?.length === 0) {
    return (
      <ThemedView style={[styles.center, { flex: 1 }]}>
        <ThemedText style={styles.noResultsText}>
          Collection is empty
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, padding: 5 }}>
      <LegendList
        data={collection?.data ?? []}
        keyExtractor={(item) => item.id.toString()}
        recycleItems={true}
        renderItem={({
          item,
        }: LegendListRenderItemProps<Record<string, any>>) => {
          if (!item)
            return <ThemedView style={[styles.item, styles.itemInvisible]} />;
          return (
            <ThemedView
              style={[styles.item, numColumns > 1 && { borderRadius: 10 }]}
            >
              <TouchableOpacity onPress={() => router.push(`/${item.id}`)}>
                <ImageItem item={item} />
              </TouchableOpacity>
            </ThemedView>
          );
        }}
        numColumns={numColumns}
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
  item: {
    flex: 1,
    margin: 3,
    overflow: "hidden",
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
});

export default UserCollections;
