"use client";

import { useEffect, useState } from "react";

export type UserLocationState =
  | { status: "loading" }
  | { status: "success"; label: string }
  | { status: "error" };

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<string | null> => {
  const url = `${NOMINATIM_URL}?format=json&lat=${latitude}&lon=${longitude}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) return null;

  const data = await response.json();
  const city =
    data.address?.city ?? data.address?.town ?? data.address?.village;
  const country = data.address?.country;

  if (!city || !country) return null;

  return `${city}, ${country}`;
};

export const useUserLocation = (): UserLocationState => {
  const [state, setState] = useState<UserLocationState>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    if (!navigator.geolocation) {
      setState({ status: "error" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        reverseGeocode(position.coords.latitude, position.coords.longitude)
          .then((label) => {
            if (cancelled) return;
            setState(
              label ? { status: "success", label } : { status: "error" },
            );
          })
          .catch(() => {
            if (!cancelled) setState({ status: "error" });
          });
      },
      () => {
        if (!cancelled) setState({ status: "error" });
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};
