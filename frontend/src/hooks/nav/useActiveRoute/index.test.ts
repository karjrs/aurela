import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useActiveRoute } from ".";

const { usePathnameMock } = vi.hoisted(() => ({ usePathnameMock: vi.fn() }));

vi.mock("@i18n/navigation", () => ({ usePathname: usePathnameMock }));

beforeEach(() => {
  usePathnameMock.mockReset();
});

describe("useActiveRoute", () => {
  it("matches an exact route only when the pathname equals the href", () => {
    usePathnameMock.mockReturnValue("/dashboard");
    const { result } = renderHook(() => useActiveRoute());

    expect(result.current.isActive({ href: "/dashboard", exact: true })).toBe(
      true,
    );
  });

  it("does not treat a sub-route as active for an exact route", () => {
    usePathnameMock.mockReturnValue("/dashboard/tasks");
    const { result } = renderHook(() => useActiveRoute());

    expect(result.current.isActive({ href: "/dashboard", exact: true })).toBe(
      false,
    );
  });

  it("matches a non-exact route when the pathname is a sub-path", () => {
    usePathnameMock.mockReturnValue("/dashboard/tasks/123");
    const { result } = renderHook(() => useActiveRoute());

    expect(result.current.isActive({ href: "/dashboard/tasks" })).toBe(true);
  });

  it("does not match a sibling route sharing the same string prefix", () => {
    usePathnameMock.mockReturnValue("/dashboard/tasks-archive");
    const { result } = renderHook(() => useActiveRoute());

    expect(result.current.isActive({ href: "/dashboard/tasks" })).toBe(false);
  });
});
