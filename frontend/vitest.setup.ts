import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import type { ComponentProps } from "react";
import { createElement } from "react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

vi.mock("@i18n/navigation", () => ({
  Link: ({ href, children, ...props }: ComponentProps<"a">) =>
    createElement("a", { href, ...props }, children),
  redirect: vi.fn(),
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  getPathname: () => "/",
}));
