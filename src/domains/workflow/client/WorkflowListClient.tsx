"use client";

import { useState, useTransition } from "react";
import { Plus, Settings2, Trash2 } from "lucide-react";
import {
    deleteWorkflowTemplateAction,
    saveWorkflowTemplateAction,
} from "../actions/workflow.actions";
import WorkflowTemplateModal from "../ui/WorkflowTemplateModal";

export default function WorkflowListClient({ items = [] }: { items: any[] }) {
    const [localItems, setLocalItems] = useState<any[]>(items);
    const [editing, setEditing] = useState<any | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    function openCreate() {
        setEditing(null);
        setModalOpen(true);
    }

    function openEdit(item: any) {
        setEditing(item);
        setModalOpen(true);
    }

    function save(input: any) {
        startTransition(async () => {
            const result = await saveWorkflowTemplateAction(input);
            const workflow = result.workflow;

            setLocalItems((prev) => {
                const exists = prev.some((x) => x.id === workflow.id);
                if (exists) return prev.map((x) => (x.id === workflow.id ? workflow : x));
                return [workflow, ...prev];
            });

            setModalOpen(false);
            setEditing(null);
        });
    }

    function remove(item: any) {
        if (!window.confirm(`Xóa workflow "${item.name}"?`)) return;

        startTransition(async () => {
            await deleteWorkflowTemplateAction(item.id);
            setLocalItems((prev) => prev.filter((x) => x.id !== item.id));
        });
    }

    return (
        <div className="mx-auto w-full max-w-[1360px] space-y-5 px-4 py-6 lg:px-5 xl:px-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-950">
                        Workflow Templates
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Quản trị điều kiện và action tự động cho toàn hệ thống.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex h-10 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Tạo workflow
                </button>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-[minmax(0,1fr)_120px_120px_120px_100px] border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <div>Workflow</div>
                    <div>Strategy</div>
                    <div>Điều kiện</div>
                    <div>Đang dùng</div>
                    <div className="text-right">Action</div>
                </div>

                {localItems.map((item) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-[minmax(0,1fr)_120px_120px_120px_100px] items-center border-b border-slate-100 px-4 py-4 last:border-b-0"
                    >
                        <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-950">
                                {item.name}
                            </div>
                            <div className="mt-1 truncate text-xs text-slate-500">
                                {item.description || "Không có mô tả"}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {(item.conditions ?? []).map((condition: any) => (
                                    <span
                                        key={condition.id ?? condition.eventKey}
                                        className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600"
                                    >
                                        {condition.eventKey}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="text-sm font-semibold text-slate-700">
                            {item.strategy}
                        </div>

                        <div className="text-sm text-slate-600">
                            {item.conditions?.length ?? 0}
                        </div>

                        <div className="text-sm text-slate-600">
                            {item._count?.tags ?? 0} tag
                        </div>

                        <div className="flex justify-end gap-1">
                            <button
                                type="button"
                                onClick={() => openEdit(item)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                                title="Sửa"
                            >
                                <Settings2 className="h-4 w-4" />
                            </button>

                            <button
                                type="button"
                                disabled={pending}
                                onClick={() => remove(item)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-rose-500 hover:bg-rose-50 disabled:opacity-40"
                                title="Xóa"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {!localItems.length ? (
                    <div className="px-4 py-10 text-center text-sm text-slate-400">
                        Chưa có workflow template.
                    </div>
                ) : null}
            </div>

            <WorkflowTemplateModal
                open={modalOpen}
                workflow={editing}
                pending={pending}
                onClose={() => {
                    setModalOpen(false);
                    setEditing(null);
                }}
                onSave={save}
            />
        </div>
    );
}