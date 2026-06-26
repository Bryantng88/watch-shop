"use client";

import { Plus, RotateCcw } from "lucide-react";
import { TaskPriority } from "@prisma/client";

type UserOption = {
    id: string;
    name?: string | null;
    email?: string | null;
};

type TagOption = {
    id?: string | null;
    name: string;
};

export type TaskItemChecklistFilter = "ALL" | "HAS_CHECKLIST" | "NO_CHECKLIST";

function userLabel(user: UserOption) {
    return user.name || user.email || "Không rõ";
}

export default function TaskItemFilterBar({
    users,
    assigneeFilter,
    priorityFilter,
    checklistFilter,
    tagFilter,
    tagOptions = [],
    total,
    filteredTotal,
    visibleCount,
    canAddTaskItem,
    showCreateBar,
    onToggleCreateBar,
    onAssigneeChange,
    onPriorityChange,
    onChecklistChange,
    onTagChange,
    onReset,
}: {
    users: UserOption[];
    assigneeFilter: string;
    priorityFilter: TaskPriority | "ALL";
    checklistFilter: TaskItemChecklistFilter;
    tagFilter: string;
    tagOptions?: TagOption[];
    total: number;
    filteredTotal: number;
    visibleCount: number;
    canAddTaskItem: boolean;
    showCreateBar: boolean;
    onToggleCreateBar: () => void;
    onAssigneeChange: (value: string) => void;
    onPriorityChange: (value: TaskPriority | "ALL") => void;
    onChecklistChange: (value: TaskItemChecklistFilter) => void;
    onTagChange: (value: string) => void;
    onReset: () => void;
}) {
    const safeTagOptions = Array.isArray(tagOptions) ? tagOptions : [];

    const hasFilter =
        assigneeFilter !== "ALL" ||
        priorityFilter !== "ALL" ||
        checklistFilter !== "ALL" ||
        tagFilter !== "ALL";

    return (
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
                {canAddTaskItem ? (
                    <button
                        type="button"
                        onClick={onToggleCreateBar}
                        className={[
                            "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm font-semibold transition",
                            showCreateBar
                                ? "border-slate-300 bg-slate-100 text-slate-700"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                        ].join(" ")}
                    >
                        <Plus className="h-4 w-4" />
                        Task item
                    </button>
                ) : null}

                <select
                    value={assigneeFilter}
                    onChange={(e) => onAssigneeChange(e.target.value)}
                    className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                >
                    <option value="ALL">Tất cả người đảm nhận</option>
                    <option value="UNASSIGNED">Chưa giao</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {userLabel(user)}
                        </option>
                    ))}
                </select>

                <select
                    value={priorityFilter}
                    onChange={(e) =>
                        onPriorityChange(e.target.value as TaskPriority | "ALL")
                    }
                    className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                >
                    <option value="ALL">Mọi ưu tiên</option>
                    <option value={TaskPriority.URGENT}>Gấp</option>
                    <option value={TaskPriority.HIGH}>Cao</option>
                    <option value={TaskPriority.MEDIUM}>Vừa</option>
                    <option value={TaskPriority.LOW}>Thấp</option>
                </select>

                <select
                    value={checklistFilter}
                    onChange={(e) =>
                        onChecklistChange(e.target.value as TaskItemChecklistFilter)
                    }
                    className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                >
                    <option value="ALL">Checklist: tất cả</option>
                    <option value="HAS_CHECKLIST">Có checklist</option>
                    <option value="NO_CHECKLIST">Chưa có checklist</option>
                </select>

                <select
                    value={tagFilter}
                    onChange={(e) => onTagChange(e.target.value)}
                    className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
                >
                    <option value="ALL">Tag: tất cả</option>
                    {safeTagOptions.map((tag) => (
                        <option
                            key={tag.id ?? tag.name}
                            value={String(tag.name).toLowerCase()}
                        >
                            Tag: {tag.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-end gap-3 text-xs text-slate-500">
                <span>
                    Hiển thị{" "}
                    <b className="font-semibold text-slate-700">{visibleCount}</b> /{" "}
                    {filteredTotal} task item
                    {total !== filteredTotal ? ` · từ ${total}` : ""}
                </span>

                {hasFilter ? (
                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                        title="Đặt lại"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </button>
                ) : null}
            </div>
        </div>
    );
}