"use client";
import { useEffect, useState } from "react";
import type { DailyMediaWorkSummary } from "@/domains/personal-work/shared/media-daily";
import { mediaDailyStateAction } from "./media-daily.actions";
import { MEDIA_DAILY_CHANGED } from "./media-daily-state";
export function useMediaDailyState(
  states: (DailyMediaWorkSummary | null | undefined)[],
) {
  const [overrides, setOverrides] = useState<
    Record<string, DailyMediaWorkSummary>
  >({});
  const signature = [
    ...new Set(states.filter(Boolean).map((state) => state!.productId)),
  ]
    .sort()
    .join("|");
  const snapshot = states
    .map((state) =>
      state ? `${state.productId}:${state.count}:${state.taskItemId}` : "",
    )
    .join("|");
  useEffect(() => setOverrides({}), [snapshot]);
  useEffect(() => {
    let active = true,
      inFlight = false;
    const ids = signature ? signature.split("|") : [];
    async function refresh(event?: Event) {
      const changed = (event as CustomEvent<{ productId?: string }> | undefined)
        ?.detail?.productId;
      if (
        !ids.length ||
        (changed && !ids.includes(changed)) ||
        inFlight ||
        document.visibilityState === "hidden"
      )
        return;
      inFlight = true;
      try {
        const values = await mediaDailyStateAction(changed ? [changed] : ids);
        if (active)
          setOverrides((old) => ({
            ...old,
            ...Object.fromEntries(
              values.map((value) => [value.productId, value]),
            ),
          }));
      } catch {
        /* Keep last confirmed state; never imply a failed refresh means no work. */
      } finally {
        inFlight = false;
      }
    }
    const visible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    window.addEventListener(MEDIA_DAILY_CHANGED, refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", visible);
    return () => {
      active = false;
      window.removeEventListener(MEDIA_DAILY_CHANGED, refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [signature]);
  return (state: DailyMediaWorkSummary | null | undefined) =>
    state ? (overrides[state.productId] ?? state) : state;
}
