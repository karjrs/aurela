import type { Link } from "@utils/types";
import type { ReactNode } from "react";

export type SocialLink = Link & {
  icon: ReactNode;
};
