"use client";

import { useLinkStatus } from "next/link";

export function BenNavigationPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;

  return (
    <span role="status" className="inline-flex shrink-0 items-center">
      <span aria-hidden="true" className="h-3 w-3 animate-spin rounded-full border border-current border-r-transparent motion-reduce:animate-none" />
      <span className="sr-only">Đang mở màn hình…</span>
    </span>
  );
}
