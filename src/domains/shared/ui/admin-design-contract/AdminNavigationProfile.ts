"use client";

import { useCallback, useSyncExternalStore } from "react";

export type NavigationProfile = "simple" | "dark";
const changed = "admin-navigation-profile-changed";
const sessionChoices = new Map<string, NavigationProfile>();
const normalize = (value: string | null): NavigationProfile => value === "dark" ? "dark" : "simple";

/** Browser preference only; never changes account permissions or server configuration. */
export function useAdminNavigationProfile(userId?: string) {
  const key = `admin:navigation-profile:v1:${userId ?? "anonymous"}`;
  const snapshot = useCallback((): NavigationProfile => {
    if (sessionChoices.has(key)) return sessionChoices.get(key)!;
    try { return normalize(localStorage.getItem(key)); } catch { return "simple"; }
  }, [key]);
  const subscribe = useCallback((notify: () => void) => {
    const onStorage = (event: StorageEvent) => { if (event.key === key || event.key === null) { sessionChoices.delete(key); notify(); } };
    window.addEventListener(changed, notify);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener(changed, notify); window.removeEventListener("storage", onStorage); };
  }, [key]);
  const profile = useSyncExternalStore(subscribe, snapshot, () => "simple" as const);
  const setProfile = (value: NavigationProfile) => {
    const next = normalize(value);
    try { localStorage.setItem(key, next); sessionChoices.delete(key); }
    catch { sessionChoices.set(key, next); }
    window.dispatchEvent(new Event(changed));
  };
  return { profile, setProfile };
}
