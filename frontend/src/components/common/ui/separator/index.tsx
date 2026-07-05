"use client";

import { cn } from "@utils/helpers/cn";
import { Separator as SeparatorPrimitive } from "radix-ui";
import type { SeparatorProps } from "./types";

const Separator = ({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) => (
  <SeparatorPrimitive.Root
    data-slot="separator"
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
      className,
    )}
    {...props}
  />
);

export { Separator };
