import { cx } from "@emotion/css";
import { FieldErrors, RegisterOptions } from "react-hook-form";

interface FormFieldProps {
  label: string;
  name: string;
  errors: FieldErrors;
  inputProps: object;
  register: (name: string, options?: RegisterOptions) => object;
  validation: RegisterOptions;
}

export default ({
  label,
  errors,
  name,
  validation,
  register,
  inputProps,
}: FormFieldProps) => {
  return (
    <label className="block text-sm font-semibold leading-6 text-gray-900">
      {label}
      <div className="mt-2.5">
        <input
          {...inputProps}
          {...register(name, validation)}
          className={cx(
            "input input-bordered input-primary w-full",
            errors[name] && "input-error"
          )}
        />
        {errors[name] && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors[name]?.message as string}
            </span>
          </label>
        )}
      </div>
    </label>
  );
};
