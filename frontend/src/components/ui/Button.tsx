type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-coral-600 text-white hover:bg-coral-700 active:bg-coral-800",
  secondary:
    "border border-ink-200 text-ink-900 hover:bg-mist-100 active:bg-mist-200",
  danger: "bg-coral-800 text-white hover:bg-coral-900 active:bg-coral-950",
};

export const Button = ({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => (
  <button
    className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-body text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    {...props}
  />
);
