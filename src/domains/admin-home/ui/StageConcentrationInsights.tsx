import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { concentratedStages } from "../application/stage-insights";
import type { OperationsDashboardQueue } from "../shared";
import { operationalDomainPresentation } from "@/domains/shared/ui/signals";

export function StageConcentrationInsights({ queues }: { queues: OperationsDashboardQueue[] }) {
  const hotspots = queues.flatMap(queue => concentratedStages(queue).map(stage => ({ queue, stage })));
  if (hotspots.length === 0) return null;

  return (
    <section className="mt-5" aria-labelledby="stage-concentration-title">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="stage-concentration-title" className="text-sm font-semibold text-slate-950">Giai đoạn đang tập trung nhiều việc</h2>
        <p className="text-[11px] text-slate-500">Từ 3 việc và chiếm ≥ 60% việc mở trong khu vực</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {hotspots.map(({ queue, stage }) => (
          <article key={`${queue.key}:${stage.key}`} className="rounded-xl border border-slate-200 bg-white px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-500">{operationalDomainPresentation(queue.key).label}</p>
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
                  <dt className="text-[11px] leading-4 text-slate-500">{metric.label}</dt>
                  <dd aria-label={`${metric.value}. ${metric.detail}`} className="mt-1 text-base font-semibold tabular-nums text-slate-900">{metric.value}</dd>
                </div>
              ))}
            </dl>
            <details className="mt-4 text-[11px] text-slate-500">
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
    </section>
  );
}
