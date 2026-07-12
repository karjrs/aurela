import dashboard from "@i18n/pl/dashboard.json";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { PlaceholderProgressWidget } from ".";

const messages = { dashboard };

describe("PlaceholderProgressWidget", () => {
  it("renders fixed sample values with the correct Polish plural label", () => {
    render(
      <NextIntlClientProvider locale="pl" messages={messages}>
        <PlaceholderProgressWidget />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("planów")).toBeInTheDocument();
  });
});
