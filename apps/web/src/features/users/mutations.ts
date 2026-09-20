import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/libs/query";
import { removeFollower, sendFollowRequest, unfollowUserById } from "./api";
import { followersByUserIdQueryOptions, followingsByUserIdQueryOptions, nonFollowingUsersQueryOptions } from "./queries";

export const useUnfollowUser = (listUserId: string, targetId: string) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: () => unfollowUserById(targetId),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: followingsByUserIdQueryOptions(listUserId).queryKey,
      });
    },
  });

  return { mutate, isPending, error };
};

export const useRemoveFollower = (listUserId: string, targetId: string) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: () => removeFollower(targetId),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: followersByUserIdQueryOptions(listUserId).queryKey,
      });
    },
  });

  return { mutate, isPending, error };
};

export const useSendFollowRequest = (userId: string) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: () => sendFollowRequest(userId),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: nonFollowingUsersQueryOptions().queryKey,
      });
    },
  });

  return { mutate, isPending, error };
};
