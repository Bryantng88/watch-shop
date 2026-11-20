import { AdminLinkAction } from "@/domains/shared/ui/admin-design-contract/AdminButton";

import type { OperationsDashboardStage } from "../shared";

export function QueueStageSummary({ stages }: { stages: OperationsDashboardStage[] }) {
  const visible = stages.filter(stage => stage.count > 0);
  if (!visible.length) return <p className="text-xs text-slate-500">Không có việc chờ</p>;
  return <ul aria-label="Số việc theo giai đoạn" className="flex flex-wrap items-baseline gap-x-3 text-xs text-slate-500">
    {visible.map(stage => <li key={stage.key}>
      <AdminLinkAction variant="secondary" density="compact" href={stage.href} aria-label={`${stage.label}: ${stage.count} việc cần xử lý`} className="inline-block min-h-8 rounded py-1 leading-6 hover:text-slate-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{stage.label} <span className="tabular-nums">{stage.count.toLocaleString("vi-VN")}</span></AdminLinkAction>
    </li>)}
  </ul>;
}
