import type { ComponentPropsWithoutRef } from "react";
import { size } from "./consts";

export const LogoIcon = (props: ComponentPropsWithoutRef<"svg">) => (
  <svg viewBox="0 0 160 160" width={size} height={size} role="img" {...props}>
    <defs>
      <linearGradient id="logo-sun" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="var(--color-amber-400)" />
        <stop offset="100%" stopColor="var(--color-coral-500)" />
      </linearGradient>
      <radialGradient id="logo-glow">
        <stop
          offset="0%"
          stopColor="var(--color-amber-400)"
          stopOpacity="0.3"
        />
        <stop
          offset="100%"
          stopColor="var(--color-amber-400)"
          stopOpacity="0"
        />
      </radialGradient>
      <clipPath id="logo-clip">
        <circle cx="80" cy="81.6" r="55.1" />
      </clipPath>
      <linearGradient id="logo-hill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="var(--logo-hill-from)" />
        <stop offset="100%" stopColor="var(--logo-hill-to)" />
      </linearGradient>
    </defs>
    <circle cx="80" cy="81.6" r="71.3" fill="url(#logo-glow)" />
    <g clipPath="url(#logo-clip)">
      <circle cx="80" cy="81.6" r="55.1" fill="url(#logo-sun)" />
      <path
        d="M -1 114 Q 39.5 91.3 80 114 T 161 114 L 161 149.7 L -1 149.7 Z"
        fill="url(#logo-hill)"
      />
      <path
        d="M -1 114 Q 39.5 91.3 80 114 T 161 114"
        fill="none"
        stroke="#FDF9EF"
        strokeWidth="2.4"
        opacity="0.7"
      />
    </g>
  </svg>
);
