import { HeaderNav } from "@components/nav/header";
import { Actions } from "./actions";
import { Language } from "./language";
import { Logo } from "./logo";
import { Theme } from "./theme";

export const Header = () => (
  <header className="sticky top-0 z-10 border-b border-border bg-aurela px-2">
    <div className="mx-auto grid h-16 w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4">
      <Logo />
      <HeaderNav />
      <div className="flex items-center justify-end gap-2">
        <Theme />
        <Language />
        <Actions />
      </div>
    </div>
  </header>
);
