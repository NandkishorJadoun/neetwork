import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/libs/query";
import { likePost, unlikePost } from "./api";
import { postByIdQueryOptions, postsQueryOptions } from "./queries";

type UseLikePostArgs = {
  postId: string;
  isLiked: boolean;
};

type LikeMutationVariables = {
  postId: string;
  isLiked: boolean;
};

export const useLikePost = ({ postId, isLiked }: UseLikePostArgs) => {
  const mutation = useMutation({
    mutationFn: ({ postId, isLiked }: LikeMutationVariables) => {
      return isLiked ? unlikePost({ postId }) : likePost({ postId });
    },
    onSuccess: async (_data, { postId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: postsQueryOptions("all").queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: postsQueryOptions("following").queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: postByIdQueryOptions(postId).queryKey,
        }),
      ]);
    },
  });

  const mutate = () => {
    mutation.mutate({ postId, isLiked });
  };

  return {
    mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
