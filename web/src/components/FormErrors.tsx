import type { ValidationError } from "../types";

type FormErrorsProps = {
  fieldName: string;
  errors: null | ValidationError[];
}

export const FormErrors = ({ fieldName, errors }: FormErrorsProps) => {
  if (!errors) return null;

  const fieldErrors = errors.filter(
    (error) => error.fieldName === fieldName,
  );

  if (fieldErrors.length === 0) return null;

  return (
    <ul className="mt-4 border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
      {fieldErrors.map((fieldError, index) => (
        <li key={index}>
          {fieldError.message}
        </li>
      ))}
    </ul>
  );
};