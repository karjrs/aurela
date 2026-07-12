import { describe, expect, it } from "vitest";
import { parseWeatherResponse } from "./parseWeatherResponse";

const hours = Array.from({ length: 24 }, (_, i) => i);

const rawResponse = {
  current: { time: "2026-07-12T09:00", temperature_2m: 21.4, weather_code: 1 },
  hourly: {
    time: hours.map((h) => `2026-07-12T${String(h).padStart(2, "0")}:00`),
    temperature_2m: hours.map((h) => 15 + h),
    weather_code: hours.map((h) => h % 4),
    precipitation_probability: hours.map((h) => (h === 10 ? 40 : 0)),
    precipitation: hours.map((h) => (h === 10 ? 1.2 : 0)),
  },
};

describe("parseWeatherResponse", () => {
  it("returns the current condition unchanged", () => {
    const result = parseWeatherResponse(
      rawResponse,
      new Date("2026-07-12T09:30"),
    );

    expect(result.current).toEqual({
      time: "2026-07-12T09:00",
      temperature: 21.4,
      weatherCode: 1,
    });
  });

  it("returns the next 8 hours after now, excluding the current hour", () => {
    const result = parseWeatherResponse(
      rawResponse,
      new Date("2026-07-12T09:30"),
    );

    expect(result.hourly).toHaveLength(8);
    expect(result.hourly[0]).toEqual({
      time: "2026-07-12T10:00",
      temperature: 25,
      weatherCode: 2,
      precipitationProbability: 40,
      precipitation: 1.2,
    });
    expect(result.hourly.at(-1)).toEqual({
      time: "2026-07-12T17:00",
      temperature: 32,
      weatherCode: 1,
      precipitationProbability: 0,
      precipitation: 0,
    });
  });

  it("returns fewer than 8 hours when less data is available", () => {
    const result = parseWeatherResponse(
      rawResponse,
      new Date("2026-07-12T21:30"),
    );

    expect(result.hourly).toHaveLength(2);
    expect(result.hourly[0].time).toBe("2026-07-12T22:00");
    expect(result.hourly[1].time).toBe("2026-07-12T23:00");
  });

  it("returns an empty array when now is after the last available hour", () => {
    const result = parseWeatherResponse(
      rawResponse,
      new Date("2026-07-13T01:00"),
    );

    expect(result.hourly).toEqual([]);
  });
});
