import { z } from "zod/v4";
import { apiResponse } from "../shared/api-response.js";

export const CreateCommentInputSchema = z.strictObject({
  content: z
    .string()
    .trim()
    .nonempty({ message: "Comment cannot be empty" })
    .max(280, { message: "Comment must be at most 280 characters" }),
});

export type CreateCommentInput = z.infer<typeof CreateCommentInputSchema>;

export const CreatedCommentSchema = z.strictObject({
  id: z.uuidv7(),
  text: z.string(),
  created_at: z.coerce.date(),
  userId: z.uuidv7(),
  postId: z.uuidv7(),
});

export const CreateCommentSuccessSchema = z.strictObject({
  success: z.literal(true),
  comment: CreatedCommentSchema,
});

export const CreateCommentSchema = apiResponse(CreateCommentSuccessSchema);

export type CreateCommentResponse = z.infer<typeof CreateCommentSchema>;
