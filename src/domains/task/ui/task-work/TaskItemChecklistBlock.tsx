"use client";

import { useState } from "react";
import { Check, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ChecklistUiState = "creating" | "updating" | "deleting";

export default function TaskItemChecklistBlock({
  item,
  isAdding,
  title,
  setTitle,
  submit,
  cancel,
  onToggleChecklist,
  onUpdateChecklistTitle,
  onDeleteChecklist,
}: {
  item: any;
  isAdding: boolean;
  title: string;
  setTitle: (value: string) => void;
  submit: () => Promise<void> | void;
  cancel: () => void;
  onToggleChecklist?: (
    checklistId: string,
    isDone: boolean,
  ) => Promise<void> | void;
  onUpdateChecklistTitle?: (
    checklistId: string,
    title: string,
  ) => Promise<void> | void;
  onDeleteChecklist?: (checklistId: string) => Promise<void> | void;
}) {
  const checklists = item.checklists ?? [];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [viewingRow, setViewingRow] = useState<any | null>(null);

  if (!checklists.length && !isAdding) return null;

  function uiState(row: any): ChecklistUiState | null {
    return row._uiState ?? null;
  }

  function isBusy(row: any) {
    return Boolean(uiState(row));
  }

  async function saveEdit(row: any) {
    if (isBusy(row)) return;

    const clean = editingTitle.trim();

    if (!clean || clean === row.title) {
      setEditingId(null);
      setEditingTitle("");
      return;
    }

    await onUpdateChecklistTitle?.(row.id, clean);

    setEditingId(null);
    setEditingTitle("");
  }

  return (
    <>
      <div className="mt-3 w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {checklists.map((row: any) => {
          const editing = editingId === row.id;
          const state = uiState(row);
          const busy = isBusy(row);

          return (
            <div
              key={row.id}
              className={cn(
                "group flex min-h-9 w-full min-w-0 max-w-full items-center gap-3 overflow-hidden border-b border-slate-100 px-3 py-1.5 last:border-b-0",
                busy && "opacity-70",
              )}
            >
              <button
                type="button"
                disabled={busy}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onToggleChecklist?.(row.id, !row.isDone);
                }}
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border disabled:cursor-not-allowed",
                  row.isDone
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-slate-300 bg-white text-transparent hover:border-emerald-300",
                )}
              >
                <Check className="h-3 w-3" />
              </button>

              {editing ? (
                <input
                  autoFocus
                  disabled={busy}
                  value={editingTitle}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => setEditingTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      saveEdit(row);
                    }

                    if (event.key === "Escape") {
                      setEditingId(null);
                      setEditingTitle("");
                    }
                  }}
                  onBlur={() => saveEdit(row)}
                  className="h-7 w-0 min-w-0 flex-1 rounded-lg border border-blue-200 bg-white px-2 text-xs outline-none focus:border-blue-400 disabled:bg-slate-50"
                />
              ) : (
                <div className="w-0 min-w-0 flex-1 overflow-hidden">
                  <button
                    type="button"
                    disabled={busy}
                    title={row.title}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setViewingRow(row);
                    }}
                    onDoubleClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setEditingId(row.id);
                      setEditingTitle(row.title || "");
                    }}
                    className={cn(
                      "block w-full min-w-0 overflow-hidden truncate whitespace-nowrap text-left text-xs outline-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed",
                      row.isDone
                        ? "text-slate-400 line-through"
                        : "text-slate-700 hover:text-slate-950",
                    )}
                  >
                    {row.title}
                  </button>
                </div>
              )}

              {state ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {state === "creating"
                    ? "Đang thêm"
                    : state === "updating"
                      ? "Đang lưu"
                      : "Đang xóa"}
                </span>
              ) : null}

              <button
                type="button"
                disabled={busy}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onDeleteChecklist?.(row.id);
                }}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 group-hover:opacity-100"
                title="Xóa checklist"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}

        {isAdding ? (
          <div className="flex min-h-9 w-full min-w-0 items-center gap-3 border-t border-dashed border-slate-200 px-3 py-1.5">
            <span className="h-4 w-4 shrink-0 rounded border border-slate-300 bg-white" />

            <input
              autoFocus
              value={title}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submit();
                }

                if (event.key === "Escape") cancel();
              }}
              onBlur={submit}
              placeholder="Thêm checklist item..."
              className="h-7 w-0 min-w-0 flex-1 rounded-lg border border-blue-200 bg-white px-2 text-xs outline-none focus:border-blue-400"
            />
          </div>
        ) : null}
      </div>

      {viewingRow ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4"
          onClick={() => setViewingRow(null)}
        >
          <div
            className="w-full max-w-lg rounded-[24px] bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-sm font-semibold text-slate-950">
              Nội dung checklist
            </div>

            <div className="mt-3 max-h-[360px] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
              {viewingRow.title}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingId(viewingRow.id);
                  setEditingTitle(viewingRow.title || "");
                  setViewingRow(null);
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600"
              >
                Sửa
              </button>

              <button
                type="button"
                onClick={() => setViewingRow(null)}
                className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}