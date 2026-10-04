import { z } from "zod/v4";
import { apiResponse, SuccessSchema } from "../shared/api-response.js";
import {
  CommentWithAuthorSchema,
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

export const CreatePostInputSchema = z.strictObject({
  content: z
    .string()
    .trim()
    .nonempty({ message: "Post cannot be empty" })
    .max(280, { message: "Post must be at most 280 characters" }),
});

export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;

export const CreatedPostSchema = z.strictObject({
  id: z.uuidv7(),
  text: z.string(),
  created_at: z.coerce.date(),
  userId: z.uuidv7(),
});

export const CreatePostSuccessSchema = z.strictObject({
  success: z.literal(true),
  post: CreatedPostSchema,
});

export const CreatePostSchema = apiResponse(CreatePostSuccessSchema);

export type CreatePostResponse = z.infer<typeof CreatePostSchema>;

export const PostIdParamsSchema = z.strictObject({
  postId: z.uuidv7(),
});

export type PostIdParams = z.infer<typeof PostIdParamsSchema>;
