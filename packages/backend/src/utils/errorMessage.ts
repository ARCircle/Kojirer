import typia from 'typia';

export const typiaValidationErrorMessage = (errors: typia.IValidation.IError[]): string => {
  return `Validation errors found:\n${errors
    .map((e) => `On ${e.path} Expected ${e.expected} Received ${e.value}`)
    .join('\n')}`;
};
