"use client";

import { cn } from "@/lib/utils";

export default function TaskItemChecklistBlock({
  item,
  isAdding,
  title,
  setTitle,
  submit,
  cancel,
  onToggleChecklist,
}: {
  item: any;
  isAdding: boolean;
  title: string;
  setTitle: (value: string) => void;
  submit: () => Promise<void> | void;
  cancel: () => void;
  onToggleChecklist?: (checklistId: string, isDone: boolean) => Promise<void> | void;
}) {
  const checklists = item.checklists ?? [];

  if (!checklists.length && !isAdding) return null;

  return (
    <div className="mt-2 pl-9">
      {checklists.map((row: any) => (
        <label key={row.id} className="flex cursor-pointer items-center gap-2 py-0.5">
          <input
            type="checkbox"
            checked={Boolean(row.isDone)}
            onChange={(e) => onToggleChecklist?.(row.id, e.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-300"
          />
          <span className={cn("min-w-0 truncate text-xs text-slate-600", row.isDone && "text-slate-400 line-through")}>
            {row.title}
          </span>
        </label>
      ))}

      {isAdding ? (
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
          placeholder="Checklist..."
          className="mt-1 h-7 w-full max-w-[360px] rounded-lg border border-slate-200 bg-white px-2 text-xs outline-none focus:border-blue-300"
        />
      ) : null}
    </div>
  );
}