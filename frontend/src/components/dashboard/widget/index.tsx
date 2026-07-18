import { Card } from "@components/common/ui/card";
import { Link } from "@i18n/navigation";
import { cn } from "@utils/helpers/cn";
import { ArrowUpRight } from "lucide-react";
import type { WidgetProps } from "./types";

export const Widget = ({
  href,
  className,
  ariaLabel,
  children,
}: WidgetProps) => {
  const content = (
    <Card
      className={cn(
        "rounded-3xl p-4 shadow-sm",
        href && "relative transition-opacity hover:opacity-90",
        className,
      )}
      aria-label={href ? undefined : ariaLabel}
    >
      {children}
      {href && (
        <ArrowUpRight
          className="absolute top-2.5 right-2.5 size-4 text-muted-foreground"
          aria-hidden
        />
      )}
    </Card>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label={ariaLabel} className="contents">
      {content}
    </Link>
  );
};
