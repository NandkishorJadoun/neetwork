import { z } from "zod/v4";
import { ApiErrorSchema } from "./api-error.js";

export const SuccessSchema = z.strictObject({
  success: z.literal(true),
});

export function apiResponse<S extends z.core.$ZodTypeDiscriminable>(successSchema: S) {
  return z.discriminatedUnion("success", [successSchema, ApiErrorSchema]);
}
