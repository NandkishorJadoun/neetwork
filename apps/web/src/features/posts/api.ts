import type { ActiveTab } from "./queries";
import { GetAllPostsSchema, GetPostByIdSchema, LikePostSchema, UnlikePostSchema } from "@neetwork/contracts";

type FetchPostsArgs = {
  activeTab: ActiveTab;
  nextCursor?: string;
  signal: AbortSignal;
};

export const fetchFeedPosts = async ({
  activeTab,
  nextCursor,
  signal,
}: FetchPostsArgs) => {
  const params = new URLSearchParams();

  if (activeTab === "following") {
    params.set("users", "following");
  }

  if (nextCursor) {
    params.set("cursor", nextCursor);
  }

  const response = await fetch(`/api/posts?${params.toString()}`, {
    credentials: "include",
    signal,
  });

  const json: unknown = await response.json();
  const result = GetAllPostsSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid posts response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    posts: result.data.posts,
    nextCursor: result.data.nextCursor,
  };
};

export const likePost = async ({ postId }: { postId: string }) => {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: "POST",
    credentials: "include",
  });

  const json: unknown = await response.json();
  const result = LikePostSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid posts response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    success: result.data.success,
  };
};

export const unlikePost = async ({ postId }: { postId: string }) => {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: "DELETE",
    credentials: "include",
  });

  const json: unknown = await response.json();
  const result = UnlikePostSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid posts response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    success: result.data.success,
  };
};

type FetchPostByIdArgs = {
  postId: string;
  signal: AbortSignal;
};

export const fetchPostById = async ({ postId, signal }: FetchPostByIdArgs) => {
  const response = await fetch(`/api/posts/${postId}`, {
    credentials: "include",
    signal,
  });

  const json: unknown = await response.json();
  const result = GetPostByIdSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid posts response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    post: result.data.post,
  };
};
