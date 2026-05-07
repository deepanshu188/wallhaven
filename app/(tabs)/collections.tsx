import { api } from "@/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import Theme from "@/app/contexts/ThemeContexts";
import CollectionsList from "@/app/components/CollectionsList";
import { storage, apiKeyStorage } from "@/utils/mmkv";
import { useAuth } from "@/store/auth";

const MyCollections = () => {
  const username = storage.getString("username");
  const { hasApiKey } = useAuth();
  const { theme } = useContext(Theme.ThemeContext);
  const navigation = useNavigation();

  const fetchMyCollections = async () => {
    const key = apiKeyStorage.getString("apiKey");
    const response = await api.get(`/collections`, {
      params: { apikey: key },
    });
    return response.data?.data ?? [];
  };

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["my-collections", hasApiKey],
    queryFn: fetchMyCollections,
    enabled: hasApiKey,
  });

  useEffect(() => {
    navigation.setOptions({
      title: "My Collections",
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
    });
  }, []);

  return (
    <CollectionsList
      isLoading={isLoading}
      data={collections}
      self_username={username}
    />
  );
};

export default MyCollections;
