export type EmojiPickerProps = {
  value: string;
  onChange: (emoji: string) => void;
  options: string[];
  "aria-label"?: string;
};
