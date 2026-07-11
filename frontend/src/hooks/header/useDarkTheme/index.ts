"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const useDarkTheme = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return [mounted && resolvedTheme === "dark", setTheme] as const;
};
