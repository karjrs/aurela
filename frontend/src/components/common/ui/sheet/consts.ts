import { cva } from "class-variance-authority";

export const sheetContentVariants = cva(
  "fixed inset-x-0 bottom-0 z-50 flex max-h-[88%] flex-col overflow-y-auto rounded-t-3xl border-t border-border bg-popover px-5 pt-2.5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-popover-foreground shadow-[0_-12px_40px_rgba(20,16,32,0.18)] outline-none data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in",
  {
    variants: {
      side: {
        bottom: "",
      },
    },
    defaultVariants: {
      side: "bottom",
    },
  },
);
