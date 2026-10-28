"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { OperationsDashboardStage } from "../shared";
import { ProgressMetric } from "@/domains/shared/ui/admin-design-contract";

export function QueueStageNavigator({ stages }: { stages: OperationsDashboardStage[] }) {
  const total = stages.reduce((sum, stage) => sum + stage.count, 0);
  const initialIndex = stages.reduce((bestIndex, stage, index) => (
    stage.count > (stages[bestIndex]?.count ?? -1) ? index : bestIndex
  ), 0);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeStage = stages[activeIndex];

  if (!activeStage || total === 0) {
    return <span className="mx-auto flex min-h-10 w-[312px] max-w-full items-center justify-center gap-2 text-center text-xs font-medium text-slate-500"><span className="h-2 w-2 rounded-full bg-slate-300" />Chưa phát sinh công việc</span>;
  }

  const share = Math.round((activeStage.count / total) * 100);
  const previousStage = stages[activeIndex - 1];
  const nextStage = stages[activeIndex + 1];

  return (
    <div className="mx-auto grid w-[312px] max-w-full grid-cols-[28px_minmax(0,240px)_28px] items-center gap-2">
      <button
        type="button"
        disabled={!previousStage}
        aria-label={previousStage ? `Xem stage trước: ${previousStage.label}` : "Đang ở stage đầu tiên"}
        title={previousStage ? `Stage trước: ${previousStage.label}` : "Đang ở stage đầu tiên"}
        onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:-translate-x-0.5 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-default disabled:bg-transparent disabled:text-slate-200 disabled:hover:translate-x-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <Link href={activeStage.href} className="block min-w-0 py-1 transition hover:opacity-75 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
        <ProgressMetric
          value={share}
          numerator={activeStage.count}
          denominator={total}
          caption={activeStage.label}
          semantic="ratio"
          label={`${activeStage.label}: ${activeStage.count}/${total} việc, chiếm ${share}%`}
        />
      </Link>

      <button
        type="button"
        disabled={!nextStage}
        aria-label={nextStage ? `Xem stage sau: ${nextStage.label}` : "Đang ở stage cuối cùng"}
        title={nextStage ? `Stage sau: ${nextStage.label}` : "Đang ở stage cuối cùng"}
        onClick={() => setActiveIndex((index) => Math.min(stages.length - 1, index + 1))}
        className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:translate-x-0.5 hover:bg-slate-100 hover:text-slate-900 disabled:cursor-default disabled:bg-transparent disabled:text-slate-200 disabled:hover:translate-x-0"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
