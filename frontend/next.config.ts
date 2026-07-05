import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
