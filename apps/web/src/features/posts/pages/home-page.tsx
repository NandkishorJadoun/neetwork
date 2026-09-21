import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { HomePageHeader } from "@/components/home-page-header";
import { PostCard } from "@/features/posts/components/post-card";
import { PostCardSkeleton } from "@/features/posts/components/post-skeleton";
import { Route } from "@/routes/_authenticated/home";
import { postsQueryOptions } from "../queries";

export const HomePage = () => {
  const { activeTab } = Route.useLoaderData();
  const { ref, inView } = useInView();
  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery(postsQueryOptions(activeTab));

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
          data.pages.flatMap(page => page.posts).map(post => (
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
};
