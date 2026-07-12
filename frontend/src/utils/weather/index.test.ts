import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
} from "lucide-react";
import { describe, expect, it } from "vitest";
import { getWeatherIcon } from ".";

describe("getWeatherIcon", () => {
  it.each([
    [0, Sun],
    [1, CloudSun],
    [2, CloudSun],
    [3, Cloud],
    [45, CloudFog],
    [48, CloudFog],
    [51, CloudDrizzle],
    [61, CloudRain],
    [80, CloudRain],
    [71, CloudSnow],
    [85, CloudSnow],
    [95, CloudLightning],
    [99, CloudLightning],
  ])("maps weather code %i to the expected icon", (code, expectedIcon) => {
    expect(getWeatherIcon(code)).toBe(expectedIcon);
  });

  it("falls back to Cloud for an unknown weather code", () => {
    expect(getWeatherIcon(-1)).toBe(Cloud);
  });
});
