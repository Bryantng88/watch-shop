"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import type { StorefrontAnalyticsContext, StorefrontAnalyticsEventName } from "./storefront-analytics.contract";

const CONTEXT_KEY = "vintic.analytics.context.v1";
const SESSION_KEY = "vintic.analytics.session.v1";
const SESSION_MS = 30 * 60 * 1_000;

type StoredSession = { id: string; touchedAt: number };

function uuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
function safeJson<T>(value: string | null): T | null { try { return value ? JSON.parse(value) as T : null; } catch { return null; } }

function sourceFromLocation() {
  const query = new URLSearchParams(location.search);
  const campaign = query.get("utm_campaign") || undefined;
  const medium = query.get("utm_medium") || undefined;
  const explicitSource = query.get("utm_source") || undefined;
  let referrerSource: string | undefined;
  try {
    const host = document.referrer ? new URL(document.referrer).hostname : "";
    if (host && host !== location.hostname) referrerSource = host;
  } catch { /* ignore malformed referrer */ }
  return { source: explicitSource ?? referrerSource ?? "direct", medium: medium ?? (referrerSource ? "referral" : "none"), campaign };
}

export function getStorefrontAnalyticsContext(): StorefrontAnalyticsContext | null {
  if (typeof window === "undefined") return null;
  const now = Date.now();
  const existing = safeJson<StorefrontAnalyticsContext>(localStorage.getItem(CONTEXT_KEY));
  const storedSession = safeJson<StoredSession>(sessionStorage.getItem(SESSION_KEY));
  const session = storedSession && now - storedSession.touchedAt < SESSION_MS ? storedSession : { id: uuid(), touchedAt: now };
  session.touchedAt = now;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  const attribution = existing ?? { anonymousId: uuid(), sessionId: session.id, ...sourceFromLocation(), landingPath: `${location.pathname}${location.search}` };
  const context = { ...attribution, sessionId: session.id };
  localStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
  return context;
}

export function trackStorefrontEvent(eventName: StorefrontAnalyticsEventName, productId?: string) {
  const context = getStorefrontAnalyticsContext();
  if (!context) return;
  const body = JSON.stringify({ events: [{ eventId: uuid(), eventName, occurredAt: new Date().toISOString(), productId, path: `${location.pathname}${location.search}`, referrer: document.referrer || undefined, context }] });
  const blob = new Blob([body], { type: "application/json" });
  if (navigator.sendBeacon?.("/api/analytics/events", blob)) return;
  void fetch("/api/analytics/events", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true }).catch(() => undefined);
}

export function StorefrontAnalyticsRuntime() {
  useEffect(() => {
    const context = getStorefrontAnalyticsContext();
    if (!context) return;
    const marker = `vintic.analytics.started.${context.sessionId}`;
    if (!sessionStorage.getItem(marker)) { sessionStorage.setItem(marker, "1"); trackStorefrontEvent("session_started"); }
  }, []);
  return null;
}

export function StorefrontAnalyticsSignal({ eventName, productId }: { eventName: StorefrontAnalyticsEventName; productId?: string }) {
  const pathname = usePathname();
  useEffect(() => { trackStorefrontEvent(eventName, productId); }, [eventName, pathname, productId]);
  return null;
}
