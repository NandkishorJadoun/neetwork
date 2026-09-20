import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { fetchFeedPosts, fetchLikesByPostId, fetchPostById } from "./api";

export type ActiveTab = "all" | "following";

export const postsQueryOptions = (activeTab: ActiveTab) =>
  infiniteQueryOptions({
    queryKey: ["feed-posts", { activeTab }],
    queryFn: ({ pageParam: nextCursor, signal }) => fetchFeedPosts({ activeTab, nextCursor, signal }),
    initialPageParam: "",
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });

export const postByIdQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["post", { postId }],
    queryFn: ({ signal }) => fetchPostById({ postId, signal }),
  });

export const likesByPostIdQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["post-likes", { postId }],
    queryFn: ({ signal }) => fetchLikesByPostId({ postId, signal }),
  });
