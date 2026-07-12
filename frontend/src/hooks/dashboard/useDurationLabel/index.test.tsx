import dashboard from "@i18n/pl/dashboard.json";
import { renderHook } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { useDurationLabel } from ".";

const messages = { dashboard };

const renderDurationLabel = () =>
  renderHook(() => useDurationLabel(), {
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale="pl" messages={messages}>
        {children}
      </NextIntlClientProvider>
    ),
  });

describe("useDurationLabel", () => {
  it("formats hours and minutes together", () => {
    const { result } = renderDurationLabel();

    expect(result.current(1.5)).toBe("1 h 30 min");
  });

  it("formats whole hours without minutes", () => {
    const { result } = renderDurationLabel();

    expect(result.current(2)).toBe("2 h");
  });

  it("formats minutes-only durations", () => {
    const { result } = renderDurationLabel();

    expect(result.current(0.25)).toBe("15 min");
  });
});
