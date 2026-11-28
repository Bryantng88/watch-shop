"use client";
import type { ReactNode } from "react";
import { AdminButton } from "../admin-design-contract/AdminButton";
export const WATCH_QUICK_PREVIEW_EVENT = "admin:watch-quick-preview";
export type WatchQuickPreviewSeed = {
  productId: string;
  label: string;
  imageUrl?: string | null;
};
export function WatchQuickPreviewTrigger({
  watch,
  children,
  className,
}: {
  watch: WatchQuickPreviewSeed;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AdminButton
      variant="contextual"
      type="button"
      className={className}
      aria-label={`Xem nhanh ${watch.label}`}
      title={`Xem nhanh ${watch.label}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") event.stopPropagation();
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        window.dispatchEvent(
          new CustomEvent(WATCH_QUICK_PREVIEW_EVENT, { detail: watch }),
        );
      }}
    >
      {children}
    </AdminButton>
  );
}
