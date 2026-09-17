import { infiniteQueryOptions } from "@tanstack/react-query";
import { fetchFeedPosts } from "./api";

export type ActiveTab = "all" | "following";

export const postsQueryOptions = (activeTab: ActiveTab) =>
  infiniteQueryOptions({
    queryKey: ["feed-posts", { activeTab }],
    queryFn: ({ pageParam: nextCursor, signal }) => fetchFeedPosts({ activeTab, nextCursor, signal }),
    initialPageParam: "",
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });
