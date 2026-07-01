import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import messages from "../../messages/en.json";
import Home from "./page";

const renderHome = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Home />
    </NextIntlClientProvider>,
  );

describe("Home", () => {
  it("renders the hero heading", () => {
    renderHome();
    expect(
      screen.getByRole("heading", { name: /your day, quietly planned/i }),
    ).toBeInTheDocument();
  });

  it("renders a get started call to action", () => {
    renderHome();
    expect(
      screen.getAllByRole("button", { name: /get started/i }),
    ).toHaveLength(2);
  });
});
