"use client";

import { cn } from "@utils/helpers/cn";
import type { EmojiPickerProps } from "./types";

export const EmojiPicker = ({
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
}: EmojiPickerProps) => (
  <div className="flex items-center gap-3.5">
    <div
      aria-hidden
      className="flex size-13 shrink-0 items-center justify-center rounded-full border border-border bg-background text-2xl"
    >
      {value}
    </div>
    <div
      aria-label={ariaLabel}
      role="radiogroup"
      className="flex flex-wrap gap-2"
    >
      {options.map((emoji) => {
        const selected = emoji === value;

        return (
          // biome-ignore lint/a11y/useSemanticElements: a native radio input can't render an emoji glyph or the chip styling
          <button
            key={emoji}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(emoji)}
            className={cn(
              "flex size-9 items-center justify-center rounded-xl border border-border bg-background text-base transition-colors",
              selected && "border-primary bg-[color:var(--accent-brand-soft)]",
            )}
          >
            {emoji}
          </button>
        );
      })}
    </div>
  </div>
);
