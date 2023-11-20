import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

const updateUser = (newUser: any) => {
  queryClient.setQueryData(["user"], newUser);
};

const clearUser = () => {
  queryClient.setQueryData(["user"], null);
};
