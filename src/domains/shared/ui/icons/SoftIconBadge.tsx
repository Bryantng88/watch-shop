import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SoftIconBadgeProps = {
  icon: LucideIcon;
  size?: "sm" | "md";
  className?: string;
};

/**
 * Shared low-emphasis icon treatment for section, stage and column labels.
 * Violet is intentionally the default visual language across admin surfaces.
 */
export function SoftIconBadge({
  icon: Icon,
  size = "sm",
  className,
}: SoftIconBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center border border-violet-100 bg-violet-50 text-violet-600",
        size === "sm"
          ? "h-7 w-7 rounded-md shadow-[0_1px_3px_rgba(124,58,237,0.08)]"
          : "h-8 w-8 rounded-lg shadow-[0_2px_5px_rgba(124,58,237,0.1)]",
        className,
      )}
    >
      <Icon
        className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}
        strokeWidth={1.8}
      />
    </span>
  );
}
