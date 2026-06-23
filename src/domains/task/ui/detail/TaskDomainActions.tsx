"use client";

import { useEffect, useState, useTransition } from "react";
import { Link2 } from "lucide-react";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { linkTaskExecutionAction } from "../../actions/task-execution.actions";
import { TaskExecutionTargetType } from "@prisma/client";
const TARGET_OPTIONS = [
  { value: TaskExecutionTargetType.WATCH, label: "Watch" },
  { value: TaskExecutionTargetType.ORDER, label: "Order" },
  { value: TaskExecutionTargetType.SHIPMENT, label: "Shipment" },
  { value: TaskExecutionTargetType.PAYMENT, label: "Payment" },
  { value: TaskExecutionTargetType.SERVICE_REQUEST, label: "Service Request" },
  { value: TaskExecutionTargetType.TECHNICAL_ISSUE, label: "Technical Issue" },
  { value: TaskExecutionTargetType.ACQUISITION, label: "Acquisition" },
  { value: TaskExecutionTargetType.WORK_CASE, label: "Phiếu xử lý" },
] as const;
function targetOptionLabel(value?: string | null) {
  return (
    TARGET_OPTIONS.find((item) => item.value === value)?.label ||
    value ||
    "Nghiệp vụ"
  );
}

export default function TaskDomainActions({
  task,
  taskItemId,
  mode = "FULL",
  defaultTargetType,
  defaultTargetId,
  onDone,
  linkMode = "CONTEXT",
}: {
  task: any;
  taskItemId?: string | null;
  mode?: "FULL" | "LINK_ONLY";
  defaultTargetType?: TaskExecutionTargetType;
  defaultTargetId?: string;
  onDone?: () => void;
  linkMode?: "CONTEXT" | "TRACKING";

}) {
  const notify = useNotify();
  const [isPending, startTransition] = useTransition();
  const [targetType, setTargetType] = useState<TaskExecutionTargetType>(
    defaultTargetType || TaskExecutionTargetType.ORDER,
  ); const [targetId, setTargetId] = useState(defaultTargetId || "");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (defaultTargetType) setTargetType(defaultTargetType);
    if (defaultTargetId) setTargetId(defaultTargetId);
  }, [defaultTargetType, defaultTargetId]);

  function submit() {
    const cleanTargetId = targetId.trim();

    if (!cleanTargetId) {
      notify.error("Vui lòng chọn nghiệp vụ cần link");
      return;
    }

    startTransition(async () => {
      try {
        await linkTaskExecutionAction({
          taskId: task.id,
          taskItemId: taskItemId || null,
          targetType,
          metadataJson: {
            linkMode,
          },
          targetId: cleanTargetId,
          note: note.trim() || null,
        });

        notify.success("Đã link nghiệp vụ");
        setTargetId("");
        setNote("");
        onDone?.();
      } catch (error: any) {
        notify.error(error?.message || "Không link được nghiệp vụ");
      }
    });
  }

  return (
    <div className="space-y-3">
      {mode === "LINK_ONLY" ? (
        <div className="rounded-2xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200">
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {targetOptionLabel(targetType)}
          </div>
          <div className="mt-0.5 truncate font-semibold text-slate-900">
            {targetId}
          </div>
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-[180px_minmax(0,1fr)]">
          <select
            value={targetType}
            onChange={(e) => setTargetType(e.target.value as any)}
            className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
          >
            {TARGET_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <input
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            placeholder="Dán ID / mã / refNo nghiệp vụ..."
            className="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400"
          />
        </div>
      )}

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Ghi chú link nghiệp vụ..."
        className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400"
      />

      <button
        type="button"
        disabled={isPending || !targetId.trim()}
        onClick={submit}
        className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
      >
        <Link2 className="h-4 w-4" />
        Link nghiệp vụ
      </button>
    </div>
  );
}