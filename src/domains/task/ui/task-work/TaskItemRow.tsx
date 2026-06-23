"use client";

import { cn } from "@/lib/utils";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";
import { ExecutionMiniInlineList, isTrackingExecution } from "../execution";
import { isBusinessDone, splitExecutions } from "./taskWorkPanel.helpers";
import TaskItemChecklistBlock from "./TaskItemChecklistBlock";
import { Ban, ChevronDown, ChevronRight, CircleCheck, Plus, Settings2 } from "lucide-react";
import { useState } from "react";
export default function TaskItemRow({
  item,
  canCancel = true,
  onManage,
  onToggle,
  onDelete,
  onPreview,
  onToggleExpand,
  onAddTaskItemChecklist,
  onToggleTaskItemChecklist,
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
}) {
  const itemExecutions = splitExecutions(item.executions ?? []);
  const hasExecutions = itemExecutions.grouped.length > 0;
  const trackingExecutions = itemExecutions.grouped.filter(isTrackingExecution);

  const done = trackingExecutions.length
    ? trackingExecutions.every(isBusinessDone)
    : Boolean(item.isDone || item.status === "DONE");
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [checklistTitle, setChecklistTitle] = useState("");
  const [localChecklists, setLocalChecklists] = useState(item.checklists ?? []);
  const [checklistExpanded, setChecklistExpanded] = useState(false);
  const hasChecklists = (item.checklists ?? []).length > 0;
  async function submitChecklist() {
    const clean = checklistTitle.trim();
    if (!clean) return;

    const tempId = `temp-${Date.now()}`;

    setLocalChecklists((prev: any[]) => [
      ...prev,
      {
        id: tempId,
        title: clean,
        isDone: false,
      },
    ]);

    setChecklistTitle("");
    setIsAddingChecklist(false);

    try {
      await onAddTaskItemChecklist?.(item.id, clean);
    } catch (error) {
      setLocalChecklists((prev: any[]) => prev.filter((x) => x.id !== tempId));
      throw error;
    }
  }

  return (
    <div className="rounded-[24px] border border-slate-200/80 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={async (event) => {
              event.preventDefault();
              event.stopPropagation();

              if (hasChecklists) {
                setChecklistExpanded((v) => !v);
                return;
              }

              if (trackingExecutions.length) return;
              await onToggle(item);
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-slate-50"
          >
            {hasChecklists ? (
              checklistExpanded ? (
                <ChevronDown className="h-4 w-4 text-slate-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-500" />
              )
            ) : (
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border bg-white",
                  done
                    ? "border-emerald-500 text-emerald-600"
                    : "border-slate-300 text-transparent",
                )}
              >
                <CircleCheck className="h-4 w-4" />
              </span>
            )}
          </button>

          <div className="min-w-0 w-[280px] shrink-0">
            <button
              type="button"
              onClick={() => onToggleExpand(item)}
              className={cn(
                "block max-w-full truncate text-left text-sm font-semibold",
                done ? "text-slate-400 line-through" : "text-slate-950",
              )}
              title="Mở thông tin"
            >
              {item.title}
            </button>

            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
              <span>
                {hasExecutions
                  ? `${itemExecutions.grouped.length} link nghiệp vụ`
                  : item.assignedToUser
                    ? `Giao cho ${item.assignedToUser.name || item.assignedToUser.email
                    }`
                    : "Dòng xử lý"}
              </span>

              {hasExecutions ? (
                <>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => onToggleExpand(item)}
                    className={cn(
                      "font-semibold hover:text-blue-600",
                      trackingExecutions.length
                        ? "text-blue-500"
                        : "text-slate-500",
                    )}
                  >
                    {trackingExecutions.length ? "Theo dõi" : "Thông tin"}
                  </button>
                </>
              ) : null}

              {item.dueAt ? (
                <>
                  <span>·</span>
                  <span>
                    Due {new Date(item.dueAt).toLocaleDateString("vi-VN")}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          {hasExecutions ? (
            <div className="min-w-0 flex-1 border-l border-slate-200 pl-3">
              <ExecutionMiniInlineList
                items={itemExecutions.grouped}
                onPreview={onPreview}
                onMore={() => onManage(item)}
              />
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            title="Thêm checklist"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setChecklistExpanded(true);
              setIsAddingChecklist(true);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Quản lý task item"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onManage(item);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-blue-600 hover:bg-blue-50"
          >
            <Settings2 className="h-4 w-4" />
          </button>

          {canCancel ? (
            <button
              type="button"
              title="Hủy task item"
              onClick={async (event) => {
                event.preventDefault();
                event.stopPropagation();
                await onDelete(item);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-rose-600 hover:bg-rose-50"
            >
              <Ban className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {checklistExpanded || isAddingChecklist ? (
        <TaskItemChecklistBlock
          item={item}
          isAdding={isAddingChecklist}
          title={checklistTitle}
          setTitle={setChecklistTitle}
          submit={submitChecklist}
          cancel={() => {
            setChecklistTitle("");
            setIsAddingChecklist(false);
          }}
          onToggleChecklist={onToggleTaskItemChecklist}
        />
      ) : null}
    </div>
  );
}