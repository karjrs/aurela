import { Brand } from "./brand";
import { Copyright } from "./copyright";
import { Links } from "./links";

export const Footer = () => (
  <footer className="border-t border-border">
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr]">
        <Brand />
        <Links />
      </div>
      <Copyright />
    </div>
  </footer>
);
