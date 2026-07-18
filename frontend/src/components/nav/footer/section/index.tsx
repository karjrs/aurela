import { FooterNavList } from "../list";
import type { FooterNavSectionProps } from "./types";

export const FooterNavSection = ({ title, items }: FooterNavSectionProps) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    <FooterNavList items={items} />
  </div>
);
