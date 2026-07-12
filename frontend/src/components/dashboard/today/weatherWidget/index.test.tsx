import dashboard from "@i18n/pl/dashboard.json";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { WeatherWidget } from ".";

const { useWeatherMock, useUserLocationMock } = vi.hoisted(() => ({
  useWeatherMock: vi.fn(),
  useUserLocationMock: vi.fn(),
}));

vi.mock("@hooks/dashboard/useWeather", () => ({
  useWeather: useWeatherMock,
}));
vi.mock("@hooks/dashboard/useUserLocation", () => ({
  useUserLocation: useUserLocationMock,
}));

const messages = { dashboard };

const renderWidget = () =>
  render(
    <NextIntlClientProvider locale="pl" messages={messages}>
      <WeatherWidget />
    </NextIntlClientProvider>,
  );

const hourly = Array.from({ length: 8 }, (_, i) => ({
  time: `2026-07-12T${10 + i}:00`,
  temperature: 30 + i,
  weatherCode: 1,
  precipitationProbability: i === 0 ? 40 : 0,
  precipitation: i === 0 ? 1.2 : 0,
}));

describe("WeatherWidget", () => {
  it("renders a loading skeleton while pending", () => {
    useUserLocationMock.mockReturnValue({ status: "loading" });
    useWeatherMock.mockReturnValue({
      status: "pending",
      data: undefined,
      isFetching: true,
      refetch: vi.fn(),
    });

    renderWidget();

    expect(screen.queryByText("21°")).not.toBeInTheDocument();
  });

  it("renders the error message when the weather request fails", () => {
    useUserLocationMock.mockReturnValue({ status: "loading" });
    useWeatherMock.mockReturnValue({
      status: "error",
      data: undefined,
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWidget();

    expect(screen.getByText("Nie udało się pobrać pogody")).toBeInTheDocument();
  });

  it("renders current weather and 8 hourly forecast items on success", () => {
    useUserLocationMock.mockReturnValue({
      status: "success",
      label: "Warszawa, Polska",
    });
    useWeatherMock.mockReturnValue({
      status: "success",
      data: {
        current: {
          time: "2026-07-12T09:00",
          temperature: 21.4,
          weatherCode: 1,
        },
        hourly,
      },
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWidget();

    expect(screen.getByText("Warszawa, Polska")).toBeInTheDocument();
    expect(screen.getByText("21°")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(8);
  });

  it("formats hourly forecast times in 24-hour format for the Polish locale", () => {
    useUserLocationMock.mockReturnValue({
      status: "success",
      label: "Warszawa, Polska",
    });
    useWeatherMock.mockReturnValue({
      status: "success",
      data: {
        current: {
          time: "2026-07-12T09:00",
          temperature: 21.4,
          weatherCode: 1,
        },
        hourly,
      },
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWidget();

    expect(screen.getByText("10:00")).toBeInTheDocument();
    expect(screen.queryByText(/AM|PM/)).not.toBeInTheDocument();
  });

  it("shows the precipitation chance and amount for hours with rain", () => {
    useUserLocationMock.mockReturnValue({
      status: "success",
      label: "Warszawa, Polska",
    });
    useWeatherMock.mockReturnValue({
      status: "success",
      data: {
        current: {
          time: "2026-07-12T09:00",
          temperature: 21.4,
          weatherCode: 1,
        },
        hourly,
      },
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWidget();

    expect(screen.getByText("40% • 1.2mm")).toBeInTheDocument();
  });

  it("hides the precipitation line for hours with no rain chance", () => {
    useUserLocationMock.mockReturnValue({
      status: "success",
      label: "Warszawa, Polska",
    });
    useWeatherMock.mockReturnValue({
      status: "success",
      data: {
        current: {
          time: "2026-07-12T09:00",
          temperature: 21.4,
          weatherCode: 1,
        },
        hourly,
      },
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWidget();

    expect(screen.queryByText(/0% • 0.0mm/)).not.toBeInTheDocument();
  });

  it("shows the location error message when location fails", () => {
    useUserLocationMock.mockReturnValue({ status: "error" });
    useWeatherMock.mockReturnValue({
      status: "success",
      data: { current: hourly[0], hourly },
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWidget();

    expect(screen.getByText("Lokalizacja niedostępna")).toBeInTheDocument();
  });

  it("calls refetch when the refresh button is clicked", () => {
    const refetch = vi.fn();
    useUserLocationMock.mockReturnValue({ status: "loading" });
    useWeatherMock.mockReturnValue({
      status: "success",
      data: { current: hourly[0], hourly },
      isFetching: false,
      refetch,
    });

    renderWidget();

    fireEvent.click(screen.getByRole("button", { name: "Odśwież pogodę" }));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("disables the refresh button while fetching", () => {
    useUserLocationMock.mockReturnValue({ status: "loading" });
    useWeatherMock.mockReturnValue({
      status: "success",
      data: { current: hourly[0], hourly },
      isFetching: true,
      refetch: vi.fn(),
    });

    renderWidget();

    expect(
      screen.getByRole("button", { name: "Odśwież pogodę" }),
    ).toBeDisabled();
  });
});
