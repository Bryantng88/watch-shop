import * as React from "react";
import { useDroppable } from "@dnd-kit/core";
import type { BoardColumnKey, IssueItem } from "./types";
import { getColumnStyle } from "./theme";

function priorityRank(priority?: string | null) {
  const raw = String(priority || "").toUpperCase();
  if (raw === "URGENT") return 4;
  if (raw === "HIGH") return 3;
  if (raw === "MEDIUM" || raw === "NORMAL") return 2;
  if (raw === "LOW") return 1;
  return 0;
}

function prioritySummary(items: IssueItem[]) {
  const urgent = items.filter((item) => priorityRank(item.priority) >= 4).length;
  const high = items.filter((item) => priorityRank(item.priority) === 3).length;

  if (urgent > 0) return { label: `${urgent} gấp`, className: "border-red-200 bg-red-50 text-red-700" };
  if (high > 0) return { label: `${high} ưu tiên`, className: "border-orange-200 bg-orange-50 text-orange-700" };

  return null;
}

export function BoardColumn({
  column,
  items,
  isOver,
  children,
  canLoadMore,
  onLoadMore,
  loadingMore,
  totalCount,
}: {
  column: { key: BoardColumnKey; title: string; subtitle: string };
  items: IssueItem[];
  isOver?: boolean;
  children: React.ReactNode;
  canLoadMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  totalCount?: number;
}) {
  const style = getColumnStyle(column.key);
  const priority = prioritySummary(items);
  const { setNodeRef } = useDroppable({
    id: column.key,
    data: {
      type: "column",
      column: column.key,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border p-3 transition ${style.wrap} ${
        isOver ? `ring-2 ${style.ring}` : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className={`text-sm font-semibold ${style.head}`}>{column.title}</div>
          <div className="mt-1 text-xs text-stone-500">{column.subtitle}</div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${style.badge}`}>
            {totalCount ?? items.length}
          </span>
          {priority ? (
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${priority.className}`}>
              {priority.label}
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 bg-white px-3 py-8 text-center text-sm text-stone-400">
            Kéo thả issue vào đây
          </div>
        ) : (
          <>
            {children}
            {canLoadMore ? (
              <button
                type="button"
                onClick={onLoadMore}
                disabled={loadingMore}
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50"
              >
                {loadingMore ? "Đang tải..." : "Tải thêm"}
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
