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

export const UpdateProfileInputSchema = z.strictObject({
  fullname: z
    .string()
    .trim()
    .nonempty({ message: "Name field can't be empty" })
    .max(20, { message: "Name must be at most 20 characters long" }),

  about: z
    .string()
    .trim()
    .max(100, { message: "About must be at most 100 characters long" })
    .transform(val => (val.length === 0 ? null : val))
    .nullable(),

  image: z
    .url({ error: "Invalid avatar URL" })
    .max(500, { error: "Avatar URL too long" })
    .nullable()
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;

export const UpdatedProfileSchema = z.strictObject({
  id: z.uuidv7(),
  name: z.string(),
  image: z.string().nullable(),
  about: z.string().nullable(),
});

export const UpdateProfileSuccessSchema = z.strictObject({
  success: z.literal(true),
  user: UpdatedProfileSchema,
});

export const UpdateProfileSchema = apiResponse(UpdateProfileSuccessSchema);

export type UpdateProfileResponse = z.infer<typeof UpdateProfileSchema>;

export const AvatarSignatureSuccessSchema = z.strictObject({
  success: z.literal(true),
  signature: z.string(),
  timestamp: z.number(),
  folder: z.string(),
  public_id: z.string(),
  overwrite: z.string(),
  invalidate: z.string(),
  apiKey: z.string(),
  cloudName: z.string(),
});

export const AvatarSignatureResponseSchema = apiResponse(AvatarSignatureSuccessSchema);

export type AvatarSignatureResponse = z.infer<typeof AvatarSignatureResponseSchema>;
