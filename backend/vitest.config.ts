import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths({ projects: ["./tsconfig.vitest.json"] })],
  test: {
    environment: "node",
    exclude: ["node_modules", "dist"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
