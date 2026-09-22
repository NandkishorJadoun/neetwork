import { AcceptFollowRequestSchema, GetAllFollowRequestsSchema, RejectFollowRequestSchema } from "@neetwork/contracts";

export const fetchFollowRequests = async ({ signal }: { signal: AbortSignal }) => {
  const response = await fetch(`/api/follow-requests`, {
    credentials: "include",
    signal,
  });

  const json: unknown = await response.json();
  const result = GetAllFollowRequestsSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    followRequests: result.data.followRequests,
  };
};

export const acceptFollowRequest = async (senderId: string) => {
  const response = await fetch(`/api/follow-requests/${senderId}`, {
    method: "PATCH",
    credentials: "include",
  });

  const json: unknown = await response.json();
  const result = AcceptFollowRequestSchema.safeParse(json);

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

export const rejectFollowRequest = async (senderId: string) => {
  const response = await fetch(`/api/follow-requests/${senderId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const json: unknown = await response.json();
  const result = RejectFollowRequestSchema.safeParse(json);

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
