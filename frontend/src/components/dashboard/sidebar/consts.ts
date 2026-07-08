import { cva } from "class-variance-authority";

export const sidebarItemVariants = cva(
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors [&_svg]:size-5",
  {
    variants: {
      active: {
        true: "bg-coral-100 text-coral-700 dark:bg-coral-950 dark:text-coral-300",
        false: "text-muted-foreground hover:bg-muted hover:text-foreground",
      },
    },
    defaultVariants: { active: false },
  },
);
