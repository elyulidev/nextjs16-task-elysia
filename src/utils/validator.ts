import type { TaskValidator, UserValidator } from "@/actions";

export const validator = (
  validator: UserValidator | TaskValidator,
  data: unknown,
) => {
  const isValid = validator.Check(data);

  if (!isValid) {
    const errorsObject: Record<string, string> = {};

    const [_, errors] = validator.Errors(data);

    for (const error of errors) {
      errorsObject[error.instancePath.slice(1)] =
        error.message ?? "Error de validacion";
    }

    return { ok: false, errors: errorsObject };
  }

  return { ok: true };
};
