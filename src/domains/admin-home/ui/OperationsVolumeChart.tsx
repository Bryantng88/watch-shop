"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminViewTabs, ADMIN_DOMAIN_TONE } from "@/domains/shared/ui/admin-design-contract";
import { operationalDomainPresentation } from "@/domains/shared/ui/signals";
import type { OperationsDashboardQueue } from "../shared";
import { executionCounts } from "../shared/execution-summary";
import styles from "./OperationsDashboard.module.css";

type View = "all" | "waiting" | "inProgress";
const views = [{ value: "all", label: "Tất cả" }, { value: "waiting", label: "Chờ xử lý" }, { value: "inProgress", label: "Đang xử lý" }] as const;
const titles: Record<View, string> = { all: "Khối lượng đang mở", waiting: "Khối lượng chờ xử lý", inProgress: "Khối lượng đang xử lý" };
const tones = { orders: ADMIN_DOMAIN_TONE.ORDER, "purchase-requests": ADMIN_DOMAIN_TONE.ACQUISITION, media: ADMIN_DOMAIN_TONE.MEDIA, technical: ADMIN_DOMAIN_TONE.TECHNICAL, payments: ADMIN_DOMAIN_TONE.SALES, "personal-work": ADMIN_DOMAIN_TONE.GENERAL };
const format = (value: number) => value.toLocaleString("vi-VN");

export function OperationsVolumeChart({ queues }: { queues: OperationsDashboardQueue[] }) {
  const [view, setView] = useState<View>("all");
  // Retain row order and axis when switching views, so lengths stay comparable.
  const sorted = [...queues].sort((a, b) => b.activeCount - a.activeCount);
  const max = Math.max(1, ...queues.map(queue => queue.activeCount));
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 5, 10].map(value => value * magnitude / 2).find(value => value * 3 >= max) ?? magnitude * 5;
  const axis = Math.max(1, Math.ceil(step)) * 3;
  const unknown = queues.reduce((sum, queue) => sum + (queue.execution ?? executionCounts(queue.activeCount)).unknown, 0);
  return <section aria-labelledby="operations-volume-title" className="min-w-0">
    <h2 id="operations-volume-title" className="text-sm font-bold text-slate-950" aria-live="polite">{titles[view]}</h2>
    <p className="mt-1 text-xs text-slate-500">Đơn vị: việc</p>
    <AdminViewTabs label="Trạng thái biểu đồ" items={views} value={view} onValueChange={setView} className="mt-3" />
    {sorted.length === 0 ? <p className="py-6 text-xs text-slate-500">Chưa có dữ liệu khối lượng.</p> : <div className={styles.volumeChart} data-volume-chart>
      <div className={styles.volumeGrid} aria-hidden="true">{[0, 1, 2, 3].map(tick => <span key={tick} style={{ left: `${tick / 3 * 100}%` }} />)}</div>
      {sorted.map(queue => {
        const counts = queue.execution ?? executionCounts(queue.activeCount);
        const unavailable = view !== "all" && counts.unknown > 0 && counts.unknown === queue.activeCount;
        const value = view === "all" ? queue.activeCount : counts[view];
        const partial = view !== "all" && counts.unknown > 0;
        const label = operationalDomainPresentation(queue.key).label;
        return <div key={queue.key} className={styles.volumeRow}>
          <Link className="min-w-0 rounded text-xs text-slate-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" href={queue.href}>{label}</Link>
          <div className={styles.volumePlot} aria-label={`${label}: ${unavailable ? "Chưa có trạng thái thực hiện" : `${format(value)} việc${partial ? ` đã xác định; ${format(counts.unknown)} chưa phân loại` : ""}`}`}>
            {!unavailable && <span className={`${styles.volumeBar} ${tones[queue.key].dot}`} style={{ width: `${value / axis * 100}%` }} />}
            <span className={styles.volumeValue} style={{ left: unavailable ? "0%" : `calc(${value / axis * 100}% + 6px)` }} title={unavailable ? "Chưa có trạng thái thực hiện" : partial ? `${format(counts.unknown)} mục chưa phân loại` : undefined}>{unavailable ? "—" : `${format(value)}${partial ? "+" : ""}`}</span>
          </div>
        </div>;
      })}
      <div className={styles.volumeAxis} aria-label="Trục số việc">{[0, 1, 2, 3].map(tick => <span key={tick} style={{ left: `${tick / 3 * 100}%` }}>{format(tick * axis / 3)}</span>)}</div>
    </div>}
    {view !== "all" && unknown > 0 && <p role="status" className="mt-3 text-xs leading-5 text-slate-500">{format(unknown)} mục chưa xác định trạng thái, chỉ tính trong Tất cả. “—” chưa có dữ liệu; “+” là số đã xác định.</p>}
  </section>;
}
