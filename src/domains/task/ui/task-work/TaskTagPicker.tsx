"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type TaskTagOption = {
  id?: string;
  name: string;
  slug?: string;
  color?: string | null;
};

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function keyOf(value: string) {
  return normalize(value).toLowerCase();
}

export default function TaskTagPicker({
  value = [],
  options = [],
  onChange,
  disabled = false,
  compact = false,
}: {
  value?: string[];
  options?: TaskTagOption[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const [draft, setDraft] = useState("");

  const safeValue = Array.isArray(value) ? value : [];
  const safeOptions = Array.isArray(options) ? options : [];

  const selectedKeys = useMemo(
    () => new Set(safeValue.map((item) => keyOf(item))),
    [safeValue],
  );

  const suggestions = useMemo(() => {
    const q = keyOf(draft);

    return safeOptions
      .filter((tag) => !selectedKeys.has(keyOf(tag.name)))
      .filter((tag) => !q || keyOf(tag.name).includes(q))
      .slice(0, 8);
  }, [draft, safeOptions, selectedKeys]);

  function addTag(name: string) {
    const clean = normalize(name);

    if (!clean || selectedKeys.has(keyOf(clean))) {
      setDraft("");
      return;
    }

    onChange([...safeValue, clean]);
    setDraft("");
  }

  function removeTag(name: string) {
    const key = keyOf(name);
    onChange(safeValue.filter((item) => keyOf(item) !== key));
  }

  return (
    <div className="relative min-w-0">
      <div
        className={cn(
          "flex min-h-10 min-w-0 items-center gap-1 rounded-2xl border border-slate-300 bg-white px-3 focus-within:border-slate-400",
          compact ? "h-10 overflow-hidden" : "flex-wrap py-1.5",
        )}
      >
        {safeValue.map((tag) => (
          <span
            key={tag}
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 font-semibold text-slate-600",
              compact
                ? "max-w-[72px] px-2 py-0.5 text-[10px]"
                : "max-w-[180px] px-2 py-1 text-xs",
            )}
          >
            <span className="truncate">{tag}</span>

            <button
              type="button"
              disabled={disabled}
              onClick={() => removeTag(tag)}
              className="rounded-full p-0.5 text-slate-400 hover:bg-white hover:text-rose-500 disabled:cursor-not-allowed"
              title="Bỏ tag"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <input
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addTag(draft);
            }

            if (event.key === "Backspace" && !draft && safeValue.length) {
              removeTag(safeValue[safeValue.length - 1]);
            }
          }}
          placeholder={
            safeValue.length
              ? "Thêm tag..."
              : compact
                ? "Tag..."
                : "Tag, ví dụ: UI, Bug, Data..."
          }
          className={cn(
            "min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400 disabled:cursor-not-allowed",
            compact ? "text-xs" : "text-sm",
          )}
        />

        {draft.trim() ? (
          <button
            type="button"
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => addTag(draft)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-xl bg-slate-950 font-semibold text-white disabled:opacity-40",
              compact ? "h-7 px-2 text-[11px]" : "h-7 px-2 text-xs",
            )}
          >
            <Plus className="h-3 w-3" />
            Thêm
          </button>
        ) : null}
      </div>

      {suggestions.length ? (
        <div className="absolute left-0 top-11 z-40 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/80">
          {suggestions.map((tag) => (
            <button
              type="button"
              key={tag.id ?? tag.name}
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => addTag(tag.name)}
              className="block w-full rounded-xl px-2 py-1.5 text-left text-xs font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-40"
            >
              {tag.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function TaskTagChips({
  tags = [],
  compact = false,
  maxVisible = 2,
}: {
  tags?: any[];
  compact?: boolean;
  maxVisible?: number;
}) {
  const safeTags = Array.isArray(tags) ? tags : [];
  const visible = safeTags.slice(0, maxVisible);
  const hidden = Math.max(0, safeTags.length - visible.length);

  if (!safeTags.length) return null;

  return (
    <div className="flex min-w-0 shrink-0 items-center gap-1">
      {visible.map((tag: any) => (
        <span
          key={tag.id ?? tag.name}
          title={tag.name}
          className={cn(
            "inline-flex max-w-[90px] shrink-0 items-center rounded-full bg-slate-100 font-semibold text-slate-600",
            compact
              ? "h-5 px-2 text-[10px]"
              : "px-2 py-0.5 text-[11px]",
          )}
        >
          <span className="truncate">{tag.name}</span>
        </span>
      ))}

      {hidden > 0 ? (
        <span
          title={safeTags
            .slice(maxVisible)
            .map((tag: any) => tag.name)
            .join(", ")}
          className={cn(
            "inline-flex shrink-0 items-center rounded-full bg-slate-50 font-semibold text-slate-400",
            compact
              ? "h-5 px-2 text-[10px]"
              : "px-2 py-0.5 text-[11px]",
          )}
        >
          +{hidden}
        </span>
      ) : null}
    </div>
  );
}