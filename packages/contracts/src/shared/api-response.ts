import { z } from "zod/v4";
import { ApiErrorSchema } from "./api-error.js";

export const SuccessSchema = z.strictObject({
  success: z.literal(true),
});

export const apiResponse = <S extends z.core.$ZodTypeDiscriminable>(
  successSchema: S,
) => z.discriminatedUnion("success", [successSchema, ApiErrorSchema]);
