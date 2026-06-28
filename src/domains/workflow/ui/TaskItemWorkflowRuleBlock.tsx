"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  listWorkflowEventDefinitionsAction,
  updateTaskItemWorkflowRuleAction,
} from "../actions/workflow.actions";

type EventDefinition = {
  key: string;
  label: string;
  targetType: string;
  suggestedTags?: string[];
};

function tagNamesOf(item: any) {
  return (item?.tags ?? [])
    .map((tag: any) => String(tag?.name || "").trim())
    .filter(Boolean);
}

export default function TaskItemWorkflowRuleBlock({
  item,
  onSaved,
}: {
  item: any;
  onSaved?: (rule: any) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [eventOptions, setEventOptions] = useState<EventDefinition[]>([]);
  const [eventKeys, setEventKeys] = useState<string[]>(
    (item?.workflowRule?.conditions ?? []).map((condition: any) => condition.eventKey),
  );
  const [loaded, setLoaded] = useState(false);
  const tagNames = useMemo(() => tagNamesOf(item), [item]);

  function loadOptions() {
    if (loaded) return;

    startTransition(async () => {
      const result = await listWorkflowEventDefinitionsAction({ tagNames });
      setEventOptions(result.items ?? []);
      setLoaded(true);
    });
  }

  function toggle(key: string) {
    setEventKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  }

  function save() {
    startTransition(async () => {
      const result = await updateTaskItemWorkflowRuleAction({
        taskItemId: item.id,
        name: `Tự hoàn thành: ${item.title}`,
        eventKeys,
        strategy: "ALL",
      });

      onSaved?.(result.rule ?? null);
    });
  }

  const enabled = eventKeys.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Tự động hoàn thành
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Task Item sẽ tự DONE khi tất cả điều kiện nghiệp vụ đã xảy ra trên các EL liên quan.
          </p>
        </div>

        {enabled ? (
          <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-600">
            Đang bật
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
            Thủ công
          </span>
        )}
      </div>

      {!loaded ? (
        <button
          type="button"
          disabled={pending}
          onClick={loadOptions}
          className="mt-3 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Chọn điều kiện
        </button>
      ) : (
        <div className="mt-3 space-y-2">
          <div className="max-h-52 overflow-y-auto rounded-2xl bg-slate-50 p-2">
            {eventOptions.map((event) => {
              const checked = eventKeys.includes(event.key);

              return (
                <button
                  type="button"
                  key={event.key}
                  onClick={() => toggle(event.key)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs transition",
                    checked ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-white",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                      checked ? "border-blue-500 bg-blue-500 text-white" : "border-slate-300 bg-white text-transparent",
                    )}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                  </span>

                  <span className="min-w-0 flex-1 truncate">{event.label}</span>
                  <span className="shrink-0 rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                    {event.targetType}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between gap-2">
            <button
              type="button"
              disabled={pending || !eventKeys.length}
              onClick={() => setEventKeys([])}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <X className="h-3 w-3" />
              Tắt tự động
            </button>

            <button
              type="button"
              disabled={pending}
              onClick={save}
              className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {pending ? "Đang lưu..." : "Lưu điều kiện"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
