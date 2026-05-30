"use client";

import { useActionState } from "react";
import Input from "./input";

export type FormState = {
  errors?: Record<string, string>;
  data?: string | null;
};

type FormProps = {
  textButton: string;
  action: (previousState: FormState, formData: FormData) => Promise<FormState>;
  inputs: Array<{
    id: number;
    label: string;
    type: string;
    name: string;
    value?: string;
  }>;
  className:
    | { form?: string; label?: string; input?: string; btn?: string }
    | undefined;
};

const Form = ({ textButton, action, inputs, className }: FormProps) => {
  const [state, formAction, isPending] = useActionState(action, {
    errors: {},
    data: null,
  });

  return (
    <form action={formAction} className={className?.form}>
      {inputs?.length > 0 &&
        inputs.map((ipt) => (
          <Input
            key={ipt.id}
            {...ipt}
            state={state}
            style={{ input: className?.input, label: className?.label }}
          />
        ))}
      <button type="submit" className={className?.btn} disabled={isPending}>
        {isPending ? "Procesando..." : textButton}
      </button>
      {state?.errors?.server && (
        <p className="text-red-500">{state?.errors?.server}</p>
      )}
    </form>
  );
};

export default Form;
