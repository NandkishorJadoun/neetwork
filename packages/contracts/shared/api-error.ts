import { z } from "zod/v4";

export const ApiErrorSchema = z.strictObject({
  success: z.literal(false),
  message: z.string(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
