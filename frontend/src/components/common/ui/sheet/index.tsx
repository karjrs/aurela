"use client";

import { cn } from "@utils/helpers/cn";
import { Dialog as DialogPrimitive } from "radix-ui";
import { sheetContentVariants } from "./consts";
import type {
  SheetContentProps,
  SheetDescriptionProps,
  SheetFooterProps,
  SheetHandleProps,
  SheetHeaderProps,
  SheetOverlayProps,
  SheetProps,
  SheetTitleProps,
} from "./types";

const Sheet = ({ open, onOpenChange, children }: SheetProps) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    {children}
  </DialogPrimitive.Root>
);

const SheetTrigger = DialogPrimitive.Trigger;

const SheetClose = DialogPrimitive.Close;

const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = ({ className, ...props }: SheetOverlayProps) => (
  <DialogPrimitive.Overlay
    data-slot="sheet-overlay"
    className={cn(
      "fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in",
      className,
    )}
    {...props}
  />
);

const SheetHandle = ({ className, ...props }: SheetHandleProps) => (
  <div
    aria-hidden
    data-slot="sheet-handle"
    className={cn(
      "mx-auto mb-4 h-1 w-9 shrink-0 rounded-full bg-border",
      className,
    )}
    {...props}
  />
);

const SheetContent = ({
  className,
  side,
  showHandle = true,
  children,
  ...props
}: SheetContentProps) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      data-slot="sheet-content"
      className={cn(sheetContentVariants({ side, className }))}
      {...props}
    >
      {showHandle && <SheetHandle />}
      {children}
    </DialogPrimitive.Content>
  </SheetPortal>
);

const SheetHeader = ({ className, ...props }: SheetHeaderProps) => (
  <div
    data-slot="sheet-header"
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
);

const SheetTitle = ({ className, ...props }: SheetTitleProps) => (
  <DialogPrimitive.Title
    data-slot="sheet-title"
    className={cn(
      "font-display text-lg font-medium text-foreground",
      className,
    )}
    {...props}
  />
);

const SheetDescription = ({ className, ...props }: SheetDescriptionProps) => (
  <DialogPrimitive.Description
    data-slot="sheet-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

const SheetFooter = ({ className, ...props }: SheetFooterProps) => (
  <div
    data-slot="sheet-footer"
    className={cn("mt-2 flex flex-col gap-2", className)}
    {...props}
  />
);

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHandle,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
