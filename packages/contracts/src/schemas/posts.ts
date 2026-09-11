import { z } from "zod/v4";
import { apiResponse, SuccessSchema } from "../shared/api-response.js";
import {
  CommentWithAuthorSchema,
  LikeWithUserSchema,
  PostCardSchema,
} from "../shared/entities.js";

export const GetAllPostsSuccessSchema = z.strictObject({
  success: z.literal(true),
  posts: z.array(PostCardSchema),
  nextCursor: z.string().nullable(),
});

export const GetAllPostsSchema = apiResponse(GetAllPostsSuccessSchema);

export type GetAllPostsResponse = z.infer<typeof GetAllPostsSchema>;

export const GetPostByIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  post: PostCardSchema.extend({
    comments: z.array(CommentWithAuthorSchema),
  }),
});

export const GetPostByIdSchema = apiResponse(GetPostByIdSuccessSchema);

export type GetPostByIdResponse = z.infer<typeof GetPostByIdSchema>;

export const DeletePostSchema = apiResponse(SuccessSchema);

export type DeletePostResponse = z.infer<typeof DeletePostSchema>;

export const GetLikesByPostIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  likes: z.array(LikeWithUserSchema),
});

export const GetLikesByPostIdSchema = apiResponse(GetLikesByPostIdSuccessSchema);

export type GetLikesByPostIdResponse = z.infer<typeof GetLikesByPostIdSchema>;

export const LikePostSchema = apiResponse(SuccessSchema);

export type LikePostResponse = z.infer<typeof LikePostSchema>;

export const UnlikePostSchema = apiResponse(SuccessSchema);

export type UnlikePostResponse = z.infer<typeof UnlikePostSchema>;
