"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
} from "lucide-react";
import {
  TaskPriority,
  WorkCaseStatus,
  type WorkCaseCategory,
} from "@prisma/client";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import type { WorkCaseWithRelations } from "../server/work-case.repo";
import type { WorkCaseViewKey } from "../server/work-case.types";
import {
  WORK_CASE_PRIORITY_LABEL,
  WORK_CASE_STATUS_LABEL,
} from "../utils/work-case-labels";
import WorkCaseListTable, {
  type WorkCaseTaskUserOption,
} from "../ui/WorkCaseListTable";
import RaiseWorkCaseModal from "../ui/RaiseWorkCaseModal";
import { getTaskQuickCreateDataAction } from "@/domains/task/actions/task.actions";
import {
  ListFilterForm,
  ListSearchInput,
  ListSelect,
  ListFilterButton,
  ListClearButton,
} from "@/domains/shared/ui/list/ListFilters";

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

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [users, setUsers] = useState<WorkCaseTaskUserOption[]>([]);
  const [q, setQ] = useState(firstRaw(props.rawSearchParams?.q));
  const [status, setStatus] = useState(firstRaw(props.rawSearchParams?.status, "OPEN"));
  const [priority, setPriority] = useState(firstRaw(props.rawSearchParams?.priority, "ALL"));
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    getTaskQuickCreateDataAction()
      .then((data) => {
        if (!alive) return;
        setUsers(data.users ?? []);
      })
      .catch(() => {
        if (!alive) return;
        setUsers([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setStatus(sp.get("status") || "OPEN");
    setPriority(sp.get("priority") || "ALL");
  }, [sp]);

  function navigate(patch: Record<string, string | null | undefined>) {
    progress.show({ title: "Đang tải phiếu xử lý", message: "Hệ thống đang cập nhật danh sách." });
    router.push(buildHref(pathname, sp, patch));
    window.setTimeout(() => progress.hide(), 700);
  }

  function toggleExpand(item: WorkCaseWithRelations) {
    setExpandedId((current) => (current === item.id ? null : item.id));
  }

  function openDetail(item: WorkCaseWithRelations) {
    progress.show({ title: "Đang mở phiếu xử lý", message: item.refNo || item.title });
    router.push(`/admin/work-cases/${item.id}`);
    window.setTimeout(() => progress.hide(), 700);
  }

  function applyFilters() {
    navigate({
      q: q.trim() || null,
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
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi vấn đề được raise và điều phối thành task/service khi cần.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Tạo phiếu
          </button>

          <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
            Tổng: <span className="font-semibold text-slate-950">{props.total}</span>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {VIEWS.filter((v) => props.canManage || v.key !== "all").map((item) => {
            const active = view === item.key || (!sp.get("view") && item.key === "mine");

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate({ view: item.key === "mine" ? null : item.key, page: "1" })}
                className={`rounded-2xl px-3 py-2 text-sm font-semibold ${active ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {item.label} <span className="ml-1 opacity-70">{props.counts[item.key] ?? 0}</span>
              </button>
            );
          })}
        </div>

        <ListFilterForm
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters();
          }}
          className="mt-4"
        >
          <ListSearchInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo ref, tiêu đề, watch, SKU, order..."
          />

          <ListSelect
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: "OPEN", label: "Đang mở" },
              { value: "ALL", label: "Tất cả trạng thái" },
              ...Object.values(WorkCaseStatus).map((item) => ({
                value: item,
                label: WORK_CASE_STATUS_LABEL[item],
              })),
            ]}
          />

          <ListSelect
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: "ALL", label: "Tất cả priority" },
              ...Object.values(TaskPriority).map((item) => ({
                value: item,
                label: WORK_CASE_PRIORITY_LABEL[item],
              })),
            ]}
          />

          <ListFilterButton>Lọc</ListFilterButton>

          <ListClearButton
            onClick={() => {
              setQ("");
              setStatus("OPEN");
              setPriority("ALL");

              navigate({
                q: null,
                status: null,
                priority: null,
                page: "1",
              });
            }}
          >
            Xóa lọc
          </ListClearButton>
        </ListFilterForm>
      </div>

      <WorkCaseListTable
        items={props.items}
        page={props.page}
        totalPages={props.totalPages}
        users={users}
        currentUserId={props.currentUserId}
        expandedId={expandedId}
        onToggleExpand={toggleExpand}
        onPage={(page) => navigate({ page: String(page) })}
        onOpen={openDetail}
        onTaskCreated={() => router.refresh()}
      />

      <RaiseWorkCaseModal
        open={createOpen}
        source={null}
        categories={props.categories}
        onClose={() => setCreateOpen(false)}
        onSaved={() => {
          setCreateOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}