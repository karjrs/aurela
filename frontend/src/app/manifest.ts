import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => ({
  name: "Aurela",
  short_name: "Aurela",
  description:
    "Aurela turns your calendar and your to-dos into one simple daily rhythm.",
  start_url: "/",
  display: "standalone",
  background_color: "#fcf9f3",
  theme_color: "#f2c46b",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
});

export default manifest;
