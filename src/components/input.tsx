import type { FormState } from "./form";

type InputProps = {
  state: FormState;
  label: string;
  type: string;
  name: string;
  value?: string;
  style: { input?: string; label?: string };
};

const Input = ({ state, label, type, name, value, style }: InputProps) => {
  const input =
    type === "hidden" ? (
      <input
        type={type}
        className="mt-1 p-2 border border-gray-300 rounded w-full"
        name={name}
        defaultValue={value}
        key={value}
        required
      />
    ) : (
      <label className={style?.label}>
        <p className="text-sm font-medium text-background dark:text-foreground">
          {label}
        </p>
        <input
          type={type}
          className={style?.input}
          name={name}
          defaultValue={value}
          key={value}
          required
        />
        {state?.errors?.email && (
          <p className="text-red-500">{state?.errors?.email}</p>
        )}
      </label>
    );
  return input;
};

export default Input;
