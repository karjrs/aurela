"use client";

import { useEffect, useState } from "react";

const TICK_INTERVAL_MS = 30000;

export const useNow = () => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return now;
};
