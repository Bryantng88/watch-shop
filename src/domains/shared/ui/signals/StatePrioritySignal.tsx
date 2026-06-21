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

export function PrioritySignal({
    priority,
    showLabel = false,
}: {
    priority: TaskPriority;
    showLabel?: boolean;
}) {
    const map = {
        LOW: {
            label: "Thấp",
            dot: "bg-slate-400",
        },
        MEDIUM: {
            label: "Vừa",
            dot: "bg-sky-500",
        },
        HIGH: {
            label: "Gấp",
            dot: "bg-orange-500",
        },
        URGENT: {
            label: "Ưu tiên",
            dot: "bg-rose-500",
        },
    } satisfies Record<TaskPriority, { label: string; dot: string }>;

    const item = map[priority];

    if (showLabel) {
        return (
            <span
                title={item.label}
                aria-label={item.label}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700"
            >
                <span className={cn("h-2.5 w-2.5 rounded-full", item.dot)} />
                {item.label}
            </span>
        );
    }

    return (
        <span
            title={item.label}
            aria-label={item.label}
            className={cn("inline-flex h-2.5 w-2.5 rounded-full", item.dot)}
        />
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