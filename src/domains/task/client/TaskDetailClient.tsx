"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  MessageSquarePlus,
  MoreHorizontal,
} from "lucide-react";
import { TaskStatus } from "@prisma/client";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import {
  changeTaskChecklistItemDoneAction,
  changeTaskStatusAction,
  createTaskChecklistItemAction,
  createWorkCaseFeedbackFromTaskAction,
  deleteTaskChecklistItemAction,
} from "../actions/task.actions";
import TaskWorkPanel from "../ui/list/TaskWorkPanel";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

function userLabel(user?: { name?: string | null; email?: string | null } | null) {
  return user?.name || user?.email || "-";
}

function formatDate(value?: Date | string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("vi-VN");
}

function workCaseLabel(workCase: any) {
  return workCase?.refNo || workCase?.title || "Phiếu xử lý";
}

function isBusinessDoneStatus(value?: string | null) {
  const status = String(value ?? "").toUpperCase();
  return ["DONE", "COMPLETED", "DELIVERED", "PAID", "RESOLVED", "CLOSED", "POSTED"].includes(status);
}

function executionBusinessStatus(execution: any) {
  return (
    execution?.technicalIssue?.executionStatus ||
    execution?.serviceRequest?.status ||
    execution?.targetStatus ||
    execution?.status ||
    execution?.actionType ||
    null
  );
}

function checklistItemDone(item: any) {
  const executions = item?.executions ?? [];
  if (!executions.length) return Boolean(item?.isDone);
  return executions.some((execution: any) => isBusinessDoneStatus(executionBusinessStatus(execution)));
}

function canCompleteTask(task: any) {
  const items = task?.checklistItems ?? [];
  if (!items.length) return true;
  return items.every(checklistItemDone);
}

export default function TaskDetailClient({ task }: { task: any }) {
  const router = useRouter();
  const notify = useNotify();
  const [pending, startTransition] = useTransition();
  const [actionOpen, setActionOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [requestNewTask, setRequestNewTask] = useState(true);

  const closed = task.status === TaskStatus.DONE || task.status === TaskStatus.CANCELLED;
  const completionBlocked = !closed && !canCompleteTask(task);

  async function markDone() {
    if (completionBlocked) {
      notify.error("Task còn dòng xử lý chưa hoàn tất.");
      return;
    }

    try {
      await changeTaskStatusAction(task.id, TaskStatus.DONE);
      notify.success("Đã hoàn tất task");
      setActionOpen(false);
      router.refresh();
    } catch (error: any) {
      notify.error(error?.message || "Không hoàn tất được task");
    }
  }

  async function addChecklistItem(_task: any, title: string) {
    await createTaskChecklistItemAction(task.id, title);
    router.refresh();
  }

  async function toggleChecklistItem(itemId: string, isDone: boolean) {
    await changeTaskChecklistItemDoneAction(itemId, isDone);
    router.refresh();
  }

  async function deleteChecklistItem(itemId: string) {
    await deleteTaskChecklistItemAction(itemId);
    router.refresh();
  }

  function sendFeedback() {
    const clean = feedback.trim();
    if (!clean) {
      notify.error("Vui lòng nhập nội dung feedback.");
      return;
    }

    startTransition(async () => {
      try {
        await createWorkCaseFeedbackFromTaskAction({
          taskId: task.id,
          note: clean,
          requestNewTask,
        });
        notify.success("Đã gửi feedback về phiếu xử lý");
        setFeedback("");
        setFeedbackOpen(false);
        router.refresh();
      } catch (error: any) {
        notify.error(error?.message || "Không gửi được feedback");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 lg:px-6 xl:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            <AdminBreadcrumbs
              items={[
                { label: "Tasks", href: "/admin/tasks" },
                { label: task.title || "Chi tiết task" },
              ]}
            />

            <div className="mt-4">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{task.title}</h1>
              {task.description ? (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{task.description}</p>
              ) : null}
            </div>

            <div className="relative mt-4 inline-block">
              <button
                type="button"
                onClick={() => setActionOpen((v) => !v)}
                className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                <MoreHorizontal className="h-4 w-4" />
                Thao tác
                <ChevronDown className="h-4 w-4" />
              </button>

              {actionOpen ? (
                <div className="absolute left-0 z-30 mt-2 w-[280px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <Link
                    href="/admin/tasks"
                    className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => setActionOpen(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Quay lại
                  </Link>

                  {task.workCaseId ? (
                    <>
                      <div className="my-2 h-px bg-slate-100" />
                      <button
                        type="button"
                        onClick={() => {
                          setActionOpen(false);
                          setFeedbackOpen(true);
                        }}
                        className="flex h-10 w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <MessageSquarePlus className="h-4 w-4" />
                        Feedback về phiếu
                      </button>
                    </>
                  ) : null}

                  <div className="my-2 h-px bg-slate-100" />
                  <button
                    type="button"
                    onClick={markDone}
                    disabled={closed || completionBlocked}
                    className="flex h-10 w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
                    title={completionBlocked ? "Còn checklist hoặc nghiệp vụ chưa xong" : undefined}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Hoàn tất task
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex h-full flex-col justify-center rounded-2xl bg-slate-50 px-4 py-4 text-xs text-slate-500">
            <div className="flex justify-between gap-3"><span>Loại</span><span className="font-semibold text-slate-900">{task.taskType?.name || task.domain}</span></div>
            <div className="mt-2 flex justify-between gap-3"><span>Trạng thái</span><span className="font-semibold text-slate-900">{task.status}</span></div>
            <div className="mt-2 flex justify-between gap-3"><span>Ưu tiên</span><span className="font-semibold text-slate-900">{task.priority || "-"}</span></div>
            <div className="mt-2 flex justify-between gap-3"><span>Tạo lúc</span><span className="font-semibold text-slate-900">{formatDate(task.createdAt)}</span></div>
          </div>
        </div>
      </section>

      {feedbackOpen ? (
        <section className="rounded-[28px] border border-blue-100 bg-blue-50 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-950">Feedback về phiếu xử lý</h2>
              <p className="mt-1 text-sm text-slate-600">Gửi yêu cầu/ngữ cảnh để manager nhìn thấy ở WorkCase và tạo thêm task nếu cần.</p>
            </div>
            <button type="button" onClick={() => setFeedbackOpen(false)} className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate-500 hover:bg-white">Đóng</button>
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            className="mt-4 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm outline-none focus:border-blue-300"
            placeholder="Ví dụ: Khách có thêm 2 đồng hồ, cần tạo thêm task kiểm tra tình trạng..."
          />

          <label className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={requestNewTask} onChange={(e) => setRequestNewTask(e.target.checked)} />
            Đây là yêu cầu tạo thêm task
          </label>

          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setFeedbackOpen(false)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">Hủy</button>
            <button type="button" onClick={sendFeedback} disabled={pending} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Gửi feedback</button>
          </div>
        </section>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Checklist xử lý</p>
              <h2 className="mt-1 text-base font-semibold text-slate-950">Các dòng xử lý của task</h2>
              <p className="mt-1 text-sm text-slate-500">Dòng thường tick tay. Dòng đã tạo/link nghiệp vụ sẽ theo trạng thái nghiệp vụ.</p>
            </div>
            <div className="mt-4 overflow-hidden rounded-3xl border border-slate-100">
              <TaskWorkPanel
                task={task}
                checklistItems={task.checklistItems ?? []}
                executions={task.executions ?? []}
                onAddChecklistItem={addChecklistItem}
                onToggleChecklistItem={toggleChecklistItem}
                onDeleteChecklistItem={deleteChecklistItem}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Context</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {task.workCase ? (
                <div>
                  <span className="text-slate-400">Phiếu xử lý:</span>{" "}
                  <Link href={`/admin/work-cases/${task.workCase.id}`} className="font-semibold text-blue-700 hover:text-blue-900">
                    {workCaseLabel(task.workCase)} <ExternalLink className="inline h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : null}

              {task.watch?.product ? (
                <div>
                  <span className="text-slate-400">Watch:</span>{" "}
                  <Link href={`/admin/watches/${task.watch.productId}`} className="font-semibold text-blue-700 hover:text-blue-900">
                    {task.watch.product.title} <ExternalLink className="inline h-3.5 w-3.5" />
                  </Link>
                  <div className="mt-1 text-xs text-slate-400">SKU: {task.watch.product.sku || "-"}</div>
                </div>
              ) : null}

              {task.assignedToUser ? <div><span className="text-slate-400">Người nhận:</span> <span className="font-semibold text-slate-800">{userLabel(task.assignedToUser)}</span></div> : null}
              {task.createdByUser ? <div><span className="text-slate-400">Người tạo:</span> <span className="font-semibold text-slate-800">{userLabel(task.createdByUser)}</span></div> : null}
              <div><span className="text-slate-400">Due:</span> <span className="font-semibold text-slate-800">{formatDate(task.dueAt)}</span></div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
