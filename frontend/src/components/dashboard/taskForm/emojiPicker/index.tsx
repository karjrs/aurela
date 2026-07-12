import { EMOJI_PRESETS } from "@components/dashboard/today/consts";
import { cn } from "@utils/helpers/cn";
import { useTranslations } from "next-intl";
import type { EmojiPickerProps } from "./types";

export const EmojiPicker = ({ value, onChange }: EmojiPickerProps) => {
  const t = useTranslations("dashboard.today.form");

  return (
    <div
      role="radiogroup"
      aria-label={t("emojiLabel")}
      className="flex flex-wrap gap-2"
    >
      {EMOJI_PRESETS.map((emoji) => (
        // biome-ignore lint/a11y/useSemanticElements: a styled <button role="radio"> keeps the emoji-grid layout that a native radio input's box model would fight
        <button
          key={emoji}
          type="button"
          role="radio"
          aria-checked={value === emoji}
          onClick={() => onChange(emoji)}
          className={cn(
            "flex size-9 items-center justify-center rounded-xl border text-lg outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            value === emoji
              ? "border-primary bg-[color:var(--accent-brand-soft)]"
              : "border-border bg-card hover:bg-muted",
          )}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};
