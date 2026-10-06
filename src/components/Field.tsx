import { useId } from "react";

type CommonProps = {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
};

type InputProps = CommonProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "required"> & { as?: "input" };
type TextareaProps = CommonProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "required"> & { as: "textarea" };
type SelectProps = CommonProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "required"> & { as: "select"; options: { value: string; label: string }[] };

const controlClass =
  "mt-1.5 block w-full rounded-lg border border-line bg-white px-3.5 py-3 text-base text-ink placeholder:text-muted/70 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/40";

/** ラベル付き入力欄（input / textarea / select）。ラベルとエラーは aria で関連付けます。 */
export function Field(props: InputProps | TextareaProps | SelectProps) {
  const id = useId();
  const { label, required, hint, error } = props;
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;

  const shared = {
    id,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
    required,
  };

  let control: React.ReactNode;
  if (props.as === "textarea") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label: _l, required: _r, hint: _h, error: _e, as: _a, ...rest } = props;
    control = <textarea rows={4} {...rest} {...shared} className={controlClass} />;
  } else if (props.as === "select") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label: _l, required: _r, hint: _h, error: _e, as: _a, options, ...rest } = props;
    control = (
      <select {...rest} {...shared} className={controlClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label: _l, required: _r, hint: _h, error: _e, as: _a, ...rest } = props;
    control = <input {...rest} {...shared} className={controlClass} />;
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-navy">
        {label}
        {required ? (
          <span className="ml-1.5 rounded bg-cta px-1.5 py-0.5 align-middle text-[11px] font-bold text-white">必須</span>
        ) : (
          <span className="ml-1.5 rounded bg-light px-1.5 py-0.5 align-middle text-[11px] font-medium text-muted">任意</span>
        )}
      </label>
      {control}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1 text-sm font-medium text-cta">
          {error}
        </p>
      )}
    </div>
  );
}
