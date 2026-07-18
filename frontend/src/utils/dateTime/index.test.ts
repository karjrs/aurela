import { describe, expect, it } from "vitest";
import { addHours, atHour, hourOfDay } from ".";

describe("hourOfDay", () => {
  it("extracts the decimal hour from a Date", () => {
    expect(hourOfDay(new Date(2026, 0, 1, 6, 30))).toBe(6.5);
  });

  it("returns 0 at midnight", () => {
    expect(hourOfDay(new Date(2026, 0, 1, 0, 0))).toBe(0);
  });
});

describe("atHour", () => {
  it("sets the hour and minute on the reference day", () => {
    const reference = new Date(2026, 5, 21, 3, 15);
    const result = atHour(14.25, reference);

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(21);
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(15);
  });

  it("wraps negative and >24 hour values", () => {
    const reference = new Date(2026, 0, 1);

    expect(atHour(-1, reference).getHours()).toBe(23);
    expect(atHour(25, reference).getHours()).toBe(1);
  });
});

describe("addHours", () => {
  it("adds a fractional number of hours", () => {
    const start = new Date(2026, 0, 1, 10, 0);
    const result = addHours(start, 1.5);

    expect(result.getHours()).toBe(11);
    expect(result.getMinutes()).toBe(30);
  });

  it("rolls over to the next day past midnight", () => {
    const start = new Date(2026, 0, 1, 23, 0);
    const result = addHours(start, 2);

    expect(result.getDate()).toBe(2);
    expect(result.getHours()).toBe(1);
  });
});
