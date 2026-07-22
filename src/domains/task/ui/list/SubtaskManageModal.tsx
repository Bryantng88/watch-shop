"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { RefreshCw, Info, Lock, X } from "lucide-react";
import { TaskExecutionTargetType, TaskPriority } from "@prisma/client";
import EntityLinkPicker, {
    type EntityLinkType,
} from "@/domains/shared/ui/pickers/EntityLinkPicker";
import { searchWorkCaseLinkTargetsAction } from "@/domains/work-case/actions/work-case.actions";
import { linkTaskExecutionsAction } from "../../actions/task-execution.actions";
import { ExecutionMiniInline } from "../execution";
import {
    BusinessEntityPreviewModal,
    useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import { deleteTaskExecutionAction } from "../../actions/task-action-execution.actions";
import TaskTagPicker from "../task-work/TaskTagPicker";
import {
    assignWorkflowTemplateToTagAction,
    listWorkflowTemplatesAction,
} from "@/domains/workflow/actions/workflow.actions";
import TaskItemWorkflowProgress from "../task-work/TaskItemWorkFlowProgress";
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
    if (value === "WATCH") return "WATCH";
    if (value === "ORDER") return "ORDER";
    if (value === "SHIPMENT") return "SHIPMENT";
    if (value === "SERVICE" || value === "SERVICE_REQUEST") return "SERVICE";
    return null;
}

function getExistingTargetType(item: any): LinkTargetType | null {
    return normalizeTargetType(item?.executions?.[0]?.targetType);
}

function getExistingLinkMode(item: any): LinkMode | null {
    const mode = item?.executions?.[0]?.metadataJson?.linkMode;
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

function formatDateTime(value?: Date | string | null) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("vi-VN");
}

function ageInDays(value?: Date | string | null) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const created = new Date(date);
    created.setHours(0, 0, 0, 0);

    return Math.max(
        0,
        Math.floor((today.getTime() - created.getTime()) / 86400000),
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
    onRefresh
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
        tagNames?: string[];
    }) => Promise<void> | void;
    onLinked?: (payload?: any) => void;
    onRefresh?: () => Promise<void> | void;
}) {
    const [pending, startTransition] = useTransition();

    const [title, setTitle] = useState("");
    const [assignedToUserId, setAssignedToUserId] = useState("");
    const [dueAt, setDueAt] = useState("");
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
    const [tagNames, setTagNames] = useState<string[]>([]);
    const [linkMode, setLinkMode] = useState<LinkMode>("CONTEXT");
    const [linkTargetType, setLinkTargetType] = useState<LinkTargetType>("WATCH");
    const [linkTargetIds, setLinkTargetIds] = useState<string[]>([]);

    const [workflowPickerTag, setWorkflowPickerTag] = useState<any | null>(null);
    const [workflowTemplates, setWorkflowTemplates] = useState<any[]>([]);
    const [workflowLoading, setWorkflowLoading] = useState(false);

    const existingType = useMemo(() => getExistingTargetType(item), [item]);
    const existingMode = useMemo(() => getExistingLinkMode(item), [item]);
    const lockedTargetType = Boolean(existingType);
    const linkedIds = useMemo(() => existingTargetIds(item), [item]);
    const previewState = useBusinessEntityPreview();

    const createdDays = ageInDays(item?.createdAt);
    const existingExecutions = item?.executions ?? [];

    const [localTagOptions, setLocalTagOptions] = useState<any[]>([]);

    useEffect(() => {
        setLocalTagOptions(
            mergeTags(
                Array.isArray(task?.tagOptions) ? task.tagOptions : [],
                Array.isArray(item?.tags) ? item.tags : [],
            ),
        );
    }, [task?.tagOptions, item?.tags]);

    const tagOptions = localTagOptions;
    const selectedTags = useMemo(() => {
        return tagNames.map((tagName) => {
            const found = tagOptions.find(
                (tag: any) => tagKey(tag) === tagKey(tagName),
            );

            return found ?? { name: tagName };
        });
    }, [tagNames, tagOptions]);
    useEffect(() => {
        if (!open || !item) return;

        setTitle(item.title || "");
        setAssignedToUserId(item.assignedToUserId || "");
        setDueAt(toDateInput(item.dueAt));
        setPriority((item.priority as TaskPriority) || TaskPriority.MEDIUM);
        setTagNames(Array.isArray(item.tags) ? item.tags.map((x: any) => x.name) : []);
        setLinkTargetType(existingType || "WATCH");
        setLinkMode(existingMode || "CONTEXT");
        setLinkTargetIds([]);
        setWorkflowPickerTag(null);
    }, [open, item, existingType, existingMode]);
    useEffect(() => {
        setLocalTagOptions(Array.isArray(task?.tagOptions) ? task.tagOptions : []);
    }, [task?.tagOptions]);
    if (!open || !item) return null;

    async function openWorkflowPicker(tag: any) {
        setWorkflowPickerTag(tag);

        if (!workflowTemplates.length) {
            setWorkflowLoading(true);
            try {
                const result = await listWorkflowTemplatesAction();
                setWorkflowTemplates(result.items ?? []);
            } finally {
                setWorkflowLoading(false);
            }
        }
    }

    async function assignWorkflow(workflowTemplateId: string | null) {
        if (!workflowPickerTag) return;

        const result = await assignWorkflowTemplateToTagAction({
            taskId: task.id,
            tagId: workflowPickerTag.id ?? null,
            tagName: workflowPickerTag.name,
            workflowTemplateId,
        });

        const updatedTag = result?.tag;

        if (updatedTag) {
            setLocalTagOptions((prev) => mergeTags(prev, [updatedTag]));
        }

        setWorkflowPickerTag(null);
    }
    function tagKey(value: any) {
        return String(value?.name ?? value ?? "").trim().toLowerCase();
    }

    function mergeTags(...groups: any[][]) {
        const map = new Map<string, any>();

        for (const group of groups) {
            for (const tag of group ?? []) {
                const key = tagKey(tag);
                if (!key) continue;

                const current = map.get(key);

                map.set(key, {
                    ...(current ?? {}),
                    ...(tag ?? {}),
                    workflowTemplate:
                        tag?.workflowTemplate ?? current?.workflowTemplate ?? null,
                    workflowTemplateId:
                        tag?.workflowTemplateId ?? current?.workflowTemplateId ?? null,
                });
            }
        }

        return Array.from(map.values());
    }
    function save() {
        startTransition(async () => {
            await onSave?.({
                itemId: item.id,
                title,
                assignedToUserId: assignedToUserId || null,
                dueAt: dueAt || null,
                priority,
                tagNames,
            });

            onClose();
        });
    }

    function unlinkExecution(executionId: string) {
        startTransition(async () => {
            await deleteTaskExecutionAction({ executionId });

            onLinked?.({
                taskItemId: item.id,
                removedExecutionId: executionId,
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
                metadataJson: { linkMode },
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
                            Cập nhật người nhận, due date và gán danh sách nghiệp vụ.
                        </p>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => onRefresh?.()}
                            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            title="Làm mới dữ liệu"
                        >
                            <RefreshCw className="h-4.5 w-4.5" />
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            title="Đóng"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="border-b border-slate-100 px-5 py-3">
                    <div className="grid gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500 sm:grid-cols-2">
                        <div>
                            <span className="text-slate-400">Ngày tạo: </span>
                            <span className="font-semibold text-slate-700">
                                {formatDateTime(item?.createdAt)}
                            </span>
                        </div>

                        {item?.assignedToUser ? (
                            <div>
                                <span className="text-slate-400">Người nhận: </span>
                                <span className="font-semibold text-slate-700">
                                    {item.assignedToUser.name || item.assignedToUser.email}
                                </span>
                            </div>
                        ) : null}

                        {createdDays !== null ? (
                            <div className="sm:col-span-2 rounded-xl bg-amber-50 px-3 py-2 text-amber-700">
                                Task item này đã được tạo {createdDays} ngày.
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-4">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Nội dung</span>
                        <input
                            value={title}
                            disabled={!canEdit}
                            onChange={(event) => setTitle(event.target.value)}
                            className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                        />
                    </label>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                            Tag
                        </label>

                        <TaskTagPicker
                            value={tagNames}
                            options={tagOptions}
                            onChange={setTagNames}
                        />

                        {selectedTags.length ? (
                            <div className="mt-2 space-y-2">
                                {selectedTags.map((tag: any) => {
                                    const workflow = tag.workflowTemplate;

                                    return (
                                        <div
                                            key={tag.id ?? tag.name}
                                            className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-slate-700">
                                                        #{tag.name}
                                                    </div>

                                                    {workflow ? (
                                                        <>
                                                            <div className="mt-1 font-semibold text-emerald-700">
                                                                Workflow: {workflow.name}
                                                            </div>

                                                            {workflow.conditions?.length ? (
                                                                <div className="mt-1 text-slate-500">
                                                                    Điều kiện:{" "}
                                                                    {workflow.conditions
                                                                        .map((x: any) => x.eventKey)
                                                                        .join(" + ")}
                                                                </div>
                                                            ) : null}

                                                            {workflow.actions?.length ? (
                                                                <div className="mt-1 text-slate-500">
                                                                    Kết quả:{" "}
                                                                    {workflow.actions
                                                                        .map((x: any) => x.actionType)
                                                                        .join(", ")}
                                                                </div>
                                                            ) : null}
                                                        </>
                                                    ) : (
                                                        <div className="mt-1 text-slate-400">
                                                            Chưa gắn workflow
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={!canEdit}
                                                    onClick={() => openWorkflowPicker(tag)}
                                                    className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:border-slate-300 disabled:opacity-50"
                                                >
                                                    {workflow ? "Đổi" : "Gắn workflow"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}
                        <TaskItemWorkflowProgress progress={item.workflowProgress} />
                    </div>

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
                            <span className="text-sm font-medium text-slate-700">
                                Priority
                            </span>
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
                                    Subtask này đã có link loại <b>{targetLabel(existingType!)}</b>.
                                    {existingMode ? (
                                        <>
                                            {" "}Mode hiện tại:{" "}
                                            <b>
                                                {existingMode === "TRACKING"
                                                    ? "Theo dõi trạng thái"
                                                    : "Chỉ gắn thông tin"}
                                            </b>.
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-3 flex items-start gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-100">
                                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <div>
                                    Chọn mode link trước khi gán. Sau khi đã có link, loại nghiệp vụ sẽ được khóa.
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
                                <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Đã link {existingExecutions.length} nghiệp vụ
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

            {workflowPickerTag ? (
                <div
                    className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/40 p-4"
                    onClick={() => setWorkflowPickerTag(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-[24px] bg-white p-5 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="text-sm font-semibold text-slate-950">
                            Gắn workflow cho tag #{workflowPickerTag.name}
                        </div>

                        <div className="mt-4 space-y-2">
                            {workflowLoading ? (
                                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-400">
                                    Đang tải workflow...
                                </div>
                            ) : workflowTemplates.length ? (
                                workflowTemplates.map((workflow: any) => (
                                    <button
                                        key={workflow.id}
                                        type="button"
                                        onClick={() => assignWorkflow(workflow.id)}
                                        className="block w-full rounded-2xl border border-slate-200 px-3 py-3 text-left hover:border-emerald-200 hover:bg-emerald-50"
                                    >
                                        <div className="text-sm font-semibold text-slate-800">
                                            {workflow.name}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                            {(workflow.conditions ?? [])
                                                .map((x: any) => x.eventKey)
                                                .join(" + ") || "Chưa có điều kiện"}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-400">
                                    Chưa có workflow template.
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={() => assignWorkflow(null)}
                                className="rounded-xl border border-rose-100 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                            >
                                Bỏ workflow
                            </button>

                            <button
                                type="button"
                                onClick={() => setWorkflowPickerTag(null)}
                                className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <BusinessEntityPreviewModal
                open={previewState.open}
                preview={previewState.preview}
                loading={previewState.loading}
                error={previewState.error}
                onClose={previewState.closePreview}
                onActivityChanged={previewState.refreshPreview}
            />
        </div>
    );
}
