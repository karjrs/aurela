import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useUserLocation, useWeather } from "./hooks";

describe("useWeather", () => {
  const rawResponse = {
    current: {
      time: "2026-07-12T09:00",
      temperature_2m: 21.4,
      weather_code: 1,
    },
    hourly: {
      time: ["2026-07-12T10:00"],
      temperature_2m: [22],
      weather_code: [1],
    },
  };

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    return Wrapper;
  };

  const originalGeolocation = navigator.geolocation;

  afterEach(() => {
    Object.defineProperty(navigator, "geolocation", {
      value: originalGeolocation,
      configurable: true,
    });
    vi.unstubAllGlobals();
  });

  it("fetches with the Warsaw fallback coordinates when geolocation is unavailable", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: undefined,
      configurable: true,
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => rawResponse });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.status).toBe("success"));

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("latitude=52.2297"),
    );
  });

  it("requests precipitation chance and amount in the hourly params", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: undefined,
      configurable: true,
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => rawResponse });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.status).toBe("success"));

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        "hourly=temperature_2m,weather_code,precipitation_probability,precipitation",
      ),
    );
  });

  it("fetches with the geolocated coordinates once available", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: { latitude: 10, longitude: 20 },
          } as GeolocationPosition);
        },
      },
      configurable: true,
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => rawResponse });
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useWeather(), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("latitude=10"),
      ),
    );
  });

  it("returns parsed weather data on success", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: undefined,
      configurable: true,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => rawResponse }),
    );

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.data?.current.temperature).toBe(21.4);
  });

  it("sets error status when the request fails", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: undefined,
      configurable: true,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }),
    );

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.status).toBe("error"));
  });

  it("refetches when refetch is called", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: undefined,
      configurable: true,
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => rawResponse });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useWeather(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.status).toBe("success"));
    const callsBeforeRefetch = fetchMock.mock.calls.length;

    await result.current.refetch();

    expect(fetchMock.mock.calls.length).toBeGreaterThan(callsBeforeRefetch);
  });
});

describe("useUserLocation", () => {
  const originalGeolocation = navigator.geolocation;

  afterEach(() => {
    Object.defineProperty(navigator, "geolocation", {
      value: originalGeolocation,
      configurable: true,
    });
    vi.unstubAllGlobals();
  });

  it("starts in loading state", () => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: vi.fn(),
      },
      configurable: true,
    });

    const { result } = renderHook(() => useUserLocation());

    expect(result.current).toEqual({ status: "loading" });
  });

  it("resolves to success with city and country", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: { latitude: 52.23, longitude: 21.01 },
          } as GeolocationPosition);
        },
      },
      configurable: true,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          address: { city: "Warszawa", country: "Polska" },
        }),
      }),
    );

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() =>
      expect(result.current).toEqual({
        status: "success",
        label: "Warszawa, Polska",
      }),
    );
  });

  it("resolves to error when permission is denied", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (
          _success: PositionCallback,
          error: PositionErrorCallback,
        ) => {
          error({ code: 1, message: "denied" } as GeolocationPositionError);
        },
      },
      configurable: true,
    });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => expect(result.current).toEqual({ status: "error" }));
  });

  it("resolves to error when reverse geocoding fails", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: { latitude: 52.23, longitude: 21.01 },
          } as GeolocationPosition);
        },
      },
      configurable: true,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }),
    );

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => expect(result.current).toEqual({ status: "error" }));
  });

  it("resolves to error when geolocation is unsupported", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: undefined,
      configurable: true,
    });

    const { result } = renderHook(() => useUserLocation());

    await waitFor(() => expect(result.current).toEqual({ status: "error" }));
  });
});
