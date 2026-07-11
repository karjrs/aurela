import { describe, expect, it } from "vitest";
import { computeSunTimes } from ".";

describe("computeSunTimes", () => {
  it("returns sunrise and sunset within a 24 hour range", () => {
    const { sunrise, sunset } = computeSunTimes(
      new Date(2026, 5, 21),
      52.2297,
      21.0122,
    );

    expect(sunrise).toBeGreaterThanOrEqual(0);
    expect(sunrise).toBeLessThan(24);
    expect(sunset).toBeGreaterThanOrEqual(0);
    expect(sunset).toBeLessThan(24);
  });

  it("gives a longer day in summer than in winter at a northern latitude", () => {
    const summer = computeSunTimes(new Date(2026, 5, 21), 52.2297, 21.0122);
    const winter = computeSunTimes(new Date(2026, 11, 21), 52.2297, 21.0122);

    const summerDayLength = summer.sunset - summer.sunrise;
    const winterDayLength = winter.sunset - winter.sunrise;

    expect(summerDayLength).toBeGreaterThan(winterDayLength);
  });

  it("keeps day length close to 12 hours at the equator", () => {
    const { sunrise, sunset } = computeSunTimes(new Date(2026, 2, 20), 0, 0);
    const dayLength = sunset - sunrise;

    expect(dayLength).toBeGreaterThan(11.5);
    expect(dayLength).toBeLessThan(12.5);
  });
});
