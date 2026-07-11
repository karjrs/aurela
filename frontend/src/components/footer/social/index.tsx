import { Button } from "@components/common/ui/button";
import { getTranslations } from "next-intl/server";
import { socialLinks } from "./consts";

export const Social = async () => {
  const t = await getTranslations("footer");

  return (
    <div className="flex items-center gap-1">
      {socialLinks.map(({ label, href, icon }) => (
        <Button key={label} asChild variant="ghost" size="icon">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(label)}
          >
            {icon}
          </a>
        </Button>
      ))}
    </div>
  );
};
