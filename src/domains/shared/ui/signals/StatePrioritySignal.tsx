// domains/shared/ui/signals/StatePrioritySignal.tsx
import {
    AlertOctagon,
    Check,
    Clock3,
    MoreHorizontal,
    Play,
    Triangle,
    X,
} from "lucide-react";
import { TaskPriority, TaskStatus, WorkCaseStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

type ProgressStep = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";

const TASK_PROGRESS_ORDER: TaskStatus[] = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
];

const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
    TODO: "Cần làm",
    IN_PROGRESS: "Đang làm",
    DONE: "Hoàn thành",
    CANCELLED: "Đã hủy",
};

function stepIndex(status: TaskStatus) {
    if (status === TaskStatus.CANCELLED) return -1;
    return TASK_PROGRESS_ORDER.indexOf(status);
}

export function TaskStatusSignal({ status }: { status: TaskStatus }) {
    const activeIndex = stepIndex(status);
    const isCancelled = status === TaskStatus.CANCELLED;

    if (isCancelled) {
        return (
            <span
                title="Đã hủy"
                className="inline-flex h-7 items-center gap-1.5 rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-500 ring-1 ring-slate-200"
            >
                <X className="h-3.5 w-3.5" />
                Hủy
            </span>
        );
    }

    return (
        <div
            title={TASK_STATUS_LABEL[status]}
            className="inline-flex items-center justify-center gap-1.5"
        >
            {TASK_PROGRESS_ORDER.map((step, index) => {
                const done = index <= activeIndex;
                const current = index === activeIndex;

                return (
                    <span key={step} className="inline-flex items-center gap-1.5">
                        <span
                            className={cn(
                                "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition",
                                done
                                    ? "border-blue-500 bg-blue-500 text-white"
                                    : "border-slate-200 bg-slate-50 text-slate-300",
                                current && status !== TaskStatus.DONE
                                    ? "ring-2 ring-blue-100"
                                    : "",
                                status === TaskStatus.DONE && done
                                    ? "border-emerald-500 bg-emerald-500"
                                    : "",
                            )}
                        >
                            {step === TaskStatus.TODO ? (
                                <Clock3 className="h-3 w-3" />
                            ) : step === TaskStatus.IN_PROGRESS ? (
                                <Play className="h-3 w-3 fill-current" />
                            ) : (
                                <Check className="h-3 w-3" />
                            )}
                        </span>

                        {index < TASK_PROGRESS_ORDER.length - 1 ? (
                            <span
                                className={cn(
                                    "h-px w-4 rounded-full",
                                    index < activeIndex
                                        ? status === TaskStatus.DONE
                                            ? "bg-emerald-400"
                                            : "bg-blue-400"
                                        : "bg-slate-200",
                                )}
                            />
                        ) : null}
                    </span>
                );
            })}
        </div>
    );
}

export function PrioritySignal({ priority }: { priority: TaskPriority }) {
    const map = {
        LOW: {
            label: "Ưu tiên thấp",
            icon: <Triangle className="h-3 w-3 rotate-180 fill-current stroke-[2.5]" />,
            className: "bg-cyan-50 text-cyan-600 ring-cyan-200",
        },
        MEDIUM: {
            label: "Ưu tiên vừa",
            icon: <MoreHorizontal className="h-3.5 w-3.5 stroke-[3]" />,
            className: "bg-emerald-50 text-emerald-600 ring-emerald-200",
        },
        HIGH: {
            label: "Ưu tiên cao",
            icon: <Triangle className="h-3 w-3 fill-current stroke-[2.5]" />,
            className: "bg-amber-50 text-amber-600 ring-amber-200",
        },
        URGENT: {
            label: "Khẩn cấp",
            icon: <AlertOctagon className="h-3.5 w-3.5 stroke-[2.5]" />,
            className: "bg-rose-50 text-rose-600 ring-rose-200",
        },
    } satisfies Record<
        TaskPriority,
        { label: string; icon: React.ReactNode; className: string }
    >;

    const item = map[priority];

    return (
        <span
            title={item.label}
            aria-label={item.label}
            className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-full ring-1",
                item.className,
            )}
        >
            {item.icon}
        </span>
    );
}

export function WorkCaseStatusSignal({ status }: { status: WorkCaseStatus }) {
    const map = {
        NEW: "Chưa xử lý",
        TRIAGED: "Đã phân loại",
        IN_PROGRESS: "Đang xử lý",
        RESOLVED: "Đã giải quyết",
        CANCELLED: "Đã hủy",
    } satisfies Record<WorkCaseStatus, string>;

    return (
        <span className="text-xs font-semibold text-slate-600">
            {map[status]}
        </span>
    );
}