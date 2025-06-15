import { api } from "@/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import Theme from "@/app/contexts/ThemeContexts";
import CollectionsList from "@/app/components/CollectionsList";
import { storage } from "@/utils/mmkv";

const MyCollections = () => {
  const username = storage.getString("username");
  const { theme } = useContext(Theme.ThemeContext);
  const navigation = useNavigation();
  const MY_COLLECTIONS_KEY = ["my-collections"];

  const fetchMyCollections = async () => {
    const response = await api.get(`/collections`);
    return response.data;
  };

  const { data: userCollections, isLoading } = useQuery({
    queryKey: MY_COLLECTIONS_KEY,
    queryFn: fetchMyCollections,
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
      data={userCollections?.data}
      self_username={username}
    />
  );
};

export default MyCollections;
