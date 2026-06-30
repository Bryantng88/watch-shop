"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { ArrowRightLeft, Check, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    moveTaskItemAction,
    searchTasksForTaskItemMoveAction,
} from "../../actions/task.actions";

type TaskMoveOption = {
    id: string;
    title: string;
    kind?: string | null;
    assignedToUser?: {
        id: string;
        name?: string | null;
        email?: string | null;
    } | null;
    _count?: { taskItems?: number } | null;
};

function compactId(id?: string | null) {
    const raw = String(id || "");
    if (!raw) return "-";
    if (raw.length <= 14) return raw;
    return `${raw.slice(0, 8)}...${raw.slice(-4)}`;
}

function userLabel(user?: TaskMoveOption["assignedToUser"]) {
    return user?.name || user?.email || "Chưa giao";
}

function kindLabel(value?: string | null) {
    if (value === "BUSINESS") return "Kinh doanh";
    if (value === "OPERATION") return "Vận hành";
    if (value === "SERVICE") return "Kỹ thuật / Service";
    if (value === "PERSONAL") return "Cá nhân";
    if (value === "FREE") return "Tự do";
    return "Task";
}

export default function MoveTaskItemModal({
    open,
    item,
    currentTask,
    onClose,
    onMoved,
}: {
    open: boolean;
    item: any | null;
    currentTask: any;
    onClose: () => void;
    onMoved?: (result: any) => void;
}) {
    const router = useRouter();

    const [keyword, setKeyword] = useState("");
    const [options, setOptions] = useState<TaskMoveOption[]>([]);
    const [selected, setSelected] = useState<TaskMoveOption | null>(null);
    const [error, setError] = useState("");

    const [isLoadingTasks, startLoadingTasks] = useTransition();
    const [isMoving, startMoving] = useTransition();

    const canSubmit = Boolean(item?.id && selected?.id) && !isMoving;

    useEffect(() => {
        if (!open) {
            setKeyword("");
            setOptions([]);
            setSelected(null);
            setError("");
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const clean = keyword.trim();
        setError("");

        const timer = window.setTimeout(() => {
            startLoadingTasks(async () => {
                try {
                    const result = await searchTasksForTaskItemMoveAction({
                        keyword: clean,
                        excludeTaskId: currentTask?.id ?? item?.taskId ?? null,
                        limit: 15,
                    });

                    setOptions(result.items ?? []);
                } catch (err: any) {
                    setOptions([]);
                    setError(err?.message || "Không tìm được task.");
                }
            });
        }, clean ? 250 : 0);

        return () => window.clearTimeout(timer);
    }, [keyword, open, currentTask?.id, item?.taskId]);

    const currentTaskLabel = useMemo(() => {
        if (!currentTask) return "Task hiện tại";
        return currentTask.title || compactId(currentTask.id);
    }, [currentTask]);

    if (!open || !item) return null;

    function submit() {
        if (!canSubmit || !item?.id || !selected?.id) return;

        setError("");

        startMoving(async () => {
            try {
                const result = await moveTaskItemAction({
                    itemId: item.id,
                    toTaskId: selected.id,
                });

                onMoved?.(result);
                router.refresh();
                onClose();
            } catch (err: any) {
                setError(err?.message || "Không thể chuyển task item.");
            }
        });
    }

    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm"
            onClick={() => {
                if (!isMoving) onClose();
            }}
        >
            <div
                className="w-full max-w-[520px] overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-slate-950/20"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                    <div>
                        <div className="flex items-center gap-2 text-base font-semibold text-slate-950">
                            <ArrowRightLeft className="h-4 w-4 text-slate-500" />
                            Chuyển Task Item
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                            Chọn Task đích để chuyển dòng xử lý này sang.
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isMoving}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-4 px-5 py-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
                        <div className="text-xs font-medium text-slate-500">Task item</div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                            {item.title || "-"}
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                            Đang nằm trong:{" "}
                            <span className="font-medium text-slate-700">
                                {currentTaskLabel}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                            Tìm Task đích
                        </label>

                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={keyword}
                                onChange={(event) => {
                                    setKeyword(event.target.value);
                                    setSelected(null);
                                }}
                                placeholder={
                                    isLoadingTasks
                                        ? "Đang load danh sách Task..."
                                        : "Nhập tiêu đề hoặc ID task..."
                                }
                                disabled={isMoving}
                                className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-[260px] overflow-auto rounded-2xl border border-slate-200 bg-white">
                        {isLoadingTasks ? (
                            <div className="px-3 py-8 text-center text-sm text-slate-400">
                                Đang load danh sách Task...
                            </div>
                        ) : options.length ? (
                            options.map((task) => {
                                const active = selected?.id === task.id;

                                return (
                                    <button
                                        key={task.id}
                                        type="button"
                                        disabled={isMoving}
                                        onClick={() => setSelected(task)}
                                        className={cn(
                                            "block w-full border-b border-slate-100 px-3 py-3 text-left transition last:border-b-0 disabled:cursor-not-allowed",
                                            active
                                                ? "bg-blue-50 ring-1 ring-inset ring-blue-200"
                                                : "bg-white hover:bg-slate-50",
                                        )}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div
                                                    className={cn(
                                                        "truncate text-sm font-semibold",
                                                        active ? "text-blue-700" : "text-slate-900",
                                                    )}
                                                >
                                                    {task.title}
                                                </div>

                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                                    <span>{compactId(task.id)}</span>
                                                    <span>•</span>
                                                    <span>{kindLabel(task.kind)}</span>
                                                    <span>•</span>
                                                    <span>{userLabel(task.assignedToUser)}</span>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-2">
                                                {active ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-[11px] font-semibold text-white">
                                                        <Check className="h-3 w-3" />
                                                        Đang chọn
                                                    </span>
                                                ) : null}

                                                <span
                                                    className={cn(
                                                        "rounded-full px-2 py-1 text-[11px] font-semibold",
                                                        active
                                                            ? "bg-white text-blue-700"
                                                            : "bg-slate-100 text-slate-600",
                                                    )}
                                                >
                                                    {task._count?.taskItems ?? 0} item
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-3 py-8 text-center text-sm text-slate-400">
                                {keyword.trim()
                                    ? "Không có task phù hợp."
                                    : "Đang load danh sách Task..."}
                            </div>
                        )}
                    </div>

                    {selected ? (
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                            Sẽ chuyển sang:{" "}
                            <span className="font-semibold">{selected.title}</span>
                        </div>
                    ) : null}

                    {error ? (
                        <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-600">
                            {error}
                        </div>
                    ) : null}
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isMoving}
                        className="h-10 rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Hủy
                    </button>

                    <button
                        type="button"
                        disabled={!canSubmit}
                        onClick={submit}
                        className="h-10 max-w-[300px] truncate rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isMoving
                            ? "Đang chuyển..."
                            : selected
                                ? `Chuyển sang "${selected.title}"`
                                : "Chuyển"}
                    </button>
                </div>
            </div>
        </div>
    );
}