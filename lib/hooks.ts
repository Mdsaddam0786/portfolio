"use client";

import { useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

export function useMediaQuery(query: string, serverFallback = false) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useHasFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
