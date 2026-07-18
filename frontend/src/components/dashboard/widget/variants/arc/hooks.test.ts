import { describe, expect, it } from "vitest";
import { computeSunTimes } from "./helpers";

describe("computeSunTimes", () => {
  it("returns sunrise and sunset on the given day", () => {
    const { sunrise, sunset } = computeSunTimes(
      new Date(2026, 5, 21),
      52.2297,
      21.0122,
    );

    expect(sunrise.getFullYear()).toBe(2026);
    expect(sunrise.getMonth()).toBe(5);
    expect(sunset.getFullYear()).toBe(2026);
    expect(sunset.getMonth()).toBe(5);
  });

  it("gives a longer day in summer than in winter at a northern latitude", () => {
    const summer = computeSunTimes(new Date(2026, 5, 21), 52.2297, 21.0122);
    const winter = computeSunTimes(new Date(2026, 11, 21), 52.2297, 21.0122);

    const summerDayLength = summer.sunset.getTime() - summer.sunrise.getTime();
    const winterDayLength = winter.sunset.getTime() - winter.sunrise.getTime();

    expect(summerDayLength).toBeGreaterThan(winterDayLength);
  });

  it("keeps day length close to 12 hours at the equator", () => {
    const { sunrise, sunset } = computeSunTimes(new Date(2026, 2, 20), 0, 0);
    const dayLengthHours =
      (sunset.getTime() - sunrise.getTime()) / (60 * 60 * 1000);

    expect(dayLengthHours).toBeGreaterThan(11.5);
    expect(dayLengthHours).toBeLessThan(12.5);
  });
});
