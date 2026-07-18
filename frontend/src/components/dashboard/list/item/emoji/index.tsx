import type { DashboardListItemEmojiProps } from "./types";

export const DashboardListItemEmoji = ({
  emoji,
}: DashboardListItemEmojiProps) => (
  <div
    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-base"
    aria-hidden
  >
    {emoji}
  </div>
);
