import Link from "next/link";

import type { OperationsDashboardStage } from "../shared";
import { cn } from "@/lib/utils";
import { concentratedStages } from "../application/stage-insights";

export function QueueStageSummary({ stages, activeCount }: { stages: OperationsDashboardStage[]; activeCount: number }) {
  const largestCount = Math.max(0, ...stages.map((stage) => stage.count));
  const focusedStages = concentratedStages({ stages, activeCount });
  const concentrated = new Set(focusedStages.map(stage => stage.key));

  if (stages.length === 0) {
    return <span className="text-xs text-slate-500">Không có giai đoạn</span>;
  }

  return (
    <ul aria-label="Số việc chờ theo giai đoạn" className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-xs leading-5">
      {stages.map((stage, index) => {
        const isLargest = stage.count > 0 && stage.count === largestCount;
        return (
          <li key={stage.key} className="inline-flex items-baseline gap-3">
            {index > 0 && <span aria-hidden="true" className="text-slate-300">·</span>}
            <Link
              href={stage.href}
              aria-label={`${stage.label}: ${stage.count} việc cần xử lý`}
              className={cn("inline-flex items-baseline gap-1.5 whitespace-nowrap rounded-md transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400", concentrated.has(stage.key) && "bg-amber-50 px-2 py-0.5 ring-1 ring-inset ring-amber-200/70")}
            >
              <span className={cn(isLargest ? "font-medium text-slate-900" : stage.count > 0 ? "text-slate-600" : "text-slate-400")}>{stage.label}</span>
              <strong className={cn("text-sm tabular-nums", isLargest ? "font-bold text-amber-700" : stage.count > 0 ? "font-semibold text-slate-800" : "font-medium text-slate-400")}>{stage.count}</strong>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
