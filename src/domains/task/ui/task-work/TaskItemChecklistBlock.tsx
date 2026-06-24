"use client";

import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  onToggleChecklist?: (checklistId: string, isDone: boolean) => Promise<void> | void;
  onUpdateChecklistTitle?: (checklistId: string, title: string) => Promise<void> | void;
  onDeleteChecklist?: (checklistId: string) => Promise<void> | void;
}) {
  const checklists = item.checklists ?? [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!checklists.length && !isAdding) return null;

  async function saveEdit(row: any) {
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

  async function deleteRow(row: any) {
    if (deletingId) return;

    setDeletingId(row.id);

    try {
      await onDeleteChecklist?.(row.id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {checklists.map((row: any) => {
        const editing = editingId === row.id;
        const deleting = deletingId === row.id;

        return (
          <div
            key={row.id}
            className="group flex min-h-9 items-center gap-3 border-b border-slate-100 px-3 py-1.5 last:border-b-0"
          >
            <button
              type="button"
              onClick={() => onToggleChecklist?.(row.id, !row.isDone)}
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
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
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    saveEdit(row);
                  }

                  if (e.key === "Escape") {
                    setEditingId(null);
                    setEditingTitle("");
                  }
                }}
                onBlur={() => saveEdit(row)}
                className="h-7 min-w-0 flex-1 rounded-lg border border-blue-200 bg-white px-2 text-xs outline-none focus:border-blue-400"
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditingId(row.id);
                  setEditingTitle(row.title || "");
                }}
                className={cn(
                  "min-w-0 flex-1 truncate text-left text-xs",
                  row.isDone
                    ? "text-slate-400 line-through"
                    : "text-slate-700 hover:text-slate-950",
                )}
              >
                {row.title}
              </button>
            )}

            <button
              type="button"
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                deleteRow(row);
              }}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 group-hover:opacity-100"
              title="Xóa checklist"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}

      {isAdding ? (
        <div className="flex min-h-9 items-center gap-3 border-t border-dashed border-slate-200 px-3 py-1.5">
          <span className="h-4 w-4 shrink-0 rounded border border-slate-300 bg-white" />

          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }

              if (e.key === "Escape") cancel();
            }}
            onBlur={submit}
            placeholder="Thêm checklist item..."
            className="h-7 min-w-0 flex-1 rounded-lg border border-blue-200 bg-white px-2 text-xs outline-none focus:border-blue-400"
          />
        </div>
      ) : null}
    </div>
  );
}