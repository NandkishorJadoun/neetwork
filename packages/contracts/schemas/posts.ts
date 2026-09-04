import { z } from "zod/v4";
import { ApiErrorSchema } from "../shared/api-error.js";

export const GetAllPostsSuccessSchema = z.strictObject({
  success: z.literal(true),
  posts: z.array(
    z.strictObject({
      _count: z.strictObject({
        comments: z.number(),
        likes: z.number(),
      }),
      author: z.strictObject({
        image: z.string().nullable(),
        name: z.string(),
      }),
      likes: z.array(
        z.strictObject({
          id: z.cuid2(),
          userId: z.cuid2(),
          postId: z.cuid2(),
        }),
      ),
      id: z.cuid2(),
      text: z.string(),
      created_at: z.date(),
      userId: z.cuid2(),
    }),
  ),
  nextCursor: z.string().nullable(),
});

export const GetAllPostsSchema = z.discriminatedUnion("success", [
  GetAllPostsSuccessSchema,
  ApiErrorSchema,
]);

export type GetAllPostsResponse = z.infer<typeof GetAllPostsSchema>;

export const GetPostByIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  post: z.strictObject({
    id: z.cuid2(),
    text: z.string(),
    created_at: z.date(),
    userId: z.cuid2(),
    _count: z.strictObject({
      comments: z.number(),
      likes: z.number(),
    }),
    author: z.strictObject({
      image: z.string().nullable(),
      name: z.string(),
    }),
    likes: z.array(
      z.strictObject({
        id: z.cuid2(),
        userId: z.cuid2(),
        postId: z.cuid2(),
      }),
    ),
    comments: z.array(
      z.strictObject({
        id: z.cuid2(),
        text: z.string(),
        created_at: z.date(),
        userId: z.cuid2(),
        postId: z.cuid2(),
        author: z.strictObject({
          id: z.cuid2(),
          name: z.string(),
          image: z.string().nullable(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
      }),
    ),
  }),
});

export const GetPostByIdSchema = z.discriminatedUnion("success", [
  GetPostByIdSuccessSchema,
  ApiErrorSchema,
]);

export type GetPostByIdResponse = z.infer<typeof GetPostByIdSchema>;

export const DeletePostSchema = z.discriminatedUnion("success", [
  z.strictObject({ success: z.literal(true) }),
  ApiErrorSchema,
]);

export type DeletePostResponse = z.infer<typeof DeletePostSchema>;

export const GetLikesByPostIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  likes: z.array(
    z.strictObject({
      id: z.cuid2(),
      user: z.strictObject({
        id: z.cuid2(),
        name: z.string(),
        image: z.string().nullable(),
      }),
    }),
  ),
});

export const GetLikesByPostIdSchema = z.discriminatedUnion("success", [
  GetLikesByPostIdSuccessSchema,
  ApiErrorSchema,
]);

export type GetLikesByPostIdResponse = z.infer<typeof GetLikesByPostIdSchema>;

export const LikePostSchema = z.discriminatedUnion("success", [
  z.strictObject({ success: z.literal(true) }),
  ApiErrorSchema,
]);

export type LikePostResponse = z.infer<typeof LikePostSchema>;

export const UnlikePostSchema = z.discriminatedUnion("success", [
  z.strictObject({ success: z.literal(true) }),
  ApiErrorSchema,
]);

export type UnlikePostResponse = z.infer<typeof UnlikePostSchema>;
