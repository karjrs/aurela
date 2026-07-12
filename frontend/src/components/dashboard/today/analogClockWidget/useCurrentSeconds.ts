"use client";

import { useEffect, useState } from "react";

export const useCurrentSeconds = () => {
  const [seconds, setSeconds] = useState(() => new Date().getSeconds());

  useEffect(() => {
    const id = setInterval(() => setSeconds(new Date().getSeconds()), 1000);
    return () => clearInterval(id);
  }, []);

  return seconds;
};
