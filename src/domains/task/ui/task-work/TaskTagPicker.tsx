"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type TaskTagOption = {
  id?: string;
  name: string;
  slug?: string;
  color?: string | null;
  workflowTemplate?: {
    id: string;
    name: string;
    conditions?: { eventKey: string }[];
    actions?: { actionType: string }[];
  } | null;
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
  const [focused, setFocused] = useState(false);

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
      .slice(0, 6);
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

  const shouldShowSuggestions =
    !compact && focused && (suggestions.length > 0 || draft.trim());

  return (
    <div className="min-w-0">
      <div
        className={cn(
          "rounded-2xl border border-slate-300 bg-white transition focus-within:border-slate-400",
          compact ? "h-10 overflow-hidden px-3" : "p-2",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 items-center gap-1",
            compact ? "h-full overflow-hidden" : "flex-wrap",
          )}
        >
          {safeValue.map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 font-semibold text-slate-600",
                compact
                  ? "max-w-[72px] px-2 py-0.5 text-[10px]"
                  : "max-w-[180px] px-2.5 py-1 text-xs",
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

          <div
            className={cn(
              "flex min-w-[120px] flex-1 items-center gap-1.5",
              compact ? "min-w-[70px]" : "",
            )}
          >
            {!compact ? <Search className="h-3.5 w-3.5 text-slate-300" /> : null}

            <input
              value={draft}
              disabled={disabled}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                window.setTimeout(() => setFocused(false), 120);
              }}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addTag(draft);
                }

                if (event.key === "Backspace" && !draft && safeValue.length) {
                  removeTag(safeValue[safeValue.length - 1]);
                }

                if (event.key === "Escape") {
                  setDraft("");
                  setFocused(false);
                }
              }}
              placeholder={
                safeValue.length
                  ? "Thêm tag..."
                  : compact
                    ? "Tag..."
                    : "Tìm hoặc thêm tag..."
              }
              className={cn(
                "min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400 disabled:cursor-not-allowed",
                compact ? "text-xs" : "text-sm",
              )}
            />
          </div>

          {draft.trim() ? (
            <button
              type="button"
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => addTag(draft)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-xl bg-slate-950 font-semibold text-white disabled:opacity-40",
                compact ? "h-7 px-2 text-[11px]" : "h-8 px-2.5 text-xs",
              )}
            >
              <Plus className="h-3 w-3" />
              Thêm
            </button>
          ) : null}
        </div>

        {shouldShowSuggestions ? (
          <div className="mt-2 border-t border-slate-100 pt-2">
            {suggestions.length ? (
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((tag) => (
                  <button
                    type="button"
                    key={tag.id ?? tag.name}
                    disabled={disabled}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => addTag(tag.name)}
                    className="inline-flex max-w-full items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3 shrink-0" />
                    <span className="truncate">{tag.name}</span>
                    {tag.workflowTemplate ? (
                      <span className="ml-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">
                        WF
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                disabled={disabled || !draft.trim()}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => addTag(draft)}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-40"
              >
                <Plus className="h-3 w-3" />
                Tạo tag “{normalize(draft)}”
              </button>
            )}
          </div>
        ) : null}
      </div>
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
            compact ? "h-5 px-2 text-[10px]" : "px-2 py-0.5 text-[11px]",
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
            compact ? "h-5 px-2 text-[10px]" : "px-2 py-0.5 text-[11px]",
          )}
        >
          +{hidden}
        </span>
      ) : null}
    </div>
  );
}