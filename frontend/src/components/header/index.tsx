"use client";

import { Logo } from "@components/logo";
import { HeaderNav } from "@components/nav/header";
import { useScroll } from "@root/hooks/header/useScroll";
import { cn } from "@utils/helpers/cn";
import { HeaderActions } from "./actions";
import { HeaderLanguage } from "./language";
import { HeaderTheme } from "./theme";

export const Header = () => {
  const isScrolled = useScroll();

  return (
    <header
      className={cn(
        "sticky top-0 z-10 border-b px-2",
        isScrolled ? "border-border" : "border-transparent",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-card transition-opacity duration-250 ease-out",
          isScrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="relative mx-auto grid h-16 w-full max-w-page grid-cols-[auto_1fr_auto] items-center gap-4">
        <Logo />
        <HeaderNav />
        <div className="flex items-center justify-end gap-2">
          <HeaderTheme />
          <HeaderLanguage />
          <HeaderActions />
        </div>
      </div>
    </header>
  );
};
