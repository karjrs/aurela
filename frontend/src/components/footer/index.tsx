import { FooterNav } from "@components/nav/footer";
import { Brand } from "./brand";
import { Copyright } from "./copyright";

export const Footer = () => (
  <footer>
    <div className="flex flex-col mx-auto w-full max-w-page">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between py-12 px-4 border-y border-border">
        <Brand />
        <FooterNav />
      </div>
      <Copyright />
    </div>
  </footer>
);
