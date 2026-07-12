import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useUserLocation } from ".";

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
