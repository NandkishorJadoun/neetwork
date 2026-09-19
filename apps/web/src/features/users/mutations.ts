import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/libs/query";
import { removeFollower, unfollowUserById } from "./api";
import { followersByUserIdQueryOptions, followingsByUserIdQueryOptions } from "./queries";

export const useUnfollowUser = (userId: string) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: () => unfollowUserById(userId),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: followingsByUserIdQueryOptions(userId).queryKey,
      });
    },
  });

  return { mutate, isPending, error };
};

export const useRemoveFollower = (userId: string) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: () => removeFollower(userId),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: followersByUserIdQueryOptions(userId).queryKey,
      });
    },
  });

  return { mutate, isPending, error };
};
