import { FieldError } from '../generated/graphql';

export const toErrorMap = (
  errors: FieldError[],
  transpose?: { fromField: string; toField: string },
) => {
  const errorMap: Record<string, string> = {};

  if (transpose) {
    errors.forEach(({ field, message }) => {
      if (field === transpose.fromField) {
        errorMap[field] = message;
        errorMap[transpose.toField] = message;
      }
      errorMap[field] = message;
    });
  } else {
    errors.forEach(({ field, message }) => {
      errorMap[field] = message;
    });
  }

  return errorMap;
};
