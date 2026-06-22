"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { X } from "lucide-react";
import { TaskExecutionTargetType, TaskPriority } from "@prisma/client";
import EntityLinkPicker, {
    type EntityLinkType,
} from "@/domains/shared/ui/pickers/EntityLinkPicker";
import { searchWorkCaseLinkTargetsAction } from "@/domains/work-case/actions/work-case.actions";
import TaskDomainActions from "../detail/TaskDomainActions";

type LinkMode = "CONTEXT" | "TRACKING";
type LinkTargetType = "WATCH" | "ORDER" | "SHIPMENT" | "SERVICE";

const TARGET_MAP = {
    WATCH: TaskExecutionTargetType.WATCH,
    ORDER: TaskExecutionTargetType.ORDER,
    SHIPMENT: TaskExecutionTargetType.SHIPMENT,
    SERVICE: TaskExecutionTargetType.SERVICE_REQUEST,
} as const;

function targetLabel(type: LinkTargetType) {
    if (type === "WATCH") return "Watch";
    if (type === "ORDER") return "Đơn hàng";
    if (type === "SHIPMENT") return "Vận đơn";
    return "Phiếu service";
}

function toDateInput(value?: Date | string | null) {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
}

export default function SubtaskManageModal({
    open,
    task,
    item,
    users,
    canEdit,
    onClose,
    onSave,
    onLinked,
}: {
    open: boolean;
    task: any;
    item: any | null;
    users: Array<{ id: string; name?: string | null; email?: string | null }>;
    canEdit: boolean;
    onClose: () => void;
    onSave?: (input: {
        itemId: string;
        title: string;
        assignedToUserId?: string | null;
        dueAt?: string | null;
        priority?: TaskPriority | null;
    }) => Promise<void> | void;
    onLinked?: () => void;
}) {
    const [pending, startTransition] = useTransition();

    const [title, setTitle] = useState("");
    const [assignedToUserId, setAssignedToUserId] = useState("");
    const [dueAt, setDueAt] = useState("");
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);

    const [linkMode, setLinkMode] = useState<LinkMode>("CONTEXT");
    const [linkTargetType, setLinkTargetType] = useState<LinkTargetType>("WATCH");
    const [linkTargetId, setLinkTargetId] = useState("");

    useEffect(() => {
        if (!open || !item) return;

        setTitle(item.title || "");
        setAssignedToUserId(item.assignedToUserId || "");
        setDueAt(toDateInput(item.dueAt));
        setPriority((item.priority as TaskPriority) || TaskPriority.MEDIUM);
        setLinkMode("CONTEXT");
        setLinkTargetType("WATCH");
        setLinkTargetId("");
    }, [open, item]);

    const hasExistingLink = useMemo(() => {
        return Boolean((item?.executions ?? []).length);
    }, [item]);

    if (!open || !item) return null;

    function save() {
        if (!item) return;

        startTransition(async () => {
            await onSave?.({
                itemId: item.id,
                title: title.trim() || item.title,
                assignedToUserId: assignedToUserId || null,
                dueAt: dueAt || null,
                priority,
            });
            onClose();
        });
    }

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-950">
                            Quản lý subtask
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Cập nhật người nhận, due date và gán nghiệp vụ cho dòng xử lý này.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 px-5 py-4">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Nội dung</span>
                        <input
                            value={title}
                            disabled={!canEdit}
                            onChange={(event) => setTitle(event.target.value)}
                            className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                        />
                    </label>

                    <div className="grid gap-3 md:grid-cols-3">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">
                                Người nhận
                            </span>
                            <select
                                value={assignedToUserId}
                                disabled={!canEdit}
                                onChange={(event) => setAssignedToUserId(event.target.value)}
                                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-50"
                            >
                                <option value="">Tự giao</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name || user.email}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Priority</span>
                            <select
                                value={priority}
                                disabled={!canEdit}
                                onChange={(event) => setPriority(event.target.value as TaskPriority)}
                                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-50"
                            >
                                <option value={TaskPriority.LOW}>Thấp</option>
                                <option value={TaskPriority.MEDIUM}>Vừa</option>
                                <option value={TaskPriority.HIGH}>Cao</option>
                                <option value={TaskPriority.URGENT}>Gấp</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Due date</span>
                            <input
                                type="date"
                                value={dueAt}
                                disabled={!canEdit}
                                onChange={(event) => setDueAt(event.target.value)}
                                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm disabled:bg-slate-50"
                            />
                        </label>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-3">
                        <div className="mb-3">
                            <div className="text-sm font-semibold text-slate-800">
                                Link nghiệp vụ
                            </div>
                            <div className="mt-0.5 text-xs text-slate-500">
                                Chọn “Chỉ gắn thông tin” nếu chỉ muốn người nhận biết cần xử lý trên đối tượng nào.
                            </div>
                        </div>

                        {hasExistingLink ? (
                            <div className="rounded-2xl bg-white px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-100">
                                Subtask này đã có nghiệp vụ được link. Nếu gán sai, hãy hủy subtask và tạo lại dòng xử lý mới.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="grid gap-2 md:grid-cols-2">
                                    <select
                                        value={linkMode}
                                        onChange={(event) => setLinkMode(event.target.value as LinkMode)}
                                        className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                                    >
                                        <option value="CONTEXT">Chỉ gắn thông tin</option>
                                        <option value="TRACKING">Theo dõi trạng thái</option>
                                    </select>

                                    <select
                                        value={linkTargetType}
                                        onChange={(event) => {
                                            setLinkTargetType(event.target.value as LinkTargetType);
                                            setLinkTargetId("");
                                        }}
                                        className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                                    >
                                        <option value="WATCH">Watch</option>
                                        <option value="ORDER">Đơn hàng</option>
                                        <option value="SHIPMENT">Vận đơn</option>
                                        <option value="SERVICE">Phiếu service</option>
                                    </select>
                                </div>

                                <div className="-mt-3">
                                    <EntityLinkPicker
                                        type={linkTargetType as EntityLinkType}
                                        label={targetLabel(linkTargetType)}
                                        value={linkTargetId}
                                        onChange={(id) => setLinkTargetId(id ?? "")}
                                        search={searchWorkCaseLinkTargetsAction}
                                    />
                                </div>

                                {linkTargetId ? (
                                    <TaskDomainActions
                                        task={task}
                                        checklistItemId={item.id}
                                        mode="LINK_ONLY"
                                        linkMode={linkMode}
                                        defaultTargetType={TARGET_MAP[linkTargetType]}
                                        defaultTargetId={linkTargetId}
                                        onDone={() => {
                                            setLinkTargetId("");
                                            onLinked?.();
                                            onClose();
                                        }}
                                    />
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                    >
                        Đóng
                    </button>

                    {canEdit ? (
                        <button
                            type="button"
                            disabled={pending}
                            onClick={save}
                            className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            {pending ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}