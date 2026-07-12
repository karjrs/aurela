import { describe, expect, it } from "vitest";
import { isWithinNextHours } from "./isWithinNextHours";

describe("isWithinNextHours", () => {
  it("includes a task a few hours from now", () => {
    expect(isWithinNextHours(14, 10, 12)).toBe(true);
  });

  it("excludes a task more than the window away", () => {
    expect(isWithinNextHours(23, 10, 12)).toBe(false);
  });

  it("includes a task exactly at the current hour", () => {
    expect(isWithinNextHours(10, 10, 12)).toBe(true);
  });

  it("excludes a task exactly at the window boundary", () => {
    expect(isWithinNextHours(22, 10, 12)).toBe(false);
  });

  it("wraps across midnight when the window crosses it", () => {
    expect(isWithinNextHours(2, 22, 12)).toBe(true); // 22:00 -> 02:00 is 4h away
  });

  it("excludes a task earlier today (not a future wraparound)", () => {
    expect(isWithinNextHours(9, 10, 12)).toBe(false);
  });

  it("includes a task shortly after midnight when now is late the previous day", () => {
    expect(isWithinNextHours(0, 23, 12)).toBe(true); // 23:00 -> 00:00 is 1h away
  });
});
