import { z } from "zod/v4";
import { apiResponse } from "../shared/api-response.js";
import { UserPreviewSchema } from "../shared/entities.js";

export const GetUserProfileSuccessSchema = z.strictObject({
  success: z.literal(true),
  user: UserPreviewSchema.extend({
    about: z.string().nullable(),
  }),
});

export const GetUserProfileResponseSchema = apiResponse(
  GetUserProfileSuccessSchema,
);

export type GetUserProfileResponse = z.infer<
  typeof GetUserProfileResponseSchema
>;
