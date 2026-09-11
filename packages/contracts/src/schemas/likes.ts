import { z } from "zod/v4";
import { apiResponse, SuccessSchema } from "../shared/api-response.js";
import { LikeWithUserSchema } from "../shared/entities.js";

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
