import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";

export const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aurela — A calmer way to plan your day",
  description:
    "Aurela turns your calendar and your to-dos into one simple daily rhythm.",
  icons: {
    icon: [
      { url: "/favicon-light.png", type: "image/png", sizes: "48x48" },
      {
        url: "/favicon-dark.png",
        type: "image/png",
        sizes: "48x48",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#f2c46b",
};
