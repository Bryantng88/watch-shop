"use client";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import {
  WATCH_QUICK_PREVIEW_EVENT,
  type WatchQuickPreviewSeed,
} from "./WatchQuickPreviewTrigger";
const Host = lazy(() => import("./WatchQuickPreviewHost"));
export function WatchQuickPreviewProvider({
  children,
  allowed = true,
}: {
  children: ReactNode;
  allowed?: boolean;
}) {
  const notify = useNotify();
  const [seed, setSeed] = useState<WatchQuickPreviewSeed | null>(null);
  useEffect(() => {
    const open = (event: Event) => {
      const value = (event as CustomEvent<WatchQuickPreviewSeed>).detail;
      if (!allowed) {
        notify.warning({
          message: "Bạn chưa có quyền xem nhanh đồng hồ.",
          density: "compact",
        });
        return;
      }
      if (
        value &&
        typeof value.productId === "string" &&
        value.productId.length <= 160 &&
        typeof value.label === "string"
      )
        setSeed(value);
    };
    window.addEventListener(WATCH_QUICK_PREVIEW_EVENT, open);
    return () => window.removeEventListener(WATCH_QUICK_PREVIEW_EVENT, open);
  }, [allowed, notify]);
  return (
    <>
      {children}
      {seed && (
        <Suspense
          fallback={
            <p
              role="status"
              className="fixed bottom-4 right-4 z-[90] rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              Đang mở xem nhanh…
            </p>
          }
        >
          <Host
            key={seed.productId}
            seed={seed}
            onClose={() => setSeed(null)}
          />
        </Suspense>
      )}
    </>
  );
}
