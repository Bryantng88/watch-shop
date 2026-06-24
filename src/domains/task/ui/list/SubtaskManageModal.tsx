"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Info, Lock, X } from "lucide-react";
import { TaskExecutionTargetType, TaskPriority } from "@prisma/client";
import EntityLinkPicker, {
    type EntityLinkType,
} from "@/domains/shared/ui/pickers/EntityLinkPicker";
import { searchWorkCaseLinkTargetsAction } from "@/domains/work-case/actions/work-case.actions";
import { linkTaskExecutionsAction } from "../../actions/task-execution.actions";
import {
    ExecutionMiniInline,
    ExecutionMiniInlineList,
} from "../execution";
import {
    BusinessEntityPreviewModal,
    useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";

import { deleteTaskExecutionAction } from "../../actions/task-action-execution.actions";

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
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

function normalizeTargetType(value?: string | null): LinkTargetType | null {
    if (!value) return null;

    if (value === "WATCH") return "WATCH";
    if (value === "ORDER") return "ORDER";
    if (value === "SHIPMENT") return "SHIPMENT";
    if (value === "SERVICE" || value === "SERVICE_REQUEST") return "SERVICE";

    return null;
}

function getExistingTargetType(item: any): LinkTargetType | null {
    const first = item?.executions?.[0];
    return normalizeTargetType(first?.targetType);
}

function getExistingLinkMode(item: any): LinkMode | null {
    const first = item?.executions?.[0];
    const mode = first?.metadataJson?.linkMode;

    if (mode === "TRACKING") return "TRACKING";
    if (mode === "CONTEXT") return "CONTEXT";

    return null;
}

function existingTargetIds(item: any) {
    return new Set(
        (item?.executions ?? [])
            .map((execution: any) => String(execution?.targetId ?? "").trim())
            .filter(Boolean),
    );
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
    onLinked?: (payload?: any) => void;
}) {
    const [pending, startTransition] = useTransition();

    const [title, setTitle] = useState("");
    const [assignedToUserId, setAssignedToUserId] = useState("");
    const [dueAt, setDueAt] = useState("");
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);

    const [linkMode, setLinkMode] = useState<LinkMode>("CONTEXT");
    const [linkTargetType, setLinkTargetType] = useState<LinkTargetType>("WATCH");
    const [linkTargetIds, setLinkTargetIds] = useState<string[]>([]);

    const existingType = useMemo(() => getExistingTargetType(item), [item]);
    const existingMode = useMemo(() => getExistingLinkMode(item), [item]);
    const lockedTargetType = Boolean(existingType);
    const linkedIds = useMemo(() => existingTargetIds(item), [item]);
    const previewState = useBusinessEntityPreview();
    const existingExecutions = item?.executions ?? [];
    useEffect(() => {
        if (!open || !item) return;

        setTitle(item.title || "");
        setAssignedToUserId(item.assignedToUserId || "");
        setDueAt(toDateInput(item.dueAt));
        setPriority((item.priority as TaskPriority) || TaskPriority.MEDIUM);

        setLinkTargetType(existingType || "WATCH");
        setLinkMode(existingMode || "CONTEXT");
        setLinkTargetIds([]);
    }, [open, item, existingType, existingMode]);

    if (!open || !item) return null;
    async function unlinkExecution(executionId: string) {
        startTransition(async () => {
            await deleteTaskExecutionAction({ executionId });

            onLinked?.({
                taskItemId: item.id,
                removedExecutionId: executionId,
            });

            onClose();
        });
    }
    function save() {
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

    function submitBatchLink() {
        if (!item || !linkTargetIds.length) return;

        const targetIds = linkTargetIds.filter((id) => !linkedIds.has(id));

        if (!targetIds.length) {
            setLinkTargetIds([]);
            return;
        }

        startTransition(async () => {
            const result = await linkTaskExecutionsAction({
                taskId: task.id,
                taskItemId: item.id,
                targetType: TARGET_MAP[linkTargetType],
                targetIds,
                metadataJson: {
                    linkMode,
                },
            });

            setLinkTargetIds([]);

            onLinked?.({
                taskItemId: item.id,
                executions: result?.executions ?? [],
            });

            onClose();
        });
    }

    const newTargetIds = linkTargetIds.filter((id) => !linkedIds.has(id));

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
                            Cập nhật người nhận, due date và gán danh sách nghiệp vụ cho dòng xử lý này.
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
                                Một subtask có thể link nhiều nghiệp vụ, nhưng tất cả phải cùng một loại.
                            </div>
                        </div>

                        {lockedTargetType ? (
                            <div className="mb-3 flex items-start gap-2 rounded-2xl bg-blue-50 px-3 py-2 text-xs text-blue-700 ring-1 ring-blue-100">
                                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <div>
                                    Subtask này đã có link loại{" "}
                                    <b>{targetLabel(existingType!)}</b>, nên chỉ có thể link thêm cùng loại.
                                    {existingMode ? (
                                        <>
                                            {" "}Mode hiện tại:{" "}
                                            <b>{existingMode === "TRACKING" ? "Theo dõi trạng thái" : "Chỉ gắn thông tin"}</b>.
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-3 flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-100">
                                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <div>
                                    Chọn mode link trước khi gán. Sau khi đã có link, loại nghiệp vụ sẽ được khóa để tránh trộn domain.
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="grid gap-2 md:grid-cols-2">
                                <select
                                    value={linkMode}
                                    disabled={lockedTargetType}
                                    onChange={(event) => setLinkMode(event.target.value as LinkMode)}
                                    className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-100 disabled:text-slate-400"
                                >
                                    <option value="CONTEXT">Chỉ gắn thông tin</option>
                                    <option value="TRACKING">Theo dõi trạng thái</option>
                                </select>

                                <select
                                    value={linkTargetType}
                                    disabled={lockedTargetType}
                                    onChange={(event) => {
                                        setLinkTargetType(event.target.value as LinkTargetType);
                                        setLinkTargetIds([]);
                                    }}
                                    className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-100 disabled:text-slate-400"
                                >
                                    <option value="WATCH">Watch</option>
                                    <option value="ORDER">Đơn hàng</option>
                                    <option value="SHIPMENT">Vận đơn</option>
                                    <option value="SERVICE">Phiếu service</option>
                                </select>
                            </div>
                            {existingExecutions.length ? (
                                <div className="mb-3 rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Đã link {existingExecutions.length} nghiệp vụ
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {existingExecutions.map((execution: any) => (
                                            <div
                                                key={execution.id || `${execution.targetType}:${execution.targetId}`}
                                                className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 px-2 py-2 ring-1 ring-slate-100"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <ExecutionMiniInline
                                                        item={execution}
                                                        onPreview={previewState.openPreview}
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={pending}
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        unlinkExecution(execution.id);
                                                    }}
                                                    className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                                                >
                                                    Gỡ
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                            <EntityLinkPicker
                                multiple
                                type={linkTargetType as EntityLinkType}
                                label={targetLabel(linkTargetType)}
                                values={linkTargetIds}
                                onValuesChange={setLinkTargetIds}
                                search={searchWorkCaseLinkTargetsAction}
                            />

                            {linkTargetIds.length ? (
                                <div className="rounded-2xl bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-100">
                                    Đã chọn {linkTargetIds.length} nghiệp vụ
                                    {newTargetIds.length !== linkTargetIds.length ? (
                                        <>
                                            {" "}· {linkTargetIds.length - newTargetIds.length} nghiệp vụ đã link trước đó sẽ được bỏ qua.
                                        </>
                                    ) : null}
                                </div>
                            ) : null}

                            <button
                                type="button"
                                disabled={pending || !newTargetIds.length}
                                onClick={submitBatchLink}
                                className="inline-flex h-10 items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
                            >
                                {pending
                                    ? "Đang link..."
                                    : newTargetIds.length
                                        ? `Link thêm ${newTargetIds.length} nghiệp vụ`
                                        : "Chọn nghiệp vụ để link"}
                            </button>
                        </div>
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
            <BusinessEntityPreviewModal
                open={previewState.open}
                preview={previewState.preview}
                loading={previewState.loading}
                error={previewState.error}
                onClose={previewState.closePreview}
            />
        </div>
    );
}