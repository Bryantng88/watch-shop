"use client";

import { useEffect, useState } from "react";
import {
  Ban,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Check,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";
import { ExecutionMiniInlineList, isTrackingExecution } from "../execution";
import { isBusinessDone, splitExecutions } from "./taskWorkPanel.helpers";
import TaskItemChecklistBlock from "./TaskItemChecklistBlock";

function checklistStats(rows: any[]) {
  const total = rows.length;
  const done = rows.filter((x: any) => x.isDone).length;
  return { total, done };
}

function formatDate(value?: Date | string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN");
}

function dueTone(value?: Date | string | null) {
  if (!value) return "text-slate-400";

  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return "text-slate-400";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDay = new Date(due);
  dueDay.setHours(0, 0, 0, 0);

  const diffDays = Math.round((dueDay.getTime() - today.getTime()) / 86400000);

  if (diffDays <= 0) return "text-rose-600 font-semibold";
  if (diffDays <= 2) return "text-sky-600 font-semibold";

  return "text-slate-400";
}

function ProgressRing({ value }: { value: number }) {
  const size = 16;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - value * c;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        className="fill-none stroke-slate-200"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="fill-none stroke-emerald-500"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function priorityLabel(value?: string | null) {
  if (value === "URGENT") return "Gấp";
  if (value === "HIGH") return "Cao";
  if (value === "LOW") return "Thấp";
  return "Vừa";
}

function priorityTone(value?: string | null) {
  if (value === "URGENT") return "bg-rose-50 text-rose-600";
  if (value === "HIGH") return "bg-orange-50 text-orange-600";
  if (value === "LOW") return "bg-slate-100 text-slate-500";
  return "bg-blue-50 text-blue-600";
}

export default function TaskItemRow({
  item,
  canCancel = true,
  onManage,
  onToggle,
  onDelete,
  onPreview,
  expanded,
  onToggleExpand,
  onAddTaskItemChecklist,
  onToggleTaskItemChecklist,
  onUpdateTaskItemChecklistTitle,
  onDeleteTaskItemChecklist,
}: {
  item: any;
  canCancel?: boolean;
  onManage: (item: any) => void;
  onToggle: (item: any) => Promise<void>;
  onDelete: (item: any) => Promise<void>;
  onPreview: (preview: BusinessEntityPreview) => void;
  expanded?: boolean;
  onToggleExpand: (item: any) => void;
  onAddTaskItemChecklist?: (
    taskItemId: string,
    title: string,
  ) => Promise<void> | void;
  onToggleTaskItemChecklist?: (
    checklistId: string,
    isDone: boolean,
  ) => Promise<void> | void;
  onUpdateTaskItemChecklistTitle?: (
    checklistId: string,
    title: string,
  ) => Promise<void> | void;
  onDeleteTaskItemChecklist?: (checklistId: string) => Promise<void> | void;
}) {
  const itemExecutions = splitExecutions(item.executions ?? []);
  const hasExecutions = itemExecutions.grouped.length > 0;
  const trackingExecutions = itemExecutions.grouped.filter(isTrackingExecution);

  const isPending =
    Boolean(item._pending) || String(item.id || "").startsWith("temp-");

  const [localChecklists, setLocalChecklists] = useState<any[]>(
    item.checklists ?? [],
  );
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [checklistTitle, setChecklistTitle] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLocalChecklists(item.checklists ?? []);
  }, [item.checklists]);

  const { total: checklistTotal, done: checklistDone } =
    checklistStats(localChecklists);

  const hasChecklists = checklistTotal > 0;
  const checklistProgress = checklistTotal ? checklistDone / checklistTotal : 0;
  const isChecklistOpen = Boolean(expanded) || isAddingChecklist;

  const checklistDoneState =
    hasChecklists && checklistTotal > 0 && checklistDone === checklistTotal;

  const executionDoneState =
    trackingExecutions.length > 0 &&
    trackingExecutions.every(isBusinessDone);

  const done =
    Boolean(item.isDone) ||
    String(item.status ?? "").toUpperCase() === "DONE" ||
    checklistDoneState ||
    executionDoneState;

  async function submitChecklist() {
    if (isPending) return;

    const clean = checklistTitle.trim();
    if (!clean) return;

    setChecklistTitle("");
    setIsAddingChecklist(false);

    await onAddTaskItemChecklist?.(item.id, clean);
  }

  function openAddChecklist() {
    if (isPending) return;

    setMenuOpen(false);

    if (!isChecklistOpen) {
      onToggleExpand(item);
    }

    setIsAddingChecklist(true);
  }

  return (
    <div
      onClick={() => {
        if (!isPending) onManage(item);
      }}
      className={cn(
        "relative w-full min-w-0 max-w-full cursor-pointer rounded-[24px] border border-slate-200/80 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:shadow-[0_10px_28px_rgba(15,23,42,0.07)]",
        isPending && "cursor-not-allowed opacity-75",
      )}
    >
      <div className="flex w-full min-w-0 items-center gap-3">
        <button
          type="button"
          disabled={isPending}
          title={
            isPending
              ? "Đang tạo task item"
              : hasChecklists
                ? "Mở checklist"
                : done
                  ? "Bỏ hoàn tất"
                  : "Hoàn tất"
          }
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (isPending) return;

            if (hasChecklists) {
              onToggleExpand(item);
              return;
            }

            if (trackingExecutions.length) return;

            await onToggle(item);
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-slate-50 disabled:cursor-not-allowed"
        >
          {hasChecklists ? (
            isChecklistOpen ? (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            )
          ) : (
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded border",
                done
                  ? "border-emerald-500 bg-white text-emerald-600"
                  : "border-slate-300 bg-white text-transparent hover:border-emerald-300",
              )}
            >
              <Check className="h-3 w-3" />
            </span>
          )}
        </button>

        <div className="w-[250px] min-w-0 shrink-0">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              title={item.title}
              disabled={isPending}
              onClick={() => {
                if (!isPending && hasChecklists) onToggleExpand(item);
              }}
              className={cn(
                "block max-w-full truncate text-left text-sm font-semibold disabled:cursor-not-allowed",
                done ? "text-slate-400 line-through" : "text-slate-950",
              )}
            >
              {item.title}
            </button>

            {isPending ? (
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                Đang tạo...
              </span>
            ) : null}
          </div>

          <div className="mt-1 flex items-center gap-2 overflow-hidden text-[11px] text-slate-400">
            <span className={cn("text-xs", dueTone(item.dueAt))}>
              {item.dueAt ? formatDate(item.dueAt) : "Chưa có due date"}
            </span>

            {hasChecklists ? (
              <>
                <span>•</span>

                <span className="shrink-0 font-medium text-slate-600">
                  {checklistDone}/{checklistTotal}
                </span>

                <ProgressRing value={checklistProgress} />
              </>
            ) : null}

            {item.assignedToUser ? (
              <>
                <span>•</span>

                <span className="truncate">
                  {item.assignedToUser.name || item.assignedToUser.email}
                </span>
              </>
            ) : null}

            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                priorityTone(item.priority),
              )}
            >
              {priorityLabel(item.priority)}
            </span>
          </div>
        </div>

        {hasExecutions ? (
          <div className="ml-auto min-w-0 flex-1 overflow-hidden border-l border-slate-200 pl-3">
            <ExecutionMiniInlineList
              items={itemExecutions.grouped}
              onPreview={onPreview}
              onMore={() => {
                if (!isPending) onManage(item);
              }}
            />
          </div>
        ) : (
          <div className="ml-auto min-w-0 flex-1 overflow-hidden" />
        )}

        <div className="relative shrink-0">
          <button
            type="button"
            disabled={isPending}
            title={isPending ? "Đang tạo task item" : "Thao tác"}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (isPending) return;
              setMenuOpen((v) => !v);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {menuOpen && !isPending ? (
            <div className="absolute right-0 top-10 z-30 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-xl shadow-slate-200/70">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  openAddChecklist();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4 text-blue-600" />
                Thêm checklist
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setMenuOpen(false);
                  onManage(item);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                <Settings2 className="h-4 w-4 text-blue-600" />
                Quản lý
              </button>

              {canCancel ? (
                <button
                  type="button"
                  onClick={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setMenuOpen(false);
                    await onDelete(item);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                >
                  <Ban className="h-4 w-4" />
                  Hủy task item
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {!isPending && isChecklistOpen ? (
        <TaskItemChecklistBlock
          item={{ ...item, checklists: localChecklists }}
          isAdding={isAddingChecklist}
          title={checklistTitle}
          setTitle={setChecklistTitle}
          submit={submitChecklist}
          cancel={() => {
            setChecklistTitle("");
            setIsAddingChecklist(false);
          }}
          onDeleteChecklist={onDeleteTaskItemChecklist}
          onToggleChecklist={onToggleTaskItemChecklist}
          onUpdateChecklistTitle={onUpdateTaskItemChecklistTitle}
        />
      ) : null}
    </div>
  );
}