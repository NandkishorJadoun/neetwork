import { z } from "zod/v4";

export const FieldErrorSchema = z.strictObject({
  fieldName: z.string(),
  message: z.string(),
});

export type FieldError = z.infer<typeof FieldErrorSchema>;

// Legacy alias: web previously used `ValidationError`, api used its own copy.
// Both should import this single source going forward.
export type ValidationError = FieldError;

export const ValidationErrorsSchema = z.strictObject({
  errors: z.array(FieldErrorSchema),
});

export type ValidationErrorsResponse = z.infer<typeof ValidationErrorsSchema>;

export function toFieldErrors(error: z.core.$ZodIssue[]): FieldError[] {
  return error.map(issue => ({
    fieldName: String(issue.path[0] ?? "form"),
    message: issue.message,
  }));
}
