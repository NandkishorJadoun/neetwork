import type { FieldError } from "@neetwork/contracts";

export class ApiValidationError extends Error {
  errors: FieldError[];

  constructor(errors: FieldError[], message = "Validation failed") {
    super(message);
    this.name = "ApiValidationError";
    this.errors = errors;
  }
}
