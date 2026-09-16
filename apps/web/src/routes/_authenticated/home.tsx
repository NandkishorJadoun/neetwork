import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { HomePageHeader } from "../../components/home-page-header";
import { PostCard } from "../../components/post-card";
import { PostCardSkeleton } from "../../components/post-skeleton";
import { fetchFeedPosts } from "../../services/posts";

export type ActiveTab = "all" | "following";

const postsQueryOptions = (token: string, activeTab: ActiveTab) =>
  infiniteQueryOptions({
    queryKey: ["feed-posts", { token, activeTab }],
    queryFn: ({ pageParam: nextCursor }) => fetchFeedPosts({ token, activeTab, nextCursor }),
    initialPageParam: "",
    getNextPageParam: ({ nextCursor }) => nextCursor,
  });

export const Route = createFileRoute("/_authenticated/home")({
  validateSearch: (search: Record<string, unknown>): { users: ActiveTab } => {
    return {
      users: search.users === "following" ? "following" : "all",
    };
  },
  loaderDeps: ({ search }) => ({ users: search.users }),
  loader: async ({ context, deps }) => {
    const activeTab = deps.users;
    const { queryClient } = context;

    await queryClient.infiniteQuery(postsQueryOptions(token, activeTab));
    return { token };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const activeTab = Route.useSearch().users ?? "all";
  const { token } = Route.useLoaderData();
  const { ref, inView } = useInView();
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(postsQueryOptions(token, activeTab));

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col">
      <HomePageHeader tab={activeTab} />
      <div>
        {
          data?.pages.flatMap(page => page.posts).map(post => (
            <PostCard key={post.id} post={post} />
          ))
        }
        {
          hasNextPage
            ? (
                <>
                  <PostCardSkeleton ref={ref} />
                  <PostCardSkeleton />
                  <PostCardSkeleton />
                </>
              )
            : (
                <p className="py-6 text-center text-xs text-(--app-muted)">
                  End of list
                </p>
              )
        }
      </div>
    </div>
  );
}
