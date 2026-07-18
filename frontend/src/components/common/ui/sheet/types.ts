import type { VariantProps } from "class-variance-authority";
import type { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import type { sheetContentVariants } from "./consts";

export type SheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export type SheetContentProps = ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof sheetContentVariants> & {
    showHandle?: boolean;
  };

export type SheetTitleProps = ComponentProps<typeof DialogPrimitive.Title>;

export type SheetDescriptionProps = ComponentProps<
  typeof DialogPrimitive.Description
>;

export type SheetOverlayProps = ComponentProps<typeof DialogPrimitive.Overlay>;

export type SheetHeaderProps = ComponentProps<"div">;

export type SheetFooterProps = ComponentProps<"div">;

export type SheetHandleProps = ComponentProps<"div">;
