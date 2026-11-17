import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { concentratedStages } from "../application/stage-insights";
import type { OperationsDashboardQueue, OperationsDashboardStage } from "../shared";
import { operationalDomainPresentation } from "@/domains/shared/ui/signals";

function Hotspot({ queue, stage }: { queue: OperationsDashboardQueue; stage: OperationsDashboardStage }) {
  return <details className="border-b border-slate-100 py-3 last:border-b-0">
    <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
      <span><span className="block text-xs font-semibold text-slate-900">{operationalDomainPresentation(queue.key).label}</span><span className="mt-1 block text-xs text-slate-500">{stage.label} · {stage.count.toLocaleString("vi-VN")}/{queue.activeCount.toLocaleString("vi-VN")} việc</span></span>
      <span className="shrink-0 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-blue-700">{Math.round(stage.count / queue.activeCount * 100)}%</span>
    </summary>
    <dl className="mt-3 space-y-3">{stage.metrics?.map(metric => <div key={metric.label}><dt className="text-xs text-slate-500">{metric.label}</dt><dd className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">{metric.value}<p className="mt-1 text-xs font-normal leading-5 text-slate-500">{metric.detail}</p></dd></div>)}</dl>
    <Link href={stage.href} className="mt-3 inline-flex min-h-8 items-center gap-1 rounded text-xs font-semibold text-slate-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Mở giai đoạn<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
  </details>;
}
export function StageConcentrationInsights({ queues }: { queues: OperationsDashboardQueue[] }) {
  const hotspots = queues.flatMap(queue => concentratedStages(queue).map(stage => ({ queue, stage })));
  return <section className="border-t border-slate-100 pt-5" aria-labelledby="stage-concentration-title">
    <h2 id="stage-concentration-title" className="text-sm font-bold text-slate-950">Điểm tập trung</h2>
    <p className="mt-1 text-xs text-slate-500">Giai đoạn có ≥ 3 việc và chiếm ≥ 60% việc mở.</p>
    {hotspots.length ? <>
      {hotspots.slice(0, 3).map(({ queue, stage }) => <Hotspot key={`${queue.key}:${stage.key}`} queue={queue} stage={stage} />)}
      {hotspots.length > 3 && <details><summary className="cursor-pointer rounded py-2 text-xs text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{hotspots.length - 3} giai đoạn khác</summary>{hotspots.slice(3).map(({ queue, stage }) => <Hotspot key={`${queue.key}:${stage.key}`} queue={queue} stage={stage} />)}</details>}
    </> : <p className="py-4 text-xs text-slate-500">Chưa có giai đoạn tập trung nhiều việc.</p>}
  </section>;
}
