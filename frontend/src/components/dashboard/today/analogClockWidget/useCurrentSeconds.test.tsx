import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCurrentSeconds } from "./useCurrentSeconds";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-07-12T10:00:05"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useCurrentSeconds", () => {
  it("returns the current seconds on mount", () => {
    const { result } = renderHook(() => useCurrentSeconds());
    expect(result.current).toBe(5);
  });

  it("updates every second", () => {
    const { result } = renderHook(() => useCurrentSeconds());
    act(() => vi.advanceTimersByTime(3000));
    expect(result.current).toBe(8);
  });

  it("wraps back to 0 after 59 seconds", () => {
    vi.setSystemTime(new Date("2026-07-12T10:00:59"));
    const { result } = renderHook(() => useCurrentSeconds());
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(0);
  });
});
