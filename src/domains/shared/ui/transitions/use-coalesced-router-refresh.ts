"use client";

import { useCallback, useEffect, useRef } from "react";

export function useCoalescedRouterRefresh(
  router: { refresh: () => void },
  delayMs = 350,
) {
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  return useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      router.refresh();
    }, delayMs);
  }, [delayMs, router]);
}
