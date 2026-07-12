import { describe, expect, it } from "vitest";
import { pointOnClock } from "./pointOnClock";

describe("pointOnClock", () => {
  it("places fraction 0 at the top (12 o'clock)", () => {
    const p = pointOnClock(0, 40, 50);
    expect(p.x).toBeCloseTo(50);
    expect(p.y).toBeCloseTo(10);
  });

  it("places fraction 0.25 at the right (3 o'clock)", () => {
    const p = pointOnClock(0.25, 40, 50);
    expect(p.x).toBeCloseTo(90);
    expect(p.y).toBeCloseTo(50);
  });

  it("places fraction 0.5 at the bottom (6 o'clock)", () => {
    const p = pointOnClock(0.5, 40, 50);
    expect(p.x).toBeCloseTo(50);
    expect(p.y).toBeCloseTo(90);
  });

  it("places fraction 0.75 at the left (9 o'clock)", () => {
    const p = pointOnClock(0.75, 40, 50);
    expect(p.x).toBeCloseTo(10);
    expect(p.y).toBeCloseTo(50);
  });

  it("scales with radius and offsets with center", () => {
    const p = pointOnClock(0, 10, 0);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(-10);
  });
});
