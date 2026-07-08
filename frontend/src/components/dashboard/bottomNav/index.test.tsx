import nav from "@i18n/en/nav.json";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BottomNav } from ".";

const { usePathnameMock } = vi.hoisted(() => ({ usePathnameMock: vi.fn() }));

vi.mock("@i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: ComponentProps<"a"> & { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: usePathnameMock,
}));

const renderBottomNav = () =>
  render(
    <NextIntlClientProvider locale="en" messages={{ nav }}>
      <BottomNav />
    </NextIntlClientProvider>,
  );

beforeEach(() => {
  usePathnameMock.mockReset();
});

describe("BottomNav", () => {
  it("renders all five navigation items with their labels", () => {
    usePathnameMock.mockReturnValue("/dashboard");
    renderBottomNav();

    expect(screen.getByRole("link", { name: "Daily Rhythm" })).toHaveAttribute(
      "href",
      "/dashboard/daily-rhythm",
    );
    expect(screen.getByRole("link", { name: "Tasks" })).toHaveAttribute(
      "href",
      "/dashboard/tasks",
    );
    expect(screen.getByRole("link", { name: "Today" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: "Community" })).toHaveAttribute(
      "href",
      "/dashboard/community",
    );
    expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
      "href",
      "/dashboard/profile",
    );
  });

  it("marks only the item matching the current pathname as active", () => {
    usePathnameMock.mockReturnValue("/dashboard/tasks");
    renderBottomNav();

    expect(screen.getByRole("link", { name: "Tasks" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Today" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("marks Today as active only for the exact dashboard root", () => {
    usePathnameMock.mockReturnValue("/dashboard");
    renderBottomNav();

    expect(screen.getByRole("link", { name: "Today" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
