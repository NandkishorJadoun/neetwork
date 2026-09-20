import { GetAllNonFollowingUsersSchema, GetFollowersByUserIdSchema, GetFollowingsByUserIdSchema, RemoveFollowerSchema, SendFollowRequestSchema, UnfollowUserByIdSchema } from "@neetwork/contracts";

type fetchFollowersArgs = {
  userId: string;
  signal: AbortSignal;
};

type fetchFollowingsArgs = {
  userId: string;
  signal: AbortSignal;
};

export const fetchFollowersByUserId = async ({ userId, signal }: fetchFollowersArgs) => {
  const response = await fetch(`/api/users/${userId}/followers`, {
    credentials: "include",
    signal,
  });

  const json: unknown = await response.json();
  const result = GetFollowersByUserIdSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    followers: result.data.followers,
  };
};

export const fetchFollowingsByUserId = async ({ userId, signal }: fetchFollowingsArgs) => {
  const response = await fetch(`/api/users/${userId}/followings`, {
    credentials: "include",
    signal,
  });

  const json: unknown = await response.json();
  const result = GetFollowingsByUserIdSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    followings: result.data.followings,
  };
};

export const unfollowUserById = async (userId: string) => {
  const response = await fetch(`/api/follow/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const json: unknown = await response.json();
  const result = UnfollowUserByIdSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    success: result.data.success,
  };
};

export const removeFollower = async (userId: string) => {
  const response = await fetch(`/api/followers/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const json: unknown = await response.json();
  const result = RemoveFollowerSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    success: result.data.success,
  };
};

export const fetchNonFollowingUsers = async ({ signal }: { signal: AbortSignal }) => {
  const response = await fetch(`/api/users/`, {
    credentials: "include",
    signal,
  });

  const json: unknown = await response.json();
  const result = GetAllNonFollowingUsersSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    users: result.data.users,
  };
};

export const sendFollowRequest = async (userId: string) => {
  const response = await fetch(`/api/follow/${userId}`, {
    method: "POST",
    credentials: "include",
  });

  const json: unknown = await response.json();
  const result = SendFollowRequestSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    success: result.data.success,
  };
};
