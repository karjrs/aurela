import { cva } from "class-variance-authority";

export const bottomNavItemVariants = cva(
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

export const bottomNavFabVariants = cva(
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
