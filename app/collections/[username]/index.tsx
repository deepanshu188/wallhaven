import { api } from "@/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import Theme from "@/app/contexts/ThemeContexts";
import CollectionsList from "@/app/components/CollectionsList";

const UserCollections = () => {
  const { theme } = useContext(Theme.ThemeContext);
  const navigation = useNavigation();
  const { username } = useLocalSearchParams();
  const USER_COLLECTIONS_KEY = ["collections", username];

  const fetchUserCollections = async () => {
    const response = await api.get(`/collections/${username}`);
    return response.data;
  };

  const { data: userCollections, isLoading } = useQuery({
    queryKey: USER_COLLECTIONS_KEY,
    queryFn: fetchUserCollections,
  });

  useEffect(() => {
    navigation.setOptions({
      title: `${username}'s Collections`,
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
    });
  }, [username]);

  return <CollectionsList isLoading={isLoading} data={userCollections?.data} />;
};

export default UserCollections;
