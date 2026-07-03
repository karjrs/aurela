import { forwardRef } from "react";

type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-sm font-medium text-ink-900">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={!!error}
        className={`rounded-lg border bg-white px-3.5 py-2.5 font-body text-ink-900 transition-colors duration-150 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 ${
          error ? "border-coral-600" : "border-ink-200 focus:border-coral-500"
        } ${className}`}
        {...props}
      />
      {error && (
        <p role="alert" className="font-body text-sm text-coral-700">
          {error}
        </p>
      )}
    </div>
  ),
);
Input.displayName = "Input";
