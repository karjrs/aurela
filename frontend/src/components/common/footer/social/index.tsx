import { Button } from "@components/common/ui/button";
import { getTranslations } from "next-intl/server";
import { SOCIAL_LINKS } from "./consts";

export const Social = async () => {
  const t = await getTranslations("footer");

  return (
    <div className="flex items-center gap-1">
      {SOCIAL_LINKS.map(({ labelKey, href, Icon }) => (
        <Button key={labelKey} asChild variant="ghost" size="icon">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(labelKey)}
          >
            <Icon />
          </a>
        </Button>
      ))}
    </div>
  );
};
