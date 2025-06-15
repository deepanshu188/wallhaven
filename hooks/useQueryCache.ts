import { useQueryClient } from "@tanstack/react-query";

export const useQueryCache = (KEY: string[]) => {
  const queryClient = useQueryClient();
  const clear = () => {
    queryClient.resetQueries({ queryKey: KEY, exact: true });
  };
  return { clear };
};
