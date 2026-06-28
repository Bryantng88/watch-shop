import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

function eventLabel(eventKey: string) {
    if (eventKey === "watch.content.approved") return "Content đã duyệt";
    if (eventKey === "watch.image.approved") return "Hình ảnh đã duyệt";
    return eventKey;
}

export default function TaskItemWorkflowProgress({
    progress,
}: {
    progress?: any | null;
}) {
    if (!progress) return null;

    return (
        <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                    <div className="text-sm font-semibold text-slate-900">
                        Workflow: {progress.workflowName}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                        Theo dõi từng nghiệp vụ đã link
                    </div>
                </div>

                <div
                    className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        progress.done
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700",
                    )}
                >
                    {progress.completed}/{progress.total}
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {(progress.targets ?? []).map((target: any) => (
                    <div
                        key={`${target.targetType}:${target.targetId}`}
                        className="px-4 py-3"
                    >
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-slate-800">
                                    {target.label}
                                </div>
                                <div className="text-[11px] font-medium text-slate-400">
                                    {target.targetType}
                                </div>
                            </div>

                            <div
                                className={cn(
                                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                                    target.done
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-slate-100 text-slate-500",
                                )}
                            >
                                {target.completed}/{target.total}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            {(target.conditions ?? []).map((condition: any) => (
                                <div
                                    key={condition.eventKey}
                                    className={cn(
                                        "flex items-center gap-2 text-xs font-medium",
                                        condition.done ? "text-emerald-700" : "text-slate-400",
                                    )}
                                >
                                    {condition.done ? (
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                    ) : (
                                        <Circle className="h-3.5 w-3.5" />
                                    )}
                                    <span>{eventLabel(condition.eventKey)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}