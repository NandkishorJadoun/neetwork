import { queryOptions } from "@tanstack/react-query";
import { fetchCommentsByUserId, fetchFollowersByUserId, fetchFollowingsByUserId, fetchLikedPostsByUserId, fetchNonFollowingUsers, fetchPostsByUserId, fetchUserById } from "./api";

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

export const userByIdQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-profile", { userId }],
    queryFn: ({ signal }) => fetchUserById({ userId, signal }),
  });

export const postsByUserIdQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-posts", { userId }],
    queryFn: ({ signal }) => fetchPostsByUserId({ userId, signal }),
  });

export const commentsByUserIdQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-comments", { userId }],
    queryFn: ({ signal }) => fetchCommentsByUserId({ userId, signal }),
  });

export const likedPostsByUserIdQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-likes", { userId }],
    queryFn: ({ signal }) => fetchLikedPostsByUserId({ userId, signal }),
  });
