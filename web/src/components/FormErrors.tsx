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
    <ul>
      {fieldErrors.map((fieldError, index) => (
        <li key={index} className="text-red-500">
          {fieldError.message}
        </li>
      ))}
    </ul>
  );
};