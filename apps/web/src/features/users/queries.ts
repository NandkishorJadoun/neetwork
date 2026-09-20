import { queryOptions } from "@tanstack/react-query";
import { fetchFollowersByUserId, fetchFollowingsByUserId, fetchNonFollowingUsers } from "./api";

export const followersByUserIdQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-followers", { userId }],
    queryFn: ({ signal }) => fetchFollowersByUserId({ userId, signal }),
  });

export const followingsByUserIdQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-followings", { userId }],
    queryFn: ({ signal }) => fetchFollowingsByUserId({ userId, signal }),
  });

export const nonFollowingUsersQueryOptions = () =>
  queryOptions({
    queryKey: ["non-following-users"],
    queryFn: ({ signal }) => fetchNonFollowingUsers({ signal }),
  });
