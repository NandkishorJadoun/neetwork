import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { FollowRequestCard } from "../components/follow-request-card";
import { followRequestsQueryOptions } from "../queries";

export const FollowRequestsPage = () => {
  const { data: { followRequests } } = useSuspenseQuery(followRequestsQueryOptions());

  return (
    <>
      <PageHeader>Follow Requests</PageHeader>
      <div>
        {followRequests.length === 0
          ? (
              <p className="py-6 text-center text-xs text-(--app-muted)">
                No follow requests
              </p>
            )
          : (
              <>
                {
                  followRequests.map((followRequest) => {
                    const { id, senderId, sender } = followRequest;
                    return (
                      <FollowRequestCard
                        key={id}
                        senderId={senderId}
                        sender={sender}
                      />
                    );
                  })
                }
                <p className="py-6 text-center text-xs text-(--app-muted)">
                  End of list
                </p>
              </>
            )}
      </div>
    </>
  );
};
