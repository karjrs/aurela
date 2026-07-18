"use client";

import { Button } from "@components/common/ui/button";
import type { ButtonProps } from "@components/common/ui/button/types";
import { useDarkTheme } from "@hooks/header/useDarkTheme";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";

export const HeaderTheme = (props: ButtonProps) => {
  const t = useTranslations("header.themeToggle");
  const [isDark, setTheme] = useDarkTheme();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={t(isDark ? "light" : "dark")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      {...props}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
};
