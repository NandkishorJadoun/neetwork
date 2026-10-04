import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/libs/query";
import { removeFollower, sendFollowRequest, unfollowUserById, updateProfile } from "./api";
import { followersByUserIdQueryOptions, followingsByUserIdQueryOptions, nonFollowingUsersQueryOptions, userByIdQueryOptions } from "./queries";

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

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
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

export type ProfileFollowAction = "follow" | "unfollow";

export const useProfileFollowAction = (profileUserId: string) => {
  const mutation = useMutation({
    mutationFn: (action: ProfileFollowAction) => {
      return action === "follow" ? sendFollowRequest(profileUserId) : unfollowUserById(profileUserId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: userByIdQueryOptions(profileUserId).queryKey,
      });
    },
  });

  const handleAction = (action: ProfileFollowAction) => {
    mutation.mutate(action);
  };

  return {
    handleAction,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
