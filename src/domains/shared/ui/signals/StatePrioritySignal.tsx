// domains/shared/ui/signals/StatePrioritySignal.tsx
import {
    AlertOctagon,
    Check,
    Clock3,
    MoreHorizontal,
    Play,
    Triangle,
    PlayCircle,
    CheckCircle2,

    XCircle,
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



export function TaskStatusSignal({
    status,
}: {
    status: TaskStatus;
}) {
    const map = {
        TODO: {
            label: "Cần làm",
            className:
                "bg-amber-50 text-amber-700 ring-amber-100",
        },
        IN_PROGRESS: {
            label: "Đang làm",
            className:
                "bg-blue-50 text-blue-700 ring-blue-100",
        },
        DONE: {
            label: "Đã xong",
            className:
                "bg-emerald-50 text-emerald-700 ring-emerald-100",
        },
        CANCELLED: {
            label: "Đã hủy",
            className:
                "bg-slate-50 text-slate-500 ring-slate-200",
        },
    } satisfies Record<
        TaskStatus,
        {
            label: string;
            className: string;
        }
    >;

    const item = map[status];

    return (
        <span
            className={cn(
                "inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ring-1",
                item.className,
            )}
        >
            {item.label}
        </span>
    );
}

export function PrioritySignal({ priority }: { priority: TaskPriority }) {
    const map = {
        LOW: {
            label: "Ưu tiên thấp",
            dot: "bg-slate-400",
            ring: "ring-slate-100",
            content: null,
        },
        MEDIUM: {
            label: "Ưu tiên vừa",
            dot: "bg-sky-500",
            ring: "ring-sky-100",
            content: null,
        },
        HIGH: {
            label: "Ưu tiên cao",
            dot: "bg-orange-500",
            ring: "ring-orange-100",
            content: null,
        },
        URGENT: {
            label: "Khẩn cấp",
            dot: "bg-rose-500",
            ring: "ring-rose-100",
            content: "!",
        },
    } satisfies Record<
        TaskPriority,
        {
            label: string;
            dot: string;
            ring: string;
            content: string | null;
        }
    >;

    const item = map[priority];

    return (
        <span
            title={item.label}
            aria-label={item.label}
            className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-full bg-white ring-4",
                item.ring,
            )}
        >
            {item.content ? (
                <span className="text-[15px] font-black leading-none text-rose-600">
                    {item.content}
                </span>
            ) : (
                <span
                    className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        item.dot,
                    )}
                />
            )}
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