import { queryOptions } from "@tanstack/react-query";
import { fetchFollowRequests } from "./api";

export const followRequestsQueryOptions = () =>
  queryOptions({
    queryKey: ["follow-requests"],
    queryFn: ({ signal }) => fetchFollowRequests({ signal }),
  });
