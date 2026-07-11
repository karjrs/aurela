import { cva } from "class-variance-authority";

export const variants = cva(
  "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors [&_svg]:size-5",
  {
    variants: {
      active: {
        true: "text-coral-600",
        false: "text-muted-foreground hover:text-foreground",
      },
    },
    defaultVariants: { active: false },
  },
);
