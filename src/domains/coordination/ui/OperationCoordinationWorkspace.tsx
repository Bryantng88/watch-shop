"use client";

import { type FormEvent, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronRight, Clock3, Inbox, MessageSquareWarning, Plus, RotateCcw } from "lucide-react";
import AdminBreadcrumbs from "@/domains/shared/ui/breadcrumbs/AdminBreadcrumbs";
import {
  rolloverPreviousCycleItemsAction,
  setWorkspaceAutoBindingReceiverAction,
} from "@/domains/coordination/actions/coordination.actions";
import { createTaskItemAction } from "@/domains/task/actions/task.actions";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import {
  useAppProgress,
  type AppProgressStep,
} from "@/domains/shared/feedback/AppProgressProvider";
import { repairVietnameseMojibake } from "@/domains/shared/text/vietnamese-mojibake";
import type { CoordinationDashboardDTO } from "../server/coordination-dashboard.types";
import { isCoreWorkspaceBlueprint } from "@/domains/task/shared/workspace-flow-policy";

type Props = {
  data: CoordinationDashboardDTO;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function formatDateTime(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function initials(label: string) {
  return label
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("") || "U";
}

function contextPath(context: CoordinationDashboardDTO["context"]) {
  if (context === "SALES") return "sales";
  if (context === "TECHNICAL") return "technical";
  if (context === "MEDIA") return "media";
  if (context === "PAYMENT") return "payment";
  if (context === "GENERAL") return "general";
  return "operation";
}

function prefixedLabel(prefix: "Space" | "Workspace", value: string) {
  const cleanValue = repairVietnameseMojibake(value).trim();
  if (!cleanValue) return prefix;
  if (cleanValue.toLowerCase().startsWith(`${prefix.toLowerCase()} `)) {
    return cleanValue;
  }

  return `${prefix} ${cleanValue}`;
}

function enabledCapabilityLabels(
  capabilities: CoordinationDashboardDTO["blueprints"][number]["workspaceDefinition"]["enabledCapabilities"],
) {
  return [
    capabilities.workflow ? "Workflow" : null,
    capabilities.items ? "Items" : null,
    capabilities.activity ? "Activity" : null,
    capabilities.discussion ? "Discussion" : null,
    capabilities.attachments ? "Attachments" : null,
    capabilities.checklist ? "Checklist" : null,
    capabilities.dueDate ? "Due Date" : null,
    capabilities.assignee ? "Assignee" : null,
    capabilities.priority ? "Priority" : null,
  ].filter(Boolean) as string[];
}

function blueprintSourceLabel(
  blueprint: CoordinationDashboardDTO["blueprints"][number],
) {
  if (blueprint.source === "DRAFT") {
    return blueprint.status ? `Draft (${blueprint.status})` : "Draft";
  }

  return "Registry";
}

function OwnerCell({
  owner,
}: {
  owner: CoordinationDashboardDTO["workTickets"][number]["owner"];
}) {
  const src = resolveMediaPreviewSrc(owner.avatarUrl);

  return (
    <div className="text-sm">
      <div className="text-xs font-medium text-slate-500">Phụ trách</div>
      <div className="mt-1 inline-flex min-w-0 items-center gap-2">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold ${owner.isSystem ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={owner.label} className="h-full w-full object-cover" />
          ) : owner.isSystem ? (
            "S"
          ) : (
            initials(owner.label)
          )}
        </span>
        <span className="truncate font-medium text-slate-800">{owner.label}</span>
      </div>
    </div>
  );
}

export default function OperationCoordinationWorkspace({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialog = useAppDialog();
  const progress = useAppProgress();
  const [blueprintKey, setBlueprintKey] = useState(
    data.blueprints[0]?.selectionKey ?? "",
  );
  const initialTitle = data.blueprints[0]?.workspaceDefinition.defaultName ?? "";
  const [title, setTitle] = useState(initialTitle);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const selectedBlueprint = useMemo(
    () =>
      data.blueprints.find((blueprint) => blueprint.selectionKey === blueprintKey) ??
      data.blueprints[0] ??
      null,
    [blueprintKey, data.blueprints],
  );
  const capabilityLabels = selectedBlueprint
    ? enabledCapabilityLabels(
        selectedBlueprint.workspaceDefinition.enabledCapabilities,
      )
    : [];

  function updateDate(date: string) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("date", date);
    router.push(`/admin/coordination/${contextPath(data.context)}?${next.toString()}`);
  }

  async function createWorkTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    const blueprint = data.blueprints.find(
      (item) => item.selectionKey === blueprintKey,
    );
    if (blueprint?.usage.active && isCoreWorkspaceBlueprint(blueprint)) {
      await dialog.alert({
        title: "Blueprint core đã có Workspace",
        message:
          "Blueprint này chỉ được có một Workspace đang hoạt động trong Space hiện tại. Hãy dùng Workspace hiện có hoặc đóng Workspace cũ trước khi tạo mới.",
        tone: "warning",
      });
      return;
    }

    const duplicateBlueprintConfirmed =
      !blueprint?.usage.active ||
      (await dialog.confirm({
        title: "Xác nhận tạo Workspace",
        message: `Blueprint này hiện có ${blueprint.usage.active} Workspace đang hoạt động trong Space này. Bạn có chắc muốn tạo thêm Workspace mới từ Blueprint này không?`,
        confirmText: "Tạo thêm",
        cancelText: "Hủy",
        tone: "warning",
      }));

    if (!duplicateBlueprintConfirmed) return;

    setError(null);
    startTransition(async () => {
      try {
        await createTaskItemAction({
          taskId: data.cycle.id,
          title: cleanTitle,
          note: blueprint?.snapshotNote ?? null,
          priority: "MEDIUM",
          allowDuplicateBlueprint: Boolean(blueprint?.usage.active),
        });
        setIsCreateFormOpen(false);
        setBlueprintKey(data.blueprints[0]?.selectionKey ?? "");
        setTitle(data.blueprints[0]?.workspaceDefinition.defaultName ?? "");
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Không thể tạo Workspace.");
      }
    });
  }

  async function updateAutoBindingReceiver(nextReceiverId: string) {
    if (!selectedBlueprint) return;

    const nextWorkspace = selectedBlueprint.usage.activeWorkspaces.find(
      (workspace) => workspace.id === nextReceiverId,
    );
    const message = nextWorkspace
      ? `Workspace "${nextWorkspace.title}" sẽ nhận auto-binding request từ domain business cho Blueprint này.`
      : "Blueprint này sẽ chưa có Workspace nhận auto-binding request từ domain business.";
    const ok = await dialog.confirm({
      title: "Cập nhật auto-binding receiver",
      message,
      confirmText: "Cập nhật",
      cancelText: "Hủy",
      tone: nextWorkspace ? "warning" : "danger",
    });

    if (!ok) return;

    setError(null);
    startTransition(async () => {
      try {
        await setWorkspaceAutoBindingReceiverAction({
          taskId: data.cycle.id,
          taskItemId: nextReceiverId || null,
          context: data.context,
          blueprintKey: selectedBlueprint.key,
          blueprintSource: selectedBlueprint.source,
        });
        router.refresh();
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Không thể cập nhật auto-binding receiver.");
      }
    });
  }

  async function rolloverPreviousCycle() {
    const ok = await dialog.confirm({
      title: "Nhận item tồn từ tuần trước?",
      message:
        "Hệ thống sẽ chuyển các item chưa xử lý xong từ Space tuần trước sang Workspace core tương ứng trong Space tuần này. Item cũ sẽ được đánh dấu đã chuyển để không còn hiện như active.",
      confirmText: "Nhận item tồn",
      cancelText: "Hủy",
      tone: "warning",
    });

    if (!ok) return;

    setError(null);
    progress.show({
      title: "Đang nhận item tồn",
      message: "Hệ thống đang chuyển item sang các Workspace core của tuần hiện tại.",
    });

    try {
      const result = await rolloverPreviousCycleItemsAction({
        taskId: data.cycle.id,
        context: data.context,
      });
      const steps: AppProgressStep[] = result.items.map((item, index) => {
        const target = `${item.targetType}:${item.targetId.slice(0, 8)}`;
        const from = repairVietnameseMojibake(item.fromWorkspaceTitle);
        const to = repairVietnameseMojibake(item.toWorkspaceTitle ?? "không có workspace nhận");
        const status =
          item.status === "MOVED"
            ? "done"
            : item.status === "FAILED"
              ? "error"
              : "skipped";

        return {
          id: `${item.targetType}:${item.targetId}:${index}`,
          label: `${target} - ${from} -> ${to}`,
          detail: item.reason ? `${item.status} (${item.reason})` : item.status,
          status,
        };
      });
      progress.update({
        title: "Đã xử lý item tồn",
        message: `Moved: ${result.moved} · Skipped: ${result.skipped} · Failed: ${result.failed}`,
        steps,
      });
      await sleep(result.items.length ? 1800 : 700);

      const lines = result.items
        .slice(0, 12)
        .map((item) => {
          const target = `${item.targetType}:${item.targetId.slice(0, 8)}`;
          const to = item.toWorkspaceTitle ?? "không có workspace nhận";
          return `${item.status} - ${target} - ${item.fromWorkspaceTitle} -> ${to}${item.reason ? ` (${item.reason})` : ""}`;
        });
      const more = result.items.length > lines.length
        ? `\n... và ${result.items.length - lines.length} item khác`
        : "";

      progress.hide();
      await dialog.alert({
        title: "Đã xử lý item tồn",
        message: [
          `Moved: ${result.moved}`,
          `Skipped: ${result.skipped}`,
          `Failed: ${result.failed}`,
          lines.length ? `\n${lines.join("\n")}${more}` : "\nKhông có item cần chuyển.",
        ].join("\n"),
        tone: result.failed ? "warning" : "success",
      });
      router.refresh();
    } catch (caught) {
      progress.hide();
      setError(caught instanceof Error ? caught.message : "Không thể nhận item tồn từ tuần trước.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <AdminBreadcrumbs
          items={[
            { label: "Space Management" },
            { label: data.spacesLabel },
          ]}
        />

        <section className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-700">
              {prefixedLabel("Space", data.cycle.title)}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Tuần {data.week.weekNumber}/{data.week.year}
              </span>
              <span>
                {formatDate(data.week.startDate)} - {formatDate(data.week.endDate)}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[160px_220px]">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Tuần</span>
              <select
                value={data.week.periodKey}
                onChange={(event) => {
                  const option = data.filters.weekOptions.find(
                    (item) => item.value === event.target.value,
                  );
                  if (option) updateDate(option.date);
                }}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-slate-400"
              >
                {data.filters.weekOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Khoảng ngày</span>
              <input
                type="date"
                value={data.filters.selectedDate}
                onChange={(event) => updateDate(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none focus:border-slate-400"
              />
            </label>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {data.report.map((metric) => (
            <div
              key={metric.key}
              className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="text-xs font-medium uppercase text-slate-500">
                {metric.label}
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">
                {metric.value}
              </div>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                {prefixedLabel("Space", data.cycle.title)}
              </h2>

              {!isCreateFormOpen ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => void rolloverPreviousCycle()}
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Nhận item tồn tuần trước
                  </button>
                <button
                  type="button"
                  disabled={!data.blueprints.length}
                  onClick={() => {
                    setError(null);
                    setBlueprintKey(data.blueprints[0]?.selectionKey ?? "");
                    setTitle(data.blueprints[0]?.workspaceDefinition.defaultName ?? "");
                    setIsCreateFormOpen(true);
                  }}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Plus className="h-4 w-4" />
                  Tạo Workspace
                </button>
                </div>
              ) : null}
              <form
                className={`${isCreateFormOpen ? "flex" : "hidden"} min-w-0 flex-col gap-2 sm:flex-row sm:items-center`}
                onSubmit={createWorkTicket}
              >
                <select
                  value={blueprintKey}
                  onChange={(event) => {
                    const nextKey = event.target.value;
                    const nextBlueprint = data.blueprints.find(
                      (blueprint) => blueprint.selectionKey === nextKey,
                    );
                    setBlueprintKey(nextKey);
                    setTitle(nextBlueprint?.workspaceDefinition.defaultName ?? "");
                  }}
                  className="h-9 min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-slate-400 sm:w-56"
                >
                  {data.blueprints.map((blueprint) => (
                    <option key={blueprint.selectionKey} value={blueprint.selectionKey}>
                      {blueprint.name} - {blueprintSourceLabel(blueprint)}
                    </option>
                  ))}
                </select>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                placeholder="Tên Workspace"
                  className="h-9 min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-slate-400 sm:w-64"
                />
                <button
                  type="submit"
                  disabled={isPending || !title.trim()}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Plus className="h-4 w-4" />
                  Xác nhận tạo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setIsCreateFormOpen(false);
                  }}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
              </form>
            </div>
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
            {selectedBlueprint ? (
              <div className="mt-3 grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 lg:grid-cols-[1fr_1fr_1.5fr]">
                <label>
                  <span className="font-medium text-slate-500">Blueprint</span>
                  <select
                    value={blueprintKey}
                    onChange={(event) => {
                      const nextKey = event.target.value;
                      const nextBlueprint = data.blueprints.find(
                        (blueprint) => blueprint.selectionKey === nextKey,
                      );
                      setBlueprintKey(nextKey);
                      if (isCreateFormOpen) {
                        setTitle(nextBlueprint?.workspaceDefinition.defaultName ?? "");
                      }
                    }}
                    className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-slate-400"
                  >
                    {data.blueprints.map((blueprint) => (
                      <option key={blueprint.selectionKey} value={blueprint.selectionKey}>
                        {blueprint.name} - {blueprintSourceLabel(blueprint)}
                      </option>
                    ))}
                  </select>
                </label>

                <div>
                  <div className="font-medium text-slate-500">Workspace đang implicit</div>
                  <div className={`mt-2 text-sm font-semibold ${selectedBlueprint.usage.active ? "text-amber-700" : "text-slate-900"}`}>
                    {selectedBlueprint.usage.active} active / {selectedBlueprint.usage.total} total
                  </div>
                </div>

                <label>
                  <span className="font-medium text-slate-500">Workspace nhận auto-binding</span>
                  <select
                    value={selectedBlueprint.usage.receiverId ?? ""}
                    disabled={isPending || !selectedBlueprint.usage.activeWorkspaces.length}
                    onChange={(event) => void updateAutoBindingReceiver(event.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">Chưa chọn receiver</option>
                    {selectedBlueprint.usage.activeWorkspaces.map((workspace) => (
                      <option key={workspace.id} value={workspace.id}>
                        {prefixedLabel("Workspace", workspace.title)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
            {isCreateFormOpen && selectedBlueprint ? (
              <div className="mt-3 grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 md:grid-cols-3 xl:grid-cols-6">
                <div>
                  <div className="font-medium text-slate-500">Nguồn Blueprint</div>
                  <div className="mt-1 text-slate-900">
                    {blueprintSourceLabel(selectedBlueprint)}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-500">Loại Workspace</div>
                  <div className="mt-1 text-slate-900">
                    {selectedBlueprint.workspaceDefinition.workspaceType}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-500">Tên gọi Item</div>
                  <div className="mt-1 text-slate-900">
                    {selectedBlueprint.workspaceDefinition.itemLabel}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-500">View mặc định</div>
                  <div className="mt-1 text-slate-900">
                    {selectedBlueprint.workspaceDefinition.defaultView}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-500">Đang bật</div>
                  <div className="mt-1 text-slate-900">
                    {capabilityLabels.join(", ")}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-slate-500">Da dung Blueprint</div>
                  <div className={`mt-1 font-semibold ${selectedBlueprint.usage.active ? "text-amber-700" : "text-slate-900"}`}>
                    {selectedBlueprint.usage.active} active / {selectedBlueprint.usage.total} total
                  </div>
                </div>
                <div className="md:col-span-3 xl:col-span-6">
                  <div className="font-medium text-slate-500">Mô tả khi tạo</div>
                  <div className="mt-1 text-slate-900">
                    {selectedBlueprint.workspaceDefinition.defaultDescription ||
                      selectedBlueprint.description ||
                      "-"}
                  </div>
                  {selectedBlueprint.workspaceDefinition.instantiationNotes ? (
                    <div className="mt-1 text-slate-600">
                      {selectedBlueprint.workspaceDefinition.instantiationNotes}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="divide-y divide-slate-100">
            {data.workTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/task-items/${ticket.id}`}
                className="grid gap-3 px-4 py-4 transition hover:bg-slate-50 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.9fr_1fr_0.8fr_1.3fr_auto]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-950">
                      {prefixedLabel("Workspace", ticket.title)}
                    </span>
                    {ticket.needAttention ? (
                      <MessageSquareWarning className="h-4 w-4 text-amber-600" />
                    ) : null}
                  </div>
                </div>

                <OwnerCell owner={ticket.owner} />
                <QueueSummaryCell summary={ticket.queueSummary} />
                <SummaryCell
                  label="Cần chú ý"
                  value={ticket.needAttention ? "Yes" : "No"}
                />
                <SummaryCell label="Feedback" value={String(ticket.feedbackCount)} />
                <SummaryCell label="Cập nhật" value={formatDateTime(ticket.updatedAt)} />

                <div className="min-w-0 text-sm">
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    Activity gần nhất
                  </div>
                  <div className="truncate text-slate-800">
                    {ticket.lastActivity || "-"}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {formatDateTime(ticket.lastActivityAt)}
                  </div>
                </div>

                <div className="flex items-center justify-end text-slate-400">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}

            {!data.workTickets.length ? (
              <div className="flex items-center gap-3 px-4 py-10 text-sm text-slate-500">
                <Inbox className="h-5 w-5" />
                Chưa có Workspace trong tuần này.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 truncate text-slate-800">{value}</div>
    </div>
  );
}

function QueueSummaryCell({
  summary,
}: {
  summary: CoordinationDashboardDTO["workTickets"][number]["queueSummary"];
}) {
  const items = [
    { label: "Sẵn sàng", value: summary.ready },
    { label: "Review", value: summary.review },
    { label: "Feedback", value: summary.feedback },
    { label: "Xong", value: summary.done },
  ];

  return (
    <div className="text-sm">
      <div className="text-xs font-medium text-slate-500">Tóm tắt Item</div>
      <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-600">
        {items.map((item) => (
          <span key={item.label} className="flex items-center justify-between gap-2">
            <span>{item.label}</span>
            <span className="font-medium text-slate-900">{item.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
