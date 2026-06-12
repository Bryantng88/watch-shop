"use client";

import { useEffect, useState, useTransition } from "react";
import { X, Wrench } from "lucide-react";


import { createOrLinkServiceRequestFromTaskAction, getServiceRequestFromTaskPreviewAction, } from "../../actions/service-request-from-task.actions";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";

type Props = {
    open: boolean;
    task: any;
    onClose: () => void;
    onSaved?: () => void;
};

export default function ServiceRequestFromTaskModal({ open, task, onClose, onSaved }: Props) {
    const notify = useNotify();
    const [pending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<any>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (!open) return;

        setLoading(true);
        setPreview(null);
        setTitle(`Service Request từ task: ${task?.title ?? ""}`);
        setDescription(task?.description ?? "");

        getServiceRequestFromTaskPreviewAction(task.id)
            .then(setPreview)
            .catch((error) => notify.error(error?.message || "Không tải được dữ liệu SR"))
            .finally(() => setLoading(false));
    }, [open, task?.id]);

    function linkExisting() {
        startTransition(async () => {
            try {
                await createOrLinkServiceRequestFromTaskAction({
                    taskId: task.id,
                    mode: "LINK_EXISTING",
                });

                notify.success("Đã gán Service Request hiện có vào task");
                onSaved?.();
                onClose();
            } catch (error: any) {
                notify.error(error?.message || "Không gán được Service Request");
            }
        });
    }

    function createNew() {
        startTransition(async () => {
            try {
                await createOrLinkServiceRequestFromTaskAction({
                    taskId: task.id,
                    mode: "CREATE_NEW",
                    title,
                    description,
                });

                notify.success("Đã tạo Service Request từ task");
                onSaved?.();
                onClose();
            } catch (error: any) {
                notify.error(error?.message || "Không tạo được Service Request");
            }
        });
    }

    if (!open) return null;

    const activeSr = preview?.activeServiceRequest;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
            <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                    <div>
                        <h3 className="text-base font-semibold text-slate-950">Tạo Service Request từ task</h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Nếu watch đang có SR active, hệ thống sẽ ưu tiên gán SR đó vào task để theo dõi.
                        </p>
                    </div>

                    <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="space-y-4 px-6 py-5">
                    {loading ? (
                        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                            Đang kiểm tra Service Request active...
                        </div>
                    ) : activeSr ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                            <div className="text-sm font-semibold text-amber-900">
                                Watch này đang có Service Request active
                            </div>
                            <div className="mt-2 text-sm text-amber-800">
                                {activeSr.refNo || activeSr.id} · {activeSr.status}
                            </div>
                            <div className="mt-1 text-sm text-amber-700">
                                {activeSr.title || "Không có tiêu đề"}
                            </div>
                            <p className="mt-3 text-xs leading-5 text-amber-700">
                                Nên gán SR này vào task thay vì tạo SR mới, để tránh trùng luồng service cho cùng một watch.
                            </p>
                        </div>
                    ) : (
                        <>
                            <label className="block text-sm font-medium text-slate-700">
                                Tiêu đề SR
                                <input
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Mô tả / ghi chú
                                <textarea
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    rows={4}
                                    className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                                />
                            </label>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        Hủy
                    </button>

                    {activeSr ? (
                        <button
                            type="button"
                            onClick={linkExisting}
                            disabled={pending || loading}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
                        >
                            <Wrench className="h-4 w-4" />
                            {pending ? "Đang gán..." : "Gán SR này vào task"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={createNew}
                            disabled={pending || loading}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:bg-slate-300"
                        >
                            <Wrench className="h-4 w-4" />
                            {pending ? "Đang tạo..." : "Tạo Service Request"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}