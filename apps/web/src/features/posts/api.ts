import type { ActiveTab } from "./queries";
import { CreateCommentInputSchema, CreateCommentSchema, CreatePostInputSchema, CreatePostSchema, GetAllPostsSchema, GetLikesByPostIdSchema, GetPostByIdSchema, LikePostSchema, toFieldErrors, UnlikePostSchema, ValidationErrorsSchema } from "@neetwork/contracts";
import { ApiValidationError } from "@/libs/api-error";

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
    throw new Error(`Invalid response: ${response.status}`);
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
    throw new Error(`Invalid response: ${response.status}`);
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
    throw new Error(`Invalid response: ${response.status}`);
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
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    post: result.data.post,
  };
};

type FetchLikesByPostIdArgs = {
  postId: string;
  signal: AbortSignal;
};

export const fetchLikesByPostId = async ({ postId, signal }: FetchLikesByPostIdArgs) => {
  const response = await fetch(`/api/posts/${postId}/likes`, {
    credentials: "include",
    signal,
  });

  const json: unknown = await response.json();
  const result = GetLikesByPostIdSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    likes: result.data.likes,
  };
};

export const createPost = async (input: { content: string }) => {
  const parsedInput = CreatePostInputSchema.safeParse(input);

  if (!parsedInput.success) {
    throw new ApiValidationError(toFieldErrors(parsedInput.error.issues));
  }

  const response = await fetch("/api/posts/", {
    method: "POST",
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

  const result = CreatePostSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    post: result.data.post,
  };
};

export const createComment = async (input: { postId: string; content: string }) => {
  const parsedInput = CreateCommentInputSchema.safeParse({ content: input.content });

  if (!parsedInput.success) {
    throw new ApiValidationError(toFieldErrors(parsedInput.error.issues));
  }

  const response = await fetch(`/api/posts/${input.postId}/comment`, {
    method: "POST",
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

  const result = CreateCommentSchema.safeParse(json);

  if (!result.success) {
    throw new Error(`Invalid response: ${response.status}`);
  }

  if (!result.data.success) {
    throw new Error(result.data.message);
  }

  return {
    comment: result.data.comment,
  };
};
