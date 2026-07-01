"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TaskKind, TaskPriority, TaskStatus } from "@prisma/client";
import SegmentTabs from "@/domains/shared/ui/list/SegmentTabs";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import {
  changeTaskItemChecklistDoneAction,
  changeTaskStatusAction,
  changeTaskItemDoneAction,
  createTaskItemAction,
  createTaskItemChecklistAction,
  deleteTaskItemAction,
  getTaskQuickCreateDataAction,
  updateTaskItemChecklistTitleAction,
} from "../actions/task.actions";
import type { TaskWithRelations } from "../server/core/task.repo";
import type { TaskViewKey } from "../server/task.types";
import TaskQuickCreateModal, {
  type TaskQuickCreateContext,
  type TaskUserOption,
} from "../ui/quick-create/TaskQuickCreateModal";
import TaskListFilters, {
  type TaskListFiltersValue,
} from "../ui/list/TaskListFilters";
import TaskListTable from "../ui/list/TaskListTable";
import TaskListToolbar from "../ui/list/TaskListToolbar";
import { normalizeTaskView } from "../ui/list/TaskListViewTabs";
import { updateTaskItemAction } from "@/domains/task/actions/task.actions";
import { deleteTaskItemChecklistAction } from "../actions/task.actions";
import { TASK_KIND_LABEL } from "../utils/task-labels";
type Props = {
  items: TaskWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: Record<string, number>;
  users: TaskUserOption[];
  currentUserId: string;
  canViewAll?: boolean;
  rawSearchParams?: Record<string, string | string[] | undefined>;
};

function firstRaw(value: string | string[] | undefined, fallback = "") {
  return Array.isArray(value)
    ? String(value[0] ?? fallback)
    : String(value ?? fallback);
}


type TaskKindFilterKey = "ALL" | TaskKind;

function normalizeTaskKind(value?: string | null): TaskKindFilterKey {
  if (value === TaskKind.OPERATION) return TaskKind.OPERATION;
  if (value === TaskKind.BUSINESS) return TaskKind.BUSINESS;
  if (value === TaskKind.SERVICE) return TaskKind.SERVICE;
  if (value === TaskKind.PERSONAL) return TaskKind.PERSONAL;
  if (value === TaskKind.FREE) return TaskKind.FREE;
  return "ALL";
}

const TASK_KIND_TAB_ITEMS: Array<{ key: TaskKindFilterKey; label: string; countKey: string }> = [
  { key: "ALL", label: "Tất cả", countKey: "kind_ALL" },
  { key: TaskKind.OPERATION, label: TASK_KIND_LABEL.OPERATION, countKey: "kind_OPERATION" },
  { key: TaskKind.BUSINESS, label: TASK_KIND_LABEL.BUSINESS, countKey: "kind_BUSINESS" },
  { key: TaskKind.SERVICE, label: TASK_KIND_LABEL.SERVICE, countKey: "kind_SERVICE" },
  { key: TaskKind.PERSONAL, label: TASK_KIND_LABEL.PERSONAL, countKey: "kind_PERSONAL" },
  { key: TaskKind.FREE, label: TASK_KIND_LABEL.FREE, countKey: "kind_FREE" },
];

function buildHref(
  pathname: string,
  current: URLSearchParams,
  patch: Record<string, string | null | undefined>,
) {
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

  const currentView = normalizeTaskView(
    sp.get("view") || firstRaw(props.rawSearchParams?.view, "all"),
  );
  const currentKind = normalizeTaskKind(
    sp.get("kind") || firstRaw(props.rawSearchParams?.kind, "ALL"),
  );

  const [filters, setFilters] = useState<TaskListFiltersValue>({
    q: firstRaw(props.rawSearchParams?.q),
    status: (firstRaw(props.rawSearchParams?.status, "OPEN") || "OPEN") as any,
    priority: (firstRaw(props.rawSearchParams?.priority, "ALL") ||
      "ALL") as any,
    kind: (firstRaw(props.rawSearchParams?.kind, "ALL") || "ALL") as any,
    pageSize: String(props.pageSize),
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContext, setModalContext] =
    useState<TaskQuickCreateContext | null>(null);
  const [editTask, setEditTask] = useState<TaskWithRelations | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [users, setUsers] = useState<TaskUserOption[]>(props.users);

  useEffect(() => {
    setFilters({
      q: sp.get("q") ?? "",
      status: (sp.get("status") || "OPEN") as TaskStatus | "OPEN" | "ALL",
      priority: (sp.get("priority") || "ALL") as TaskPriority | "ALL",
      kind: (sp.get("kind") || "ALL") as TaskKind | "ALL",
      pageSize: sp.get("pageSize") || String(props.pageSize),
    });
  }, [sp, props.pageSize]);

  useEffect(() => {
    let cancelled = false;

    if (props.users.length) {
      setUsers(props.users);
      return;
    }

    getTaskQuickCreateDataAction()
      .then((result) => {
        if (!cancelled) setUsers(result.users ?? []);
      })
      .catch(() => {
        if (!cancelled) setUsers([]);
      });

    return () => {
      cancelled = true;
    };
  }, [props.users]);

  function navigate(patch: Record<string, string | null | undefined>) {
    progress.show({
      title: "Đang tải task",
      message: "Hệ thống đang cập nhật danh sách công việc.",
    });

    router.push(buildHref(pathname, sp, patch));
    window.setTimeout(() => progress.hide(), 700);
  }

  function setView(view: TaskViewKey) {
    navigate({ view: view === "all" ? null : view, page: "1" });
  }

  function setTaskKind(kind: TaskKindFilterKey) {
    setFilters((prev) => ({ ...prev, kind }));
    navigate({ kind: kind === "ALL" ? null : kind, page: "1" });
  }
  async function handleUpdateTaskItem(input: {
    itemId: string;
    title: string;
    assignedToUserId?: string | null;
    priority?: string | null;
    dueAt?: string | null;
    tagNames?: string[];
  }) {
    try {
      const result = await updateTaskItemAction(input.itemId, {
        title: input.title,
        assignedToUserId: input.assignedToUserId ?? null,
        priority: input.priority as any,
        dueAt: input.dueAt || null,
        tagNames: input.tagNames ?? [],
      } as any);

      return result;
    } catch (error: any) {
      notify.error(error?.message || "Không thể cập nhật task item");
      throw error;
    }
  }
  async function updateTaskItemChecklistTitle(
    checklistId: string,
    title: string,
  ) {
    try {
      await updateTaskItemChecklistTitleAction(checklistId, title);
    } catch (error: any) {
      notify.error(error?.message || "Không thể cập nhật checklist");
    }
  }
  async function toggleTaskItem(itemId: string, isDone: boolean) {
    try {
      const result = await changeTaskItemDoneAction(itemId, isDone);

      if (!result?.ok) {
        throw new Error("Không cập nhật được dòng xử lý.");
      }

      router.refresh();
    } catch (error: any) {
      notify.error({
        title: "Không thể cập nhật dòng xử lý",
        message: error?.message || "Có lỗi xảy ra.",
      });
    }
  }
  async function deleteTaskItem(itemId: string) {
    if (!window.confirm("Xóa dòng xử lý này?")) return;

    try {
      const result = await deleteTaskItemAction(itemId);

      if (!result?.ok) {
        throw new Error("Không xóa được dòng xử lý.");
      }

      router.refresh();
    } catch (error: any) {
      notify.error({
        title: "Không thể xóa dòng xử lý",
        message: error?.message || "Có lỗi xảy ra.",
      });
    }
  }

  async function addTaskItemChecklist(taskItemId: string, title: string) {
    try {
      return await createTaskItemChecklistAction({
        taskItemId,
        title,
      });
    } catch (error: any) {
      notify.error(error?.message || "Không thể thêm checklist");
      throw error;
    }
  }

  async function toggleTaskItemChecklist(checklistId: string, isDone: boolean) {
    try {
      await changeTaskItemChecklistDoneAction(checklistId, isDone);
    } catch (error: any) {
      notify.error(error?.message || "Không thể cập nhật checklist");
    }
  }

  function applyFilters() {
    navigate({
      q: filters.q.trim() || null,
      status: filters.status === "OPEN" ? null : filters.status,
      priority: filters.priority === "ALL" ? null : filters.priority,
      kind: filters.kind === "ALL" ? null : filters.kind,
      pageSize: filters.pageSize,
      page: "1",
    });
  }

  function clearFilters() {
    setFilters({
      q: "",
      status: "OPEN",
      priority: "ALL",
      kind: "ALL",
      pageSize: String(props.pageSize),
    });

    navigate({
      q: null,
      status: null,
      priority: null,
      kind: null,
      page: "1",
    });
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

  function toggleExpand(row: TaskWithRelations) {
    setExpandedTaskId((current) => (current === row.id ? null : row.id));
  }

  async function addTaskItem(input: {
    taskId: string;
    title: string;
    assignedToUserId?: string | null;
    priority?: TaskPriority | null;
    dueAt?: string | null;
    tagNames?: string[];
  }) {
    try {
      const result = await createTaskItemAction(input);
      notify.success("Đã thêm subtask");
      return result;
    } catch (error: any) {
      notify.error(error?.message || "Không thể thêm subtask");
    }
  }
  function createRelatedTask(row: TaskWithRelations) {
    openCreate({
      workCaseId: row.workCaseId ?? undefined,
      watchId: row.watchId ?? undefined,
      titlePreset: `Liên quan: ${row.title}`,
      descriptionPreset: row.description || "",
    } as any);
  }

  async function changeStatus(row: TaskWithRelations, status: TaskStatus) {
    try {
      await changeTaskStatusAction(row.id, status);
      notify.success({
        title: "Đã cập nhật task",
        message: "Trạng thái task đã được cập nhật.",
      });
      router.refresh();
    } catch (error: any) {
      notify.error({
        title: "Không thể cập nhật task",
        message: error?.message || "Có lỗi xảy ra.",
      });
    }
  }
  async function deleteTaskItemChecklist(checklistId: string) {
    try {
      await deleteTaskItemChecklistAction(checklistId);
    } catch (error: any) {
      notify.error(error?.message || "Không thể xóa checklist");
    }
  }
  return (
    <div className="mx-auto w-full max-w-[1360px] min-w-0 space-y-5 px-4 py-6 lg:px-5 xl:px-6">
      <TaskListToolbar total={props.total} onCreate={() => openCreate()} />

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <SegmentTabs<TaskKindFilterKey>
          value={currentKind}
          onChange={setTaskKind}
          items={TASK_KIND_TAB_ITEMS.map((item) => ({
            key: item.key,
            label: item.label,
            count: props.counts[item.countKey] ?? 0,
          }))}
        />

        <div className="pt-4">
          <TaskListFilters
            filters={filters}
            onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
            onApply={applyFilters}
            onClear={clearFilters}
          />
        </div>
      </div>

      <TaskListTable
        items={props.items}
        users={users}
        page={props.page}
        totalPages={props.totalPages}
        expandedTaskId={expandedTaskId}
        onToggleExpand={toggleExpand}
        currentView={currentView}
        counts={props.counts}
        canViewAll={props.canViewAll}
        onViewChange={setView}
        onPage={(page) => navigate({ page: String(page) })}
        onStatus={changeStatus}
        onEdit={openEdit}
        onAddTaskItem={addTaskItem}
        onCreateRelatedTask={createRelatedTask}
        onToggleTaskItem={toggleTaskItem}
        onDeleteTaskItem={deleteTaskItem}
        onUpdateTaskItem={handleUpdateTaskItem}
        onAddTaskItemChecklist={addTaskItemChecklist}
        onToggleTaskItemChecklist={toggleTaskItemChecklist}
        onUpdateTaskItemChecklistTitle={updateTaskItemChecklistTitle}
        onDeleteTaskItemChecklist={deleteTaskItemChecklist}
      />
      <TaskQuickCreateModal
        open={modalOpen}
        users={users}
        currentUserId={props.currentUserId}
        context={modalContext}
        editTask={editTask}
        onClose={() => setModalOpen(false)}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
