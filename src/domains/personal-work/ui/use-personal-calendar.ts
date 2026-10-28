"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  PersonalCalendarEvent,
  PersonalWorkItem,
  PersonalWorkPageData,
} from "../shared/personal-work.types";

type CalendarResponse = {
  events: PersonalCalendarEvent[] | null;
  items: PersonalWorkItem[];
  lastSyncedAt: string | null;
  loadError: string | null;
};

export function usePersonalCalendar(data: PersonalWorkPageData) {
  const latest = useRef(data);
  latest.current = data;
  const request = useRef<AbortController | null>(null);
  const lastAttempt = useRef(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<{
    userId: string;
    source: PersonalWorkItem[];
    items: PersonalWorkItem[];
  } | null>(null);
  const [eventSnapshot, setEventSnapshot] = useState({
    userId: data.currentUserId,
    events: data.calendar.events,
  });
  const [lastSyncedAt, setLastSyncedAt] = useState(data.calendar.lastSyncedAt);
  const reload = useCallback(async () => {
    if (!latest.current.calendar.connected || request.current) return;
    const source = latest.current;
    const controller = new AbortController();
    request.current = controller;
    lastAttempt.current = Date.now();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/personal-work/calendar", {
        method: "POST",
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok)
        throw new Error("Không thể tải lại lịch. Vui lòng thử lại.");
      const result: CalendarResponse = await response.json();
      if (
        controller.signal.aborted ||
        source.currentUserId !== latest.current.currentUserId
      )
        return;
      if (result.events !== null)
        setEventSnapshot({
          userId: source.currentUserId,
          events: result.events,
        });
      setSnapshot({
        userId: source.currentUserId,
        source: source.items,
        items: result.items,
      });
      setLastSyncedAt(result.lastSyncedAt);
      setError(result.loadError);
    } catch (e) {
      if (!controller.signal.aborted)
        setError(e instanceof Error ? e.message : "Không thể tải lại lịch");
    } finally {
      if (request.current === controller) {
        request.current = null;
        setLoading(false);
      }
    }
  }, []);
  useEffect(() => {
    if (!data.calendar.connected) return;
    void reload();
    const refresh = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastAttempt.current >= 5000
      )
        void reload();
    };
    const interval = window.setInterval(refresh, 120000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      request.current?.abort();
      request.current = null;
    };
  }, [data.calendar.connected, data.currentUserId, reload]);
  return {
    // A route refresh after a mutation is newer than an in-flight calendar read.
    // Never replace that authoritative task snapshot with a late response.
    items:
      snapshot?.userId === data.currentUserId && snapshot.source === data.items
        ? snapshot.items
        : data.items,
    events:
      eventSnapshot.userId === data.currentUserId ? eventSnapshot.events : [],
    loading: data.calendar.connected && loading,
    error,
    reload,
    lastSyncedAt,
  };
}
