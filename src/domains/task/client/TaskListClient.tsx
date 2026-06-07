"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TaskKind, TaskPriority, TaskStatus } from "@prisma/client";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { changeTaskStatusAction } from "../actions/task.actions";
import type { TaskWithRelations } from "../server/task.repo";
import type { TaskDueKey, TaskViewKey } from "../server/task.types";
import TaskQuickCreateModal, { type TaskQuickCreateContext, type TaskUserOption } from "../ui/quick-create/TaskQuickCreateModal";
import TaskListFilters, { type TaskListFiltersValue } from "../ui/list/TaskListFilters";
import TaskListTable from "../ui/list/TaskListTable";
import TaskListToolbar from "../ui/list/TaskListToolbar";
import TaskListViewTabs, { normalizeTaskView } from "../ui/list/TaskListViewTabs";

const DEFAULT_DUE: TaskDueKey = "ALL";

type Props = {
  items: TaskWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: Record<string, number>;
  dueCounts?: Record<string, number>;
  users: TaskUserOption[];
  currentUserId: string;
  canViewAll?: boolean;
  rawSearchParams?: Record<string, string | string[] | undefined>;
};

function firstRaw(value: string | string[] | undefined, fallback = "") {
  return Array.isArray(value) ? String(value[0] ?? fallback) : String(value ?? fallback);
}

function normalizeDue(value?: string | null): TaskDueKey {
  if (value === "OVERDUE" || value === "TODAY" || value === "THIS_WEEK" || value === "NO_DUE") return value;
  return "ALL";
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

export default function TaskListClient(props: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const progress = useAppProgress();
  const notify = useNotify();

  const currentView = normalizeTaskView(sp.get("view") || firstRaw(props.rawSearchParams?.view));
  const [filters, setFilters] = useState<TaskListFiltersValue>({
    q: firstRaw(props.rawSearchParams?.q),
    status: (firstRaw(props.rawSearchParams?.status, "OPEN") || "OPEN") as any,
    priority: (firstRaw(props.rawSearchParams?.priority, "ALL") || "ALL") as any,
    kind: (firstRaw(props.rawSearchParams?.kind, "ALL") || "ALL") as any,
    due: normalizeDue(firstRaw(props.rawSearchParams?.due, DEFAULT_DUE)),
    pageSize: String(props.pageSize),
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState<TaskQuickCreateContext | null>(null);
  const [editTask, setEditTask] = useState<TaskWithRelations | null>(null);

  useEffect(() => {
    setFilters({
      q: sp.get("q") ?? "",
      status: (sp.get("status") || "OPEN") as TaskStatus | "OPEN" | "ALL",
      priority: (sp.get("priority") || "ALL") as TaskPriority | "ALL",
      kind: (sp.get("kind") || "ALL") as TaskKind | "ALL",
      due: normalizeDue(sp.get("due") || DEFAULT_DUE),
      pageSize: sp.get("pageSize") || String(props.pageSize),
    });
  }, [sp, props.pageSize]);

  function navigate(patch: Record<string, string | null | undefined>) {
    progress.show({ title: "Đang tải task", message: "Hệ thống đang cập nhật danh sách công việc." });
    router.push(buildHref(pathname, sp, patch));
    window.setTimeout(() => progress.hide(), 700);
  }

  function setView(view: TaskViewKey) {
    navigate({ view: view === "mine" ? null : view, page: "1" });
  }

  function setDue(due: TaskDueKey) {
    setFilters((prev) => ({ ...prev, due }));
    navigate({ due: due === "ALL" ? null : due, page: "1" });
  }

  function applyFilters() {
    navigate({
      q: filters.q.trim() || null,
      status: filters.status === "OPEN" ? null : filters.status,
      priority: filters.priority === "ALL" ? null : filters.priority,
      kind: filters.kind === "ALL" ? null : filters.kind,
      due: filters.due === "ALL" ? null : filters.due,
      pageSize: filters.pageSize,
      page: "1",
    });
  }

  function clearFilters() {
    setFilters({ q: "", status: "OPEN", priority: "ALL", kind: "ALL", due: "ALL", pageSize: String(props.pageSize) });
    navigate({ q: null, status: null, priority: null, kind: null, due: null, page: "1" });
  }

  function openCreate(context?: TaskQuickCreateContext) {
    setEditTask(null);
    setModalContext(context ?? null);
    setModalOpen(true);
  }

  function openEdit(row: TaskWithRelations) {
    setModalContext(null);
    setEditTask(row);
    setModalOpen(true);
  }

  async function changeStatus(row: TaskWithRelations, status: TaskStatus) {
    try {
      await changeTaskStatusAction(row.id, status);
      notify.success({ title: "Đã cập nhật task", message: "Trạng thái task đã được cập nhật." });
      router.refresh();
    } catch (error: any) {
      notify.error({ title: "Không thể cập nhật task", message: error?.message || "Có lỗi xảy ra." });
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1360px] min-w-0 space-y-5 px-4 py-6 lg:px-5 xl:px-6">
      <TaskListToolbar total={props.total} due={filters.due} dueCounts={props.dueCounts} onDueChange={setDue} onCreate={() => openCreate()} />

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <TaskListViewTabs value={currentView} counts={props.counts} canViewAll={props.canViewAll} onChange={setView} />
        <div className="pt-4">
          <TaskListFilters filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))} onApply={applyFilters} onClear={clearFilters} />
        </div>
      </div>

      <TaskListTable items={props.items} page={props.page} totalPages={props.totalPages} onPage={(page) => navigate({ page: String(page) })} onStatus={changeStatus} onEdit={openEdit} />

      <TaskQuickCreateModal open={modalOpen} users={props.users} currentUserId={props.currentUserId} context={modalContext} editTask={editTask} onClose={() => setModalOpen(false)} onSaved={() => router.refresh()} />
    </div>
  );
}
