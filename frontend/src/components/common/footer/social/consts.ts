import { X } from "lucide-react";
import type { ComponentPropsWithoutRef, ComponentType } from "react";
import { FacebookIcon } from "./icons/facebook";
import { InstagramIcon } from "./icons/instagram";
import { LinkedinIcon } from "./icons/linkedin";

type SocialLink = {
  labelKey: string;
  href: string;
  Icon: ComponentType<ComponentPropsWithoutRef<"svg">>;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { labelKey: "social.facebook", href: "#", Icon: FacebookIcon },
  { labelKey: "social.x", href: "#", Icon: X },
  { labelKey: "social.instagram", href: "#", Icon: InstagramIcon },
  { labelKey: "social.linkedin", href: "#", Icon: LinkedinIcon },
];
