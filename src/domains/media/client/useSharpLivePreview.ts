"use client";

import { useEffect, useRef, useState } from "react";

export function useSharpLivePreview(input: {
  enabled: boolean;
  url?: string | null;
  body: unknown;
  delay?: number;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectUrl = useRef<string | null>(null);
  const bodyJson = JSON.stringify(input.body);

  useEffect(() => {
    if (!input.enabled || !input.url) {
      setPending(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setPending(true);
      setError(null);
      try {
        const response = await fetch(input.url!, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: bodyJson,
          signal: controller.signal,
        });
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.error || "Không thể tạo preview Sharp.");
        }
        const next = URL.createObjectURL(await response.blob());
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = next;
        setSrc(next);
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Không thể tạo preview Sharp.");
      } finally {
        if (!controller.signal.aborted) setPending(false);
      }
    }, input.delay ?? 500);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [bodyJson, input.delay, input.enabled, input.url]);

  useEffect(() => () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);

  return { src, pending, error };
}
