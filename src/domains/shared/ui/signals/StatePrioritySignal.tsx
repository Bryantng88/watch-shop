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



export function TaskStatusSignal({ status }: { status: TaskStatus }) {
    const map = {
        TODO: {
            label: "Cần làm",
            icon: <Clock3 className="h-3.5 w-3.5" />,
            className: "bg-amber-50 text-amber-700 ring-amber-100",
        },
        IN_PROGRESS: {
            label: "Đang làm",
            icon: <PlayCircle className="h-3.5 w-3.5" />,
            className: "bg-blue-50 text-blue-700 ring-blue-100",
        },
        DONE: {
            label: "Đã xong",
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
            className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        },
        CANCELLED: {
            label: "Đã hủy",
            icon: <XCircle className="h-3.5 w-3.5" />,
            className: "bg-slate-50 text-slate-500 ring-slate-200",
        },
    } satisfies Record<
        TaskStatus,
        { label: string; icon: React.ReactNode; className: string }
    >;

    const item = map[status];

    return (
        <span
            title={item.label}
            className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold ring-1",
                item.className,
            )}
        >
            {item.icon}
            {item.label}
        </span>
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