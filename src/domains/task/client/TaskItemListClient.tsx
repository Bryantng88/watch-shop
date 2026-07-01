"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  CheckCircle2,
  Circle,
  ClipboardList,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import { TaskKind, TaskPriority, TaskStatus } from "@prisma/client";
import {
  createTaskAction,
  createTaskItemAction,
} from "../actions/task.actions";
import {
  TASK_KIND_LABEL,
  TASK_PRIORITY_LABEL,
  TASK_STATUS_LABEL,
} from "../utils/task-labels";
import {
  TaskPriorityBadge,
  TaskStatusBadge,
} from "../ui/shared/TaskBadges";

type UserOption = {
  id: string;
  name?: string | null;
  email?: string | null;
};

type TaskOption = {
  id: string;
  title: string;
  kind: TaskKind;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt?: string | Date | null;
  _count?: { taskItems?: number };
};

type TaskItemRow = {
  id: string;
  taskId: string;
  title: string;
  note?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt?: string | Date | null;
  createdAt?: string | Date | null;
  assignedToUser?: UserOption | null;
  task: {
    id: string;
    title: string;
    kind: TaskKind;
    status: TaskStatus;
    priority: TaskPriority;
    dueAt?: string | Date | null;
    assignedToUser?: UserOption | null;
  };
  _count?: {
    checklists?: number;
    executions?: number;
  };
};

type Props = {
  items: TaskItemRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  taskOptions: TaskOption[];
  users: UserOption[];
  currentUserId: string;
  rawSearchParams?: Record<string, string | string[] | undefined>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value?: string | Date | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function userLabel(user?: UserOption | null) {
  return user?.name || user?.email || "-";
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function buildQuery(
  current: URLSearchParams,
  patch: Record<string, string | null>,
) {
  const next = new URLSearchParams(current.toString());

  for (const [key, value] of Object.entries(patch)) {
    if (!value) next.delete(key);
    else next.set(key, value);
  }

  if (!("page" in patch)) next.set("page", "1");

  return next.toString();
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <ClipboardList className="h-10 w-10 text-slate-300" />
      <h2 className="mt-4 text-base font-semibold text-slate-950">
        Chua co Task Item nao
      </h2>
      <p className="mt-1 max-w-md text-sm text-slate-500">
        Tao Task Item de bat dau dieu phoi cong viec theo tung ticket cu the.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
      >
        <Plus size={16} />
        Tao Task Item
      </button>
    </div>
  );
}

function CreateTaskItemModal({
  open,
  taskOptions,
  users,
  currentUserId,
  onClose,
  onSaved,
}: {
  open: boolean;
  taskOptions: TaskOption[];
  users: UserOption[];
  currentUserId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [taskId, setTaskId] = useState(taskOptions[0]?.id ?? "");
  const [newTaskKind, setNewTaskKind] = useState<TaskKind>(TaskKind.BUSINESS);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [itemTitle, setItemTitle] = useState("");
  const [assignedToUserId, setAssignedToUserId] = useState(currentUserId);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueAt, setDueAt] = useState("");
  const [error, setError] = useState<string | null>(null);

  function close() {
    if (pending) return;
    onClose();
  }

  function submit() {
    const cleanTitle = itemTitle.trim();
    if (!cleanTitle) {
      setError("Nhap tieu de Task Item.");
      return;
    }

    if (mode === "existing" && !taskId) {
      setError("Chon Task de gan Task Item.");
      return;
    }

    if (mode === "new" && newTaskKind === TaskKind.FREE && !newTaskTitle.trim()) {
      setError("Nhap tieu de Task moi.");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        let finalTaskId = taskId;

        if (mode === "new") {
          const result = await createTaskAction({
            kind: newTaskKind,
            title: newTaskKind === TaskKind.FREE ? newTaskTitle.trim() : undefined,
            assignedToUserId: assignedToUserId || null,
          });
          finalTaskId = result.task.id;
        }

        await createTaskItemAction({
          taskId: finalTaskId,
          title: cleanTitle,
          assignedToUserId: assignedToUserId || null,
          priority,
          dueAt: dueAt || null,
        });

        setItemTitle("");
        setNewTaskTitle("");
        setDueAt("");
        onSaved();
        onClose();
      } catch (err) {
        setError(errorMessage(err, "Khong the tao Task Item."));
      }
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-950">Tao Task Item</h2>
          <p className="mt-1 text-sm text-slate-500">
            Task Item luon nam trong mot Task container.
          </p>
        </div>

        <div className="space-y-4 px-5 py-4">
          {error ? (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setMode("existing")}
              className={[
                "rounded-md px-3 py-1.5 text-sm font-semibold",
                mode === "existing"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500",
              ].join(" ")}
            >
              Chon Task co san
            </button>
            <button
              type="button"
              onClick={() => setMode("new")}
              className={[
                "rounded-md px-3 py-1.5 text-sm font-semibold",
                mode === "new"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500",
              ].join(" ")}
            >
              Tao Task moi
            </button>
          </div>

          {mode === "existing" ? (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Task</span>
              <select
                value={taskId}
                onChange={(event) => setTaskId(event.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              >
                {taskOptions.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title} - {TASK_KIND_LABEL[task.kind]} -{" "}
                    {task._count?.taskItems ?? 0} items
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="grid gap-3 md:grid-cols-[180px_1fr]">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Loai Task
                </span>
                <select
                  value={newTaskKind}
                  onChange={(event) => setNewTaskKind(event.target.value as TaskKind)}
                  className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                >
                  {Object.values(TaskKind).map((kind) => (
                    <option key={kind} value={kind}>
                      {TASK_KIND_LABEL[kind]}
                    </option>
                  ))}
                </select>
              </label>

              {newTaskKind === TaskKind.FREE ? (
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Tieu de Task
                  </span>
                  <input
                    value={newTaskTitle}
                    onChange={(event) => setNewTaskTitle(event.target.value)}
                    className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                    placeholder="VD: Chuan bi bao gia rieng"
                  />
                </label>
              ) : (
                <div className="rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-600">
                  Task theo nhom se dung container theo tuan hien tai neu da ton
                  tai.
                </div>
              )}
            </div>
          )}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Tieu de Task Item
            </span>
            <input
              value={itemTitle}
              onChange={(event) => setItemTitle(event.target.value)}
              className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              placeholder="VD: Kiem tra noi dung san pham truoc khi publish"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Nguoi xu ly
              </span>
              <select
                value={assignedToUserId}
                onChange={(event) => setAssignedToUserId(event.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              >
                <option value="">Chua gan</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {userLabel(user)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Uu tien
              </span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPriority)}
                className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              >
                {Object.values(TaskPriority).map((item) => (
                  <option key={item} value={item}>
                    {TASK_PRIORITY_LABEL[item]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Han</span>
              <input
                type="date"
                value={dueAt}
                onChange={(event) => setDueAt(event.target.value)}
                className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={close}
            disabled={pending}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
          >
            Huy
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Plus size={16} />
            {pending ? "Dang tao..." : "Tao Task Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TaskItemListClient(props: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);

  const filterValues = useMemo(
    () => ({
      q: first(props.rawSearchParams?.q) || "",
      status: first(props.rawSearchParams?.status) || "OPEN",
      priority: first(props.rawSearchParams?.priority) || "ALL",
      kind: first(props.rawSearchParams?.kind) || "ALL",
      taskId: first(props.rawSearchParams?.taskId) || "",
    }),
    [props.rawSearchParams],
  );

  function setFilter(patch: Record<string, string | null>) {
    router.push(`/admin/task-items?${buildQuery(searchParams, patch)}`);
  }

  function goToPage(page: number) {
    router.push(`/admin/task-items?${buildQuery(searchParams, { page: String(page) })}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 text-slate-900 md:px-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ClipboardList size={16} />
              Dieu phoi cong viec
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">
              Task Items
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white"
          >
            <Plus size={16} />
            Tao Task Item
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="grid gap-3 lg:grid-cols-[1fr_150px_150px_160px_220px]">
            <label className="relative block">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                defaultValue={filterValues.q}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setFilter({ q: event.currentTarget.value.trim() || null });
                  }
                }}
                className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
                placeholder="Tim Task Item, Task..."
              />
            </label>

            <select
              value={filterValues.status}
              onChange={(event) => setFilter({ status: event.target.value })}
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="OPEN">Dang mo</option>
              <option value="ALL">Tat ca</option>
              {Object.values(TaskStatus).map((status) => (
                <option key={status} value={status}>
                  {TASK_STATUS_LABEL[status]}
                </option>
              ))}
            </select>

            <select
              value={filterValues.priority}
              onChange={(event) => setFilter({ priority: event.target.value })}
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="ALL">Moi uu tien</option>
              {Object.values(TaskPriority).map((priority) => (
                <option key={priority} value={priority}>
                  {TASK_PRIORITY_LABEL[priority]}
                </option>
              ))}
            </select>

            <select
              value={filterValues.kind}
              onChange={(event) => setFilter({ kind: event.target.value })}
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="ALL">Moi loai Task</option>
              {Object.values(TaskKind).map((kind) => (
                <option key={kind} value={kind}>
                  {TASK_KIND_LABEL[kind]}
                </option>
              ))}
            </select>

            <select
              value={filterValues.taskId}
              onChange={(event) => setFilter({ taskId: event.target.value || null })}
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="">Moi Task</option>
              {props.taskOptions.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <Filter size={14} />
            {props.total} Task Items
          </div>
        </div>

        {props.items.length ? (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="hidden grid-cols-[minmax(280px,1.4fr)_minmax(220px,1fr)_120px_130px_130px] gap-4 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500 lg:grid">
              <div>Task Item</div>
              <div>Task</div>
              <div>Status</div>
              <div>Nguoi xu ly</div>
              <div>Han</div>
            </div>

            <div className="divide-y divide-slate-100">
              {props.items.map((item) => {
                const done = item.status === TaskStatus.DONE;
                const StatusIcon = done ? CheckCircle2 : Circle;

                return (
                  <div
                    key={item.id}
                    className="grid gap-3 px-4 py-4 lg:grid-cols-[minmax(280px,1.4fr)_minmax(220px,1fr)_120px_130px_130px] lg:items-center lg:gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-start gap-2">
                        <StatusIcon
                          size={18}
                          className={done ? "mt-0.5 text-emerald-500" : "mt-0.5 text-slate-300"}
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/admin/task-items/${item.id}`}
                            className="font-semibold text-slate-950 hover:text-slate-700"
                          >
                            {item.title}
                          </Link>
                          {item.note ? (
                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                              {item.note}
                            </p>
                          ) : null}
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span>{item._count?.checklists ?? 0} checklist</span>
                            <span>{item._count?.executions ?? 0} bindings</span>
                            <span>Created {formatDate(item.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/admin/tasks/${item.task.id}`}
                        className="block truncate text-sm font-semibold text-slate-800 hover:text-slate-950"
                      >
                        {item.task.title}
                      </Link>
                      <div className="mt-1 text-xs text-slate-500">
                        {TASK_KIND_LABEL[item.task.kind]}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <TaskStatusBadge status={item.status} />
                      <TaskPriorityBadge priority={item.priority} />
                    </div>

                    <div className="text-sm text-slate-600">
                      {userLabel(item.assignedToUser ?? item.task.assignedToUser)}
                    </div>

                    <div className="text-sm text-slate-600">
                      {formatDate(item.dueAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState onCreate={() => setModalOpen(true)} />
        )}

        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          <div>
            Page {props.page}/{props.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={props.page <= 1}
              onClick={() => goToPage(props.page - 1)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold disabled:opacity-40"
            >
              Truoc
            </button>
            <button
              type="button"
              disabled={props.page >= props.totalPages}
              onClick={() => goToPage(props.page + 1)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      <CreateTaskItemModal
        open={modalOpen}
        taskOptions={props.taskOptions}
        users={props.users}
        currentUserId={props.currentUserId}
        onClose={() => setModalOpen(false)}
        onSaved={() => router.refresh()}
      />
    </div>
  );
}
