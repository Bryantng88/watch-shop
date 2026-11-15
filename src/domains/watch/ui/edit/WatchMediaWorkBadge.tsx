import { ClipboardList } from "lucide-react";
import type { DailyMediaWorkSummary } from "@/domains/personal-work/shared/media-daily";
export function WatchMediaWorkBadge({
  state,
}: {
  state?: DailyMediaWorkSummary | null;
}) {
  if (!state?.count) return null;
  return (
    <span
      title={`Có ${state.count} đầu việc media đang mở`}
      aria-label={`Có ${state.count} đầu việc media đang mở`}
      className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-violet-700"
    >
      <ClipboardList aria-hidden="true" className="h-3 w-3" />
      {state.count} việc media
    </span>
  );
}
