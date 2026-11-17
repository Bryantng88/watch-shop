import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { concentratedStages } from "../application/stage-insights";
import type { OperationsDashboardQueue } from "../shared";
import { operationalDomainPresentation } from "@/domains/shared/ui/signals";

export function StageConcentrationInsights({ queues }: { queues: OperationsDashboardQueue[] }) {
  const hotspots = queues.flatMap(queue => concentratedStages(queue).map(stage => ({ queue, stage })));
  if (hotspots.length === 0) return null;

  return (
    <details className="border-t border-slate-100 pt-4">
      <summary className="w-fit cursor-pointer rounded-md py-2 text-sm font-semibold text-slate-600 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Điểm tập trung <span className="ml-1 font-normal tabular-nums text-slate-500">{hotspots.length} giai đoạn</span></summary>
      <p className="my-2 text-xs text-slate-500">Từ 3 việc và chiếm ≥ 60% việc mở trong khu vực</p>
      <div className="grid gap-4 xl:grid-cols-2">
        {hotspots.map(({ queue, stage }) => (
          <article key={`${queue.key}:${stage.key}`} className="border-t border-slate-100 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">{operationalDomainPresentation(queue.key).label}</p>
                <Link href={stage.href} className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 hover:text-amber-800">
                  {stage.label}<ArrowUpRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                </Link>
                <p className="mt-1 text-xs text-slate-500"><strong className="font-semibold text-slate-900">{stage.count}</strong> / {queue.activeCount} việc mở đang ở giai đoạn này</p>
              </div>
              <span className="shrink-0 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold tabular-nums text-amber-800">Tập trung {Math.round(stage.count / queue.activeCount * 100)}%</span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
              {stage.metrics?.map(metric => (
                <div key={metric.label} title={metric.detail}>
                  <dt className="text-xs leading-4 text-slate-500">{metric.label}</dt>
                  <dd aria-label={`${metric.value}. ${metric.detail}`} className="mt-1 text-base font-semibold tabular-nums text-slate-900">{metric.value}</dd>
                </div>
              ))}
            </dl>
            <details className="mt-4 text-xs text-slate-500">
              <summary className="w-fit cursor-pointer hover:text-slate-800">Cách tính chỉ số</summary>
              <ul className="mt-2 space-y-2 leading-5">
                {stage.metrics?.map(metric => <li key={metric.label}><strong className="font-medium text-slate-700">{metric.label}:</strong> {metric.detail}</li>)}
                <li>Tỷ trọng cao thể hiện khối lượng tập trung; cần kết hợp thời gian chờ và ngoại lệ để đánh giá điểm nghẽn.</li>
                {!stage.metrics?.some(metric => metric.label.startsWith("TG xử lý")) && <li>Chưa có lịch sử workflow để tính thời gian xử lý và tỷ lệ hoàn tất của giai đoạn này.</li>}
              </ul>
            </details>
          </article>
        ))}
      </div>
    </details>
  );
}
