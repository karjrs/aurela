import { describe, expect, it } from "vitest";
import { useSleep } from ".";

describe("useSleep", () => {
  it("returns the mocked slept hours and max hours", () => {
    const result = useSleep();

    expect(result.sleptHours).toBe(6.75);
    expect(result.maxHours).toBe(8);
  });
});
