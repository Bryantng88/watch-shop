"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TaskPriority, WorkCaseScope, WorkCaseStatus, type WorkCaseCategory } from "@prisma/client";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import type { WorkCaseWithRelations } from "../server/work-case.repo";
import type { WorkCaseViewKey } from "../server/work-case.types";
import { WORK_CASE_PRIORITY_LABEL, WORK_CASE_SCOPE_LABEL, WORK_CASE_STATUS_LABEL } from "../utils/work-case-labels";
import WorkCaseListTable from "../ui/WorkCaseListTable";

type Props = {
  items: WorkCaseWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: Record<string, number>;
  categories: WorkCaseCategory[];
  currentUserId: string;
  canManage?: boolean;
  rawSearchParams?: Record<string, string | string[] | undefined>;
};

function firstRaw(value: string | string[] | undefined, fallback = "") {
  return Array.isArray(value) ? String(value[0] ?? fallback) : String(value ?? fallback);
}

function buildHref(pathname: string, current: URLSearchParams, patch: Record<string, string | null | undefined>) {
  const next = new URLSearchParams(current.toString());
  Object.entries(patch).forEach(([key, value]) => {
    if (!value) next.delete(key);
    else next.set(key, value);
  });
  const query = next.toString();
  return query ? `${pathname}?${query}` : pathname;
}

const VIEWS: { key: WorkCaseViewKey; label: string }[] = [
  { key: "mine", label: "Liên quan tới tôi" },
  { key: "raised", label: "Tôi raise" },
  { key: "assigned", label: "Tôi phụ trách" },
  { key: "all", label: "Tất cả" },
];

export default function WorkCaseListClient(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const progress = useAppProgress();
  const [q, setQ] = useState(firstRaw(props.rawSearchParams?.q));
  const [scope, setScope] = useState(firstRaw(props.rawSearchParams?.scope, "ALL"));
  const [status, setStatus] = useState(firstRaw(props.rawSearchParams?.status, "OPEN"));
  const [priority, setPriority] = useState(firstRaw(props.rawSearchParams?.priority, "ALL"));

  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setScope(sp.get("scope") || "ALL");
    setStatus(sp.get("status") || "OPEN");
    setPriority(sp.get("priority") || "ALL");
  }, [sp]);

  function navigate(patch: Record<string, string | null | undefined>) {
    progress.show({ title: "Đang tải phiếu xử lý", message: "Hệ thống đang cập nhật danh sách." });
    router.push(buildHref(pathname, sp, patch));
    window.setTimeout(() => progress.hide(), 700);
  }

  function openDetail(item: WorkCaseWithRelations) {
    progress.show({ title: "Đang mở phiếu xử lý", message: item.refNo || item.title });
    router.push(`/admin/work-cases/${item.id}`);
    window.setTimeout(() => progress.hide(), 700);
  }

  function applyFilters() {
    navigate({
      q: q.trim() || null,
      scope: scope === "ALL" ? null : scope,
      status: status === "OPEN" ? null : status,
      priority: priority === "ALL" ? null : priority,
      page: "1",
    });
  }

  const view = (sp.get("view") || firstRaw(props.rawSearchParams?.view, "mine")) as WorkCaseViewKey;

  return (
    <div className="mx-auto w-full max-w-[1360px] min-w-0 space-y-5 px-4 py-6 lg:px-5 xl:px-6">
      <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Phiếu xử lý</h1>
          <p className="mt-1 text-sm text-slate-500">Theo dõi vấn đề được raise và điều phối thành task/service khi cần.</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-600">Tổng: <span className="font-semibold text-slate-950">{props.total}</span></div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {VIEWS.filter((v) => props.canManage || v.key !== "all").map((item) => {
            const active = view === item.key || (!sp.get("view") && item.key === "mine");
            return (
              <button key={item.key} type="button" onClick={() => navigate({ view: item.key === "mine" ? null : item.key, page: "1" })} className={`rounded-2xl px-3 py-2 text-sm font-semibold ${active ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
                {item.label} <span className="ml-1 opacity-70">{props.counts[item.key] ?? 0}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_160px_160px_160px_auto]">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo ref, tiêu đề, watch, SKU..." className="h-11 rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" />
          <select value={scope} onChange={(e) => setScope(e.target.value)} className="h-11 rounded-2xl border border-slate-200 px-3 text-sm">
            <option value="ALL">Tất cả scope</option>
            {Object.values(WorkCaseScope).map((item) => <option key={item} value={item}>{WORK_CASE_SCOPE_LABEL[item]}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-2xl border border-slate-200 px-3 text-sm">
            <option value="OPEN">Đang mở</option>
            <option value="ALL">Tất cả trạng thái</option>
            {Object.values(WorkCaseStatus).map((item) => <option key={item} value={item}>{WORK_CASE_STATUS_LABEL[item]}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="h-11 rounded-2xl border border-slate-200 px-3 text-sm">
            <option value="ALL">Tất cả priority</option>
            {Object.values(TaskPriority).map((item) => <option key={item} value={item}>{WORK_CASE_PRIORITY_LABEL[item]}</option>)}
          </select>
          <button type="button" onClick={applyFilters} className="h-11 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white">Lọc</button>
        </div>
      </div>

      <WorkCaseListTable items={props.items} page={props.page} totalPages={props.totalPages} onPage={(page) => navigate({ page: String(page) })} onOpen={openDetail} />
    </div>
  );
}
