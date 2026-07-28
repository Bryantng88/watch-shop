import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PostTargetChip({
  children,
  className,
  trailing,
  ...props
}: ComponentPropsWithoutRef<"span"> & {
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-36 items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {trailing}
    </span>
  );
}
