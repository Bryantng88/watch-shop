"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CheckCircle2, ExternalLink, ImageIcon, ListChecks, PlayCircle, UserCheck, X } from "lucide-react";
import { TaskDomain, TaskMode, WorkCaseStatus } from "@prisma/client";
import TaskQuickCreateModal, { type TaskQuickCreateContext, type TaskUserOption } from "@/domains/task/ui/quick-create/TaskQuickCreateModal";
import type { WorkCaseWithRelations } from "../server/work-case.repo";
import { updateWorkCaseAction } from "../actions/work-case.actions";
import { WorkCasePriorityBadge, WorkCaseScopeBadge, WorkCaseStatusBadge } from "./WorkCaseBadges";
import { WORK_CASE_STATUS_LABEL } from "../utils/work-case-labels";

function userLabel(user: { name?: string | null; email?: string | null; id?: string | null } | null | undefined) {
  return user?.name || user?.email || user?.id || "-";
}

function imageSrc(item: WorkCaseWithRelations) {
  const inline = item.watch?.product?.productImage?.[0] as any;
  return inline?.imageUrl || inline?.fileKey || item.watch?.product?.primaryImageUrl || null;
}

function defaultTaskDomain(item: WorkCaseWithRelations) {
  if (item.scope === "SERVICE") return TaskDomain.SERVICE;
  if (item.scope === "PAYMENT") return TaskDomain.PAYMENT;
  if (item.scope === "LOGISTIC") return TaskDomain.SHIPMENT;
  return TaskDomain.WATCH;
}

function nextTriageStatus(item: WorkCaseWithRelations) {
  if (item.status === WorkCaseStatus.NEW) return WorkCaseStatus.TRIAGED;
  return item.status;
}

export default function WorkCaseDetailDrawer({
  item,
  users,
  currentUserId,
  canManage,
  onClose,
  onChanged,
}: {
  item: WorkCaseWithRelations | null;
  users: TaskUserOption[];
  currentUserId: string;
  canManage?: boolean;
  onClose: () => void;
  onChanged?: () => void;
}) {
  const [localItem, setLocalItem] = useState<WorkCaseWithRelations | null>(item);
  const [pending, startTransition] = useTransition();
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskContext, setTaskContext] = useState<TaskQuickCreateContext | null>(null);
  const [assignUserId, setAssignUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [assigneeId, setAssigneeId] = useState("");
  useEffect(() => {
    setLocalItem(item);
    setAssignUserId(item?.assignedToUserId ?? "");
    setError(null);
  }, [item]);

  const safeUsers = useMemo(() => users || [], [users]);

  if (!localItem) return null;

  const title = localItem.watch?.product?.title || "Untitled watch";
  const sku = localItem.watch?.product?.sku || "-";
  const img = imageSrc(localItem);
  const canResolve = localItem.status !== WorkCaseStatus.RESOLVED && localItem.status !== WorkCaseStatus.CANCELLED;
  function getActiveItem() {
    if (!localItem) {
      throw new Error("Không có phiếu xử lý đang chọn.");
    }
    return localItem;
  }
  function mutateCase(input: Parameters<typeof updateWorkCaseAction>[1]) {
    const activeItem = getActiveItem();

    setError(null);
    startTransition(async () => {
      try {
        const res = await updateWorkCaseAction(activeItem.id, input);
        if (res?.item) setLocalItem(res.item as WorkCaseWithRelations);
        onChanged?.();
      } catch (err: any) {
        setError(err?.message || "Không thể cập nhật phiếu xử lý.");
      }
    });
  }
  function setStatus(status: WorkCaseStatus) {
    mutateCase({ status });
  }

  function assignToMe() {
    const activeItem = getActiveItem();

    mutateCase({
      assignedToUserId: currentUserId,
      status: nextTriageStatus(activeItem),
    });
  }

  function saveAssignee() {
    const activeItem = getActiveItem();

    mutateCase({
      assignedToUserId: assignUserId || null,
      status: nextTriageStatus(activeItem),
    });
  }

  function openTaskModal() {
    const activeItem = getActiveItem();

    setTaskContext({
      watchId: activeItem.watchId,
      workCaseId: activeItem.id,
      domain: defaultTaskDomain(activeItem),
      mode: TaskMode.NORMAL,
      titlePreset: activeItem.refNo
        ? `Xử lý ${activeItem.refNo}: ${activeItem.title}`
        : `Xử lý phiếu: ${activeItem.title}`,
      descriptionPreset: activeItem.description || "",
    });
    setTaskModalOpen(true);
  }
  function openCreateTask() {
    const activeItem = getActiveItem();

    setTaskContext({
      workCaseId: activeItem.id,
      watchId: activeItem.watchId,
      domain: defaultTaskDomain(activeItem),
      mode: TaskMode.NORMAL,
      titlePreset: activeItem.refNo
        ? `Xử lý ${activeItem.refNo}: ${activeItem.title}`
        : `Xử lý phiếu: ${activeItem.title}`,
      descriptionPreset: activeItem.description || "",
    });

    setTaskModalOpen(true);
  }
  function openServiceFlow() {
    const activeItem = getActiveItem();

    window.location.href =
      `/admin/services/new?watchId=${activeItem.watchId}` +
      `&workCaseId=${activeItem.id}`;
  }
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Đóng" />
      <aside className="relative z-10 flex h-full w-full max-w-[600px] flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Phiếu xử lý</div>
            <h2 className="mt-1 line-clamp-2 text-xl font-semibold text-slate-950">{localItem.title}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <WorkCaseStatusBadge status={localItem.status} />
              <WorkCasePriorityBadge priority={localItem.priority} />
              <WorkCaseScopeBadge scope={localItem.scope} />
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {error ? <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-3">
            <div className="flex gap-3">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {img ? <img src={img} alt={title} className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-slate-400" />}
              </div>
              <div className="min-w-0 py-1">
                <div className="line-clamp-2 text-sm font-semibold text-slate-950">{title}</div>
                <div className="mt-1 text-xs text-slate-500">SKU: {sku}</div>
                <a href={`/admin/watches/${localItem.watch.productId}/edit`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800">
                  Mở watch <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Mô tả</div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{localItem.description || "Không có mô tả."}</p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Thông tin</div>
            <div className="mt-3 grid gap-2 text-sm text-slate-600">
              <div>Ref: <span className="font-mono text-slate-900">{localItem.refNo || localItem.id}</span></div>
              <div>Người tạo: <span className="font-medium text-slate-900">{userLabel(localItem.raisedByUser)}</span></div>
              <div>Người phụ trách: <span className="font-medium text-slate-900">{userLabel(localItem.assignedToUser)}</span></div>
              <div>Nhóm: <span className="font-medium text-slate-900">{localItem.category?.name || "-"}</span></div>
            </div>
          </section>

          {canManage ? (
            <section className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Điều phối</div>
                  <p className="mt-1 text-xs text-slate-500">Manager quyết định tạo task/SR khi thật sự cần.</p>
                </div>
                <button type="button" disabled={pending} onClick={assignToMe} className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  <UserCheck className="h-4 w-4" /> Giao cho tôi
                </button>
              </div>

              <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
                <select value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)} className="h-10 rounded-2xl border border-slate-200 px-3 text-sm">
                  <option value="">Chưa gán người phụ trách</option>
                  {safeUsers.map((user) => <option key={user.id} value={user.id}>{userLabel(user)}</option>)}
                </select>
                <button type="button" disabled={pending} onClick={saveAssignee} className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Lưu phụ trách</button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button type="button" disabled={pending || localItem.status !== WorkCaseStatus.NEW} onClick={() => setStatus(WorkCaseStatus.TRIAGED)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  <CheckCircle2 className="h-4 w-4" /> Tiếp nhận
                </button>
                <button type="button" disabled={pending || localItem.status === WorkCaseStatus.IN_PROGRESS || !canResolve} onClick={() => setStatus(WorkCaseStatus.IN_PROGRESS)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                  <PlayCircle className="h-4 w-4" /> Bắt đầu xử lý
                </button>
                <button type="button" disabled={pending || !canResolve} onClick={openTaskModal} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                  <ListChecks className="h-4 w-4" /> Tạo task từ phiếu
                </button>
                <a href={`/admin/services/new?watchId=${encodeURIComponent(localItem.watchId)}&workCaseId=${encodeURIComponent(localItem.id)}`} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  Tạo service request
                </a>
              </div>
            </section>
          ) : null}

          <section className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Output điều phối</div>
                <p className="mt-1 text-xs text-slate-500">Task/SR chỉ tạo khi manager thấy thật sự cần.</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              {localItem.tasks.length ? localItem.tasks.map((task) => (
                <a key={task.id} href={`/admin/tasks?q=${encodeURIComponent(task.title)}`} className="block rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100">
                  <span className="font-semibold text-slate-900">Task:</span> {task.title} · {task.status}
                </a>
              )) : null}
              {localItem.serviceRequests.length ? localItem.serviceRequests.map((sr) => (
                <a key={sr.id} href={`/admin/services?search=${encodeURIComponent(sr.refNo || sr.id)}`} className="block rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100">
                  <span className="font-semibold text-slate-900">SR:</span> {sr.refNo || sr.id} · {sr.status}
                </a>
              )) : null}
              {!localItem.tasks.length && !localItem.serviceRequests.length ? <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-500">Chưa có task hoặc service request được tạo từ phiếu này.</div> : null}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Activity</div>
            <div className="mt-3 space-y-2">
              {localItem.activities.map((log) => (
                <div key={log.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <div className="font-semibold text-slate-900">{log.action}</div>
                  {log.note ? <div className="mt-0.5">{log.note}</div> : null}
                  <div className="mt-0.5 text-slate-400">{new Date(log.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {canManage ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Điều phối
            </div>

            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="text-xs font-semibold text-slate-500">
                  Người phụ trách
                </span>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                >
                  <option value="">Chưa giao</option>
                  {safeUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email || user.id}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-wrap gap-2">
                <button onClick={saveAssignee} className="rounded-xl border px-3 py-2 text-xs font-semibold">
                  Lưu phụ trách
                </button>

                <button onClick={assignToMe} className="rounded-xl border px-3 py-2 text-xs font-semibold">
                  Giao cho tôi
                </button>

                <button onClick={() => setStatus("TRIAGED")} className="rounded-xl border px-3 py-2 text-xs font-semibold">
                  Tiếp nhận
                </button>

                <button onClick={() => setStatus("IN_PROGRESS")} className="rounded-xl border px-3 py-2 text-xs font-semibold">
                  Bắt đầu xử lý
                </button>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                <button onClick={openCreateTask} className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                  + Tạo task
                </button>

                <button onClick={openServiceFlow} className="rounded-xl border px-3 py-2 text-xs font-semibold">
                  + Tạo service request
                </button>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                <button onClick={() => setStatus("RESOLVED")} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">
                  Đã giải quyết
                </button>

                <button onClick={() => setStatus("CANCELLED")} className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white">
                  Hủy phiếu
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </aside>

      <TaskQuickCreateModal
        open={taskModalOpen}
        users={safeUsers}
        currentUserId={currentUserId}
        context={taskContext}
        onClose={() => setTaskModalOpen(false)}
        onSaved={() => {
          setTaskModalOpen(false);
          onChanged?.();
        }}
      />
    </div>
  );
}
