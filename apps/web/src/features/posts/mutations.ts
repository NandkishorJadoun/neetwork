import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/libs/query";
import { createComment, createPost, likePost, unlikePost } from "./api";
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

export const useCreatePost = () => {
  return useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: postsQueryOptions("all").queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: postsQueryOptions("following").queryKey,
        }),
      ]);
    },
  });
};

export const useCreateComment = (postId: string) => {
  return useMutation({
    mutationFn: ({ content }: { content: string }) =>
      createComment({ postId, content }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: postByIdQueryOptions(postId).queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: postsQueryOptions("all").queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: postsQueryOptions("following").queryKey,
        }),
      ]);
    },
  });
};
