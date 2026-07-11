import { cva } from "class-variance-authority";

export const variants = cva(
  "flex size-14 -translate-y-4 shrink-0 items-center justify-center rounded-full shadow-lg ring-4 ring-background transition-colors [&_svg]:size-6",
  {
    variants: {
      active: {
        true: "bg-coral-700 text-white",
        false: "bg-coral-600 text-white hover:bg-coral-700",
      },
    },
    defaultVariants: { active: false },
  },
);
