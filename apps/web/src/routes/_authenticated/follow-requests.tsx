import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FollowRequestCard } from "@/features/follow/components/follow-request-card";
import { followRequestsQueryOptions } from "@/features/follow/queries";

export const Route = createFileRoute("/_authenticated/follow-requests")({
  loader: ({ context }) => {
    context.queryClient.query(followRequestsQueryOptions());
  },
  component: function RouteComponent() {
    const { data: { followRequests } } = useSuspenseQuery(followRequestsQueryOptions());

    return (
      <>
        <PageHeader>Follow Requests</PageHeader>
        <div>
          {followRequests.length === 0
            ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <UserPlus />
                    </EmptyMedia>
                    <EmptyTitle>No follow requests</EmptyTitle>
                    <EmptyDescription>
                      When someone requests to follow you, they'll show up here.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )
            : (
                <>
                  {followRequests.map((followRequest) => {
                    const { id, senderId, sender } = followRequest;
                    return (
                      <FollowRequestCard
                        key={id}
                        senderId={senderId}
                        sender={sender}
                      />
                    );
                  })}
                </>
              )}
        </div>
      </>
    );
  },
});
