import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/libs/query";
import { acceptFollowRequest, rejectFollowRequest } from "./api";
import { followRequestsQueryOptions } from "./queries";

export type FollowRequestAction = "confirm" | "delete";

export const useFollowRequestAction = (senderId: string) => {
  const mutation = useMutation({
    mutationFn: (action: FollowRequestAction) => {
      return action === "confirm" ? acceptFollowRequest(senderId) : rejectFollowRequest(senderId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: followRequestsQueryOptions().queryKey,
      });
    },
  });

  const handleAction = (action: FollowRequestAction) => {
    mutation.mutate(action);
  };

  return {
    handleAction,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
