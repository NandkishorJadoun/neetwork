import type { UpdateProfileInput } from "@neetwork/contracts";
import {
  GetFollowersByUserIdSchema,
  GetFollowingsByUserIdSchema,
  GetUserProfileResponseSchema,
  RemoveFollowerSchema,
  toFieldErrors,
  UnfollowUserByIdSchema,
  UpdateProfileInputSchema,
  UpdateProfileSchema,
  ValidationErrorsSchema,
} from "@neetwork/contracts";
import { ApiValidationError } from "@/libs/api-error";

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

export const fetchUserProfile = async ({ signal }: { signal: AbortSignal }) => {
  const response = await fetch("/api/account", {
    credentials: "include",
    signal,
  });

  const json: unknown = await response.json();
  const result = GetUserProfileResponseSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    user: result.data.user,
  };
};

export const updateProfile = async (input: UpdateProfileInput) => {
  const parsedInput = UpdateProfileInputSchema.safeParse(input);

  if (!parsedInput.success) {
    throw new ApiValidationError(toFieldErrors(parsedInput.error.issues));
  }

  const response = await fetch("/api/account", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedInput.data),
  });

  const json: unknown = await response.json();

  if (!response.ok) {
    const errResult = ValidationErrorsSchema.safeParse(json);

    if (errResult.success) {
      throw new ApiValidationError(errResult.data.errors);
    }

    throw new Error(`Request failed: ${response.status}`);
  }

  const result = UpdateProfileSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    user: result.data.user,
  };
};
