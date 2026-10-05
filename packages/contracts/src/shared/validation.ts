import type { z } from "zod/v4";

export function toValidationMessage(issues: z.core.$ZodIssue[]) {
  return issues[0].message;
}
