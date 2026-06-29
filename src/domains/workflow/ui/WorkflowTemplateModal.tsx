"use client";

import { useEffect, useState } from "react";
import {
    WorkflowActionType,
    WorkflowConditionStrategy,
    WorkflowTemplateStatus,
} from "@prisma/client";
import { X, Plus, Trash2 } from "lucide-react";
import {
    BUSINESS_EVENTS,
    getBusinessEventDefinition,
} from "@/domains/event/registry/business-event-registry";
import { WORKFLOW_ACTIONS } from "../server/workflow.registry";


export default function WorkflowTemplateModal({
    open,
    workflow,
    pending,
    onClose,
    onSave,
}: {
    open: boolean;
    workflow?: any | null;
    pending?: boolean;
    onClose: () => void;
    onSave: (input: any) => Promise<void> | void;
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<WorkflowTemplateStatus>(
        WorkflowTemplateStatus.ACTIVE,
    );
    const [strategy, setStrategy] = useState<WorkflowConditionStrategy>(
        WorkflowConditionStrategy.ALL,
    );
    const [conditions, setConditions] = useState<any[]>([]);
    const [actions, setActions] = useState<any[]>([
        { actionType: WorkflowActionType.COMPLETE_TASK_ITEM },
    ]);

    useEffect(() => {
        if (!open) return;

        setName(workflow?.name ?? "");
        setDescription(workflow?.description ?? "");
        setStatus(workflow?.status ?? WorkflowTemplateStatus.ACTIVE);
        setStrategy(workflow?.strategy ?? WorkflowConditionStrategy.ALL);
        setConditions(
            workflow?.conditions?.length
                ? workflow.conditions.map((x: any) => ({
                    eventKey: x.eventKey,
                    targetType: x.targetType ?? null,
                }))
                : [],
        );
        setActions(
            workflow?.actions?.length
                ? workflow.actions.map((x: any) => ({ actionType: x.actionType }))
                : [{ actionType: WorkflowActionType.COMPLETE_TASK_ITEM }],
        );
    }, [open, workflow]);

    if (!open) return null;

    function addCondition() {
        const first = BUSINESS_EVENTS[0];

        setConditions((prev) => [
            ...prev,
            {
                eventKey: first.key,
                targetType: first.targetType,
                configJson: {},
            },
        ]);
    }
    function updateCondition(index: number, eventKey: string) {
        const event = getBusinessEventDefinition(eventKey);

        setConditions((prev) =>
            prev.map((row, idx) =>
                idx === index
                    ? {
                        ...row,
                        eventKey,
                        targetType: event?.targetType ?? null,
                        configJson: {},
                    }
                    : row,
            ),
        );
    }
    function submit() {
        onSave({
            id: workflow?.id ?? null,
            name,
            description,
            status,
            strategy,
            conditions,
            actions,
        });
    }

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-950">
                            {workflow?.id ? "Sửa workflow" : "Tạo workflow"}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Cấu hình điều kiện và action tự động.
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

                <div className="max-h-[72vh] space-y-4 overflow-y-auto px-5 py-4">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Tên workflow</span>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                            placeholder="Ví dụ: Duyệt bài"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-700">Mô tả</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 min-h-20 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                            placeholder="Mô tả ngắn workflow này dùng để làm gì..."
                        />
                    </label>

                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Trạng thái</span>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as WorkflowTemplateStatus)}
                                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                            >
                                <option value={WorkflowTemplateStatus.ACTIVE}>Active</option>
                                <option value={WorkflowTemplateStatus.INACTIVE}>Inactive</option>
                                <option value={WorkflowTemplateStatus.ARCHIVED}>Archived</option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-slate-700">Strategy</span>
                            <select
                                value={strategy}
                                onChange={(e) =>
                                    setStrategy(e.target.value as WorkflowConditionStrategy)
                                }
                                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                            >
                                <option value={WorkflowConditionStrategy.ALL}>
                                    ALL - tất cả điều kiện
                                </option>
                                <option value={WorkflowConditionStrategy.ANY}>
                                    ANY - một điều kiện
                                </option>
                            </select>
                        </label>
                    </div>

                    <section className="rounded-3xl border border-slate-200 bg-slate-50/60 p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-semibold text-slate-800">
                                    Conditions
                                </div>
                                <div className="text-xs text-slate-500">
                                    Event nào xảy ra thì workflow được evaluate.
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={addCondition}
                                className="inline-flex h-9 items-center gap-2 rounded-full bg-slate-950 px-3 text-sm font-semibold text-white"
                            >
                                <Plus className="h-4 w-4" />
                                Thêm
                            </button>
                        </div>

                        <div className="space-y-2">
                            {conditions.map((condition, index) => (
                                <div key={index} className="flex gap-2">
                                    <select
                                        value={condition.eventKey}
                                        onChange={(e) => updateCondition(index, e.target.value)}
                                        className="h-10 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                                    >
                                        {BUSINESS_EVENTS.map((event) => (
                                            <option key={event.key} value={event.key}>
                                                {event.label}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setConditions((prev) => prev.filter((_, idx) => idx !== index))
                                        }
                                        className="h-10 w-10 rounded-2xl text-rose-500 hover:bg-rose-50"
                                    >
                                        <Trash2 className="mx-auto h-4 w-4" />
                                    </button>
                                </div>
                            ))}

                            {!conditions.length ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-3 text-sm text-slate-400">
                                    Chưa có điều kiện.
                                </div>
                            ) : null}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-slate-50/60 p-4">
                        <div className="text-sm font-semibold text-slate-800">Actions</div>

                        <div className="mt-3 space-y-2">
                            {actions.map((action, index) => (
                                <select
                                    key={index}
                                    value={action.actionType}
                                    onChange={(e) =>
                                        setActions((prev) =>
                                            prev.map((row, idx) =>
                                                idx === index ? { ...row, actionType: e.target.value } : row,
                                            ),
                                        )
                                    }
                                    className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
                                >
                                    {WORKFLOW_ACTIONS.map((item) => (
                                        <option key={item.key} value={item.key}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                    >
                        Đóng
                    </button>

                    <button
                        type="button"
                        disabled={pending || !name.trim()}
                        onClick={submit}
                        className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                    >
                        {pending ? "Đang lưu..." : "Lưu workflow"}
                    </button>
                </div>
            </div>
        </div>
    );
}