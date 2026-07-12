import dashboard from "@i18n/pl/dashboard.json";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { Greeting } from ".";

const { useUserLocationMock } = vi.hoisted(() => ({
  useUserLocationMock: vi.fn(),
}));

vi.mock("@hooks/dashboard/useUserLocation", () => ({
  useUserLocation: useUserLocationMock,
}));

const messages = { dashboard };
const now = new Date("2026-07-12T09:00:00");

const renderGreeting = () =>
  render(
    <NextIntlClientProvider locale="pl" messages={messages}>
      <Greeting now={now} userName="Karol" />
    </NextIntlClientProvider>,
  );

describe("Greeting", () => {
  it("renders the greeting with the user's name", () => {
    useUserLocationMock.mockReturnValue({ status: "loading" });

    renderGreeting();

    expect(screen.getByText(/, Karol$/)).toBeInTheDocument();
  });

  it("renders nothing extra while location is loading", () => {
    useUserLocationMock.mockReturnValue({ status: "loading" });

    renderGreeting();

    expect(
      screen.queryByText("Lokalizacja niedostępna"),
    ).not.toBeInTheDocument();
  });

  it("renders the location label on success", () => {
    useUserLocationMock.mockReturnValue({
      status: "success",
      label: "Warszawa, Polska",
    });

    renderGreeting();

    expect(screen.getByText("Warszawa, Polska")).toBeInTheDocument();
  });

  it("renders the error message on error", () => {
    useUserLocationMock.mockReturnValue({ status: "error" });

    renderGreeting();

    expect(screen.getByText("Lokalizacja niedostępna")).toBeInTheDocument();
  });
});
