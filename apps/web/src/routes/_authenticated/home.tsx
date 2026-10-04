import type { ActiveTab } from "@/features/posts/queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { z } from "zod/v4";
import { HomePageHeader } from "@/components/home-page-header";
import { PostCard } from "@/features/posts/components/post-card";
import { PostCardSkeleton } from "@/features/posts/components/post-skeleton";
import { postsQueryOptions } from "@/features/posts/queries";

const homeSearchSchema = z.object({
  users: z.enum(["following"]).optional(),
});

export const Route = createFileRoute("/_authenticated/home")({
  validateSearch: search => homeSearchSchema.parse(search),
  loaderDeps: ({ search }): { users: ActiveTab } => ({ users: search.users ?? "all" }),
  loader: ({ context, deps }) => {
    context.queryClient.infiniteQuery(postsQueryOptions(deps.users));
    return { activeTab: deps.users };
  },
  component: function RouteComponent() {
    const { activeTab } = Route.useLoaderData();
    const { ref, inView } = useInView();
    const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(postsQueryOptions(activeTab));

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
            hasNextPage && (
              <>
                <PostCardSkeleton ref={ref} />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </>
            )
          }
        </div>
      </div>
    );
  },
});
