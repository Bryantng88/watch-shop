"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { CoordinationDashboardDTO, CoordinationTechnicalIssueBoardItemDTO as Item } from "../server/coordination-dashboard.types";
import { TECHNICAL_LIST_STAGES, technicalIssueListRows, type TechnicalIssueListSort, type TechnicalIssueListStage } from "../shared/technical-issue-list";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";

const PAGE_SIZE = 25;
const money = (value: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);
const date = (value: string | null) => value && Number.isFinite(Date.parse(value)) ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeZone: "Asia/Bangkok" }).format(new Date(value)) : "—";

export default function TechnicalIssueListView({ items, pagination, loadingColumn, focusedIssueId, pending, priorityPendingIssueId, doneRange, onDoneRangeChange, onLoadMore, onPreview, onMove, onTogglePriority, moveOptions, areaLabel, ownerLabel }: {
  items: Item[];
  pagination: NonNullable<CoordinationDashboardDTO["technicalIssueBoard"]>["columnPagination"];
  loadingColumn: string | null;
  focusedIssueId: string | null;
  pending: boolean;
  priorityPendingIssueId: string | null;
  doneRange: "14D" | "30D" | "ALL";
  onDoneRangeChange: (value: "14D" | "30D" | "ALL") => void;
  onLoadMore: (stage: TechnicalIssueListStage, page: number) => void;
  onPreview: (item: Item) => void;
  onMove: (id: string, stage: TechnicalIssueListStage) => void;
  onTogglePriority: (item: Item) => void;
  moveOptions: (item: Item) => { stage: TechnicalIssueListStage; label: string }[];
  areaLabel: (area: string | null) => string;
  ownerLabel: (mode: string | null, vendor: string | null) => string;
}) {
  const [stage, setStage] = useState<TechnicalIssueListStage>("INSPECT");
  const [sort, setSort] = useState<TechnicalIssueListSort>("PRIORITY");
  const [page, setPage] = useState(1);
  const focusedStage = items.find(item => item.id === focusedIssueId)?.stage;
  const focusedPage = focusedStage ? Math.floor(technicalIssueListRows(items, focusedStage, sort).findIndex(item => item.id === focusedIssueId) / PAGE_SIZE) + 1 : 1;
  useEffect(() => {
    if (focusedStage) { setStage(focusedStage); setPage(Math.max(1, focusedPage)); }
  }, [focusedIssueId, focusedStage, focusedPage]);
  const rows = technicalIssueListRows(items, stage, sort);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const displayed = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const serverPage = pagination[stage];
  return <div className="space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-1" aria-label="Stage TI">
        {TECHNICAL_LIST_STAGES.map(column => <button key={column.key} type="button" aria-pressed={stage === column.key}
          onClick={() => { setStage(column.key); setPage(1); }}
          className={`rounded-lg border px-3 py-2 text-xs font-semibold ${stage === column.key ? "border-violet-300 bg-violet-50 text-violet-800" : "border-slate-200 bg-white text-slate-600"}`}>
          {column.label} · {pagination[column.key]?.total ?? items.filter(item => item.stage === column.key).length}
        </button>)}
      </div>
      <div className="flex flex-wrap gap-2">
        {stage === "DONE" && <select aria-label="Lịch sử Done" value={doneRange} onChange={event => { setPage(1); onDoneRangeChange(event.target.value as typeof doneRange); }} className="rounded-lg border p-2 text-xs">
          <option value="14D">14 ngày</option><option value="30D">30 ngày</option><option value="ALL">Tất cả lịch sử</option>
        </select>}
        <select aria-label="Sắp xếp TI đã tải" value={sort} onChange={event => { setSort(event.target.value as TechnicalIssueListSort); setPage(1); }} className="rounded-lg border p-2 text-xs">
          <option value="PRIORITY">Ưu tiên gấp</option><option value="UPDATED">Cập nhật gần nhất</option><option value="DUE">Hạn gần nhất</option>
        </select>
      </div>
    </div>
    <p className="text-xs text-slate-500">{rows.length} TI khớp bộ lọc trong dữ liệu đã tải · {serverPage?.loaded ?? items.filter(item => item.stage === stage).length}/{serverPage?.total ?? rows.length} TI đã tải ở stage này. Sắp xếp áp dụng cho dữ liệu đã tải.</p>
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[1000px] text-left text-xs">
        <caption className="sr-only">Danh sách Technical Issue — {TECHNICAL_LIST_STAGES.find(column => column.key === stage)?.label}</caption>
        <thead className="bg-slate-50 text-slate-500"><tr>{["Ưu tiên", "TI / Watch / SR", "Nhóm kỹ thuật", "Phụ trách", "Thời hạn", "Chi phí", "Cập nhật", "Xử lý"].map(label => <th key={label} scope="col" className="px-3 py-3 font-semibold">{label}</th>)}</tr></thead>
        <tbody className="divide-y divide-slate-100">
          {displayed.map(item => {
            const image = resolveMediaPreviewSrc(item.serviceRequest.imageUrl);
            const options = moveOptions(item);
            return <tr key={item.id} data-technical-issue-id={item.id} className={focusedIssueId === item.id ? "bg-violet-50" : "hover:bg-slate-50"}>
              <td className="px-3 py-3"><button type="button" disabled={priorityPendingIssueId === item.id} aria-pressed={item.priority?.toUpperCase() === "URGENT"} aria-label={`Ưu tiên gấp: ${item.summary}`} onClick={() => onTogglePriority(item)} className="rounded border px-2 py-1 disabled:opacity-50">{item.priority?.toUpperCase() === "URGENT" ? "⚡ Gấp" : "Thường"}</button></td>
              <td className="max-w-sm px-3 py-3"><button type="button" onClick={() => onPreview(item)} className="flex w-full items-center gap-2 text-left hover:text-violet-700">
                {image && <Image src={image} alt="" width={36} height={36} unoptimized className="h-9 w-9 shrink-0 rounded object-cover" />}
                <span className="min-w-0"><span className="block font-semibold">{item.summary}</span><span className="block text-[11px] text-slate-500">{item.serviceRequest.refNo || "Chưa có mã SR"} · {item.serviceRequest.productTitle || item.serviceRequest.sku || "Watch"}</span>
                  {item.commentCount > 0 && <span className="text-[11px] text-violet-600">{item.commentCount} bình luận{item.unreadMentionCount > 0 ? ` · ${item.unreadMentionCount} nhắc bạn chưa đọc` : ""}</span>}
                </span>
              </button></td>
              <td className="px-3 py-3">{areaLabel(item.area)}{item.processingDetails.length > 0 && <div className="mt-1 max-w-48 text-[11px] text-slate-500">{item.processingDetails.join(" · ")}</div>}</td>
              <td className="px-3 py-3">{ownerLabel(item.actionMode, item.vendorName)}</td>
              <td className="whitespace-nowrap px-3 py-3">{date(item.expectedCompletionAt)}{item.overdueDays != null && item.overdueDays > 0 && <div className="text-rose-600">Trễ {item.overdueDays} ngày</div>}</td>
              <td className="whitespace-nowrap px-3 py-3">{item.actualCost != null ? money(item.actualCost) : item.estimatedCost != null ? `Dự kiến ${money(item.estimatedCost)}` : "Chưa có chi phí"}</td>
              <td className="px-3 py-3">{item.lastUpdatedBy.label}<div className="text-[11px] text-slate-400">{date(item.updatedAt)}</div></td>
              <td className="px-3 py-3"><div className="flex flex-col items-start gap-1"><button type="button" onClick={() => onPreview(item)} className="font-semibold text-violet-700">Xem nhanh</button>{options.map(option => <button type="button" key={option.stage} disabled={pending} onClick={() => onMove(item.id, option.stage)} className="whitespace-nowrap rounded border px-2 py-1 disabled:opacity-50">{option.label}</button>)}</div></td>
            </tr>;
          })}
          {!displayed.length && <tr><td colSpan={8} className="p-8 text-center text-slate-500">Không có TI khớp bộ lọc trong dữ liệu đã tải.</td></tr>}
        </tbody>
      </table>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2"><button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="rounded border px-3 py-2 disabled:opacity-40">Trước</button><span>Trang {currentPage}/{pages} · tối đa {PAGE_SIZE} TI/trang</span><button type="button" disabled={currentPage >= pages} onClick={() => setPage(currentPage + 1)} className="rounded border px-3 py-2 disabled:opacity-40">Sau</button></div>
      {serverPage?.hasMore && serverPage.nextPage != null && <button type="button" disabled={loadingColumn === `technical:${stage}`} onClick={() => onLoadMore(stage, serverPage.nextPage!)} className="rounded-lg border bg-white px-3 py-2 font-semibold disabled:opacity-50">{loadingColumn === `technical:${stage}` ? "Đang tải…" : "Tải thêm TI của stage này"}</button>}
    </div>
  </div>;
}
