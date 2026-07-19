"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2, Wrench, X } from "lucide-react";
import { Header } from "./TradeHistoryCard";
import {
    useAppProgress,
    type AppProgressStep,
} from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { operationButtonClass } from "../shared/OperationShell";
import type { WatchServiceProjection } from "@/domains/watch/shared/watch-detail.projection";

export default function ServiceCard({
    projection,
    productId,
    title,
    sku,
}: {
    projection: WatchServiceProjection;
    productId?: string | null;
    title?: string | null;
    sku?: string | null;
}) {
    const router = useRouter();
    const progress = useAppProgress();
    const notify = useNotify();
    const [intakeOpen, setIntakeOpen] = useState(false);
    const [suspicion, setSuspicion] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const rows = projection.requests.slice(0, 4);
    const cleanProductId = String(productId ?? "").trim();
    const watchLabel = title || sku || cleanProductId || "watch";

    function openServiceBoard() {
        router.push("/admin/services/operation");
    }

    async function submitServiceIntake() {
        const trimmedSuspicion = suspicion.trim();

        if (!cleanProductId) {
            setError("Watch này chưa có productId.");
            return;
        }

        if (!trimmedSuspicion) {
            setError("Vui lòng nhập nghi ngờ kỹ thuật đầu tiên.");
            return;
        }

        if (submitting) return;

        setSubmitting(true);
        setError(null);

        let steps: AppProgressStep[] = [
            {
                id: "validate",
                label: "Kiểm tra thông tin watch",
                detail: `${watchLabel} đã sẵn sàng tạo phiếu kỹ thuật.`,
                status: "done",
            },
            {
                id: "create",
                label: "Tạo Service Request và Technical Issue",
                detail: "Đang ghi nhận phiếu kỹ thuật trong Service Operation.",
                status: "running",
            },
            {
                id: "background",
                label: "Đồng bộ workspace và timeline",
                detail: "technical_issue.created sẽ được consumer xử lý nền.",
                status: "pending",
            },
            {
                id: "projection",
                label: "Làm mới Watch Detail projection",
                detail: "Service card sẽ đọc lại Service Request và Technical Issue vừa tạo.",
                status: "pending",
            },
        ];

        progress.show({
            title: "Đang tạo phiếu kỹ thuật",
            message: "Hệ thống đang tạo Service Request và nghi ngờ kỹ thuật đầu tiên.",
            steps,
        });

        try {
            const res = await fetch("/api/admin/service-operation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    action: "watch_intake_with_suspicion",
                    productId: cleanProductId,
                    suspicion: trimmedSuspicion,
                    openExisting: false,
                }),
            });

            const json = await res.json().catch(() => null);
            if (!res.ok || !json?.ok) {
                throw new Error(json?.error || "Không thể tạo phiếu kỹ thuật.");
            }

            const data = json.data ?? {};
            steps = steps.map((step) =>
                step.id === "create"
                    ? { ...step, status: "done", detail: "Phiếu kỹ thuật đã được ghi nhận." }
                    : step.id === "background"
                      ? {
                            ...step,
                            status: "done",
                            detail: "Event đã được xếp hàng để đồng bộ workspace và timeline.",
                        }
                      : step.id === "projection"
                        ? {
                              ...step,
                              status: "running",
                              detail: "Đang đọc lại projection Service của Watch Detail.",
                          }
                      : step,
            );

            progress.update({
                title: data.createdInitialIssue ? "Đã tạo phiếu kỹ thuật" : "Đã mở phiếu kỹ thuật",
                message: data.workspaceHref
                    ? "Đang chuyển sang workspace xử lý."
                    : "Đang đồng bộ lại Service card trên Watch Detail.",
                steps,
            });

            notify.success({
                title: data.createdInitialIssue ? "Đã tạo service" : "Watch đã có service",
                message: data.refNo
                    ? `SR ${data.refNo} đã được ghi nhận.`
                    : "Service Operation đã nhận phiếu kỹ thuật.",
            });

            setIntakeOpen(false);
            setSuspicion("");

            if (data.workspaceHref) {
                router.push(data.workspaceHref);
            } else {
                router.refresh();
            }
            window.setTimeout(() => {
                const completedSteps = steps.map((step) =>
                    step.id === "projection"
                        ? {
                              ...step,
                              status: "done" as const,
                              detail: "Đã yêu cầu Watch Detail đọc lại dữ liệu Service mới.",
                          }
                        : step,
                );
                progress.update({
                    title: "Đã gửi yêu cầu đồng bộ Service",
                    message: data.workspaceHref
                        ? "Workspace đã sẵn sàng. Watch Detail sẽ đọc projection mới khi quay lại."
                        : "Service card đang được làm mới từ projection.",
                    steps: completedSteps,
                });
                window.setTimeout(() => progress.hide(), 700);
            }, 650);
        } catch (err) {
            progress.hide();
            const message = err instanceof Error ? err.message : "Không thể tạo phiếu kỹ thuật.";
            setError(message);
            notify.error({
                title: "Không thể tạo service",
                message,
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <aside className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.045)]">
                <Header
                    icon={<Wrench className="h-4 w-4" />}
                    title="Service"
                    subtitle={`${projection.activeRequestCount} SR active · ${projection.activeIssueCount} TI active`}
                />
                <div className="p-4">
                    <div className="overflow-hidden rounded-lg border border-slate-200/80">
                        <div className="grid grid-cols-[minmax(0,1fr)_80px_28px] gap-2 bg-slate-50/80 px-3 py-2.5 text-[10px] font-semibold uppercase text-slate-400">
                            <div>Service code</div>
                            <div>Trạng thái</div>
                            <div>+</div>
                        </div>
                        {rows.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid min-h-[44px] grid-cols-[minmax(0,1fr)_80px_28px] items-center gap-2 border-t border-slate-100 px-3 py-2 text-xs"
                                >
                                    {item.workspaceHref ? (
                                        <button
                                            type="button"
                                            onClick={() => router.push(item.workspaceHref!)}
                                            className="truncate text-left text-slate-600 hover:text-violet-700"
                                        >
                                            {item.refNo}
                                        </button>
                                    ) : (
                                        <div className="truncate text-slate-600">{item.refNo}</div>
                                    )}
                                    <div className="truncate font-medium text-indigo-600">
                                        {item.status}
                                    </div>
                                    <div className="font-medium text-slate-500">{item.issueCount}</div>
                                </div>
                        ))}
                        {!rows.length ? (
                            <div className="border-t border-slate-100 px-3 py-4 text-xs text-slate-400">
                                Chưa có Service Request.
                            </div>
                        ) : null}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={openServiceBoard}
                            className={operationButtonClass({
                                variant: "softEmerald",
                                size: "sm",
                                className: "text-xs",
                            })}
                        >
                            Xem service board
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setError(null);
                                setIntakeOpen(true);
                            }}
                            disabled={!cleanProductId || submitting}
                            className={operationButtonClass({
                                variant: "secondary",
                                size: "sm",
                                className: "text-xs disabled:opacity-60",
                            })}
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            {submitting ? "Đang tạo..." : "Tạo service"}
                        </button>
                    </div>
                </div>
            </aside>

            {intakeOpen && typeof document !== "undefined" ? createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/35"
                        aria-label="Đóng modal tạo service"
                        onClick={() => {
                            if (!submitting) setIntakeOpen(false);
                        }}
                    />
                    <div className="relative z-[1] w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-base font-semibold text-slate-950">Tạo service</div>
                                <div className="mt-1 text-sm leading-6 text-slate-500">
                                    Nhập nghi ngờ kỹ thuật đầu tiên cho {watchLabel}.
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIntakeOpen(false)}
                                disabled={submitting}
                                className={operationButtonClass({
                                    variant: "ghost",
                                    size: "xs",
                                    className: "w-8 px-0",
                                })}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <label className="mt-4 block">
                            <span className="mb-1.5 block text-[11px] font-semibold uppercase text-slate-500">
                                Nghi ngờ kỹ thuật
                            </span>
                            <textarea
                                value={suspicion}
                                onChange={(event) => setSuspicion(event.target.value)}
                                disabled={submitting}
                                rows={4}
                                placeholder="VD: Kiểm tra máy chạy chậm, lau dầu, vệ sinh tổng thể..."
                                className="w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400"
                            />
                        </label>

                        {error ? (
                            <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                                {error}
                            </div>
                        ) : null}

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIntakeOpen(false)}
                                disabled={submitting}
                                className={operationButtonClass({ variant: "secondary", size: "sm" })}
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={submitServiceIntake}
                                disabled={submitting || !suspicion.trim()}
                                className={operationButtonClass({
                                    variant: "primary",
                                    size: "sm",
                                    className: "disabled:opacity-60",
                                })}
                            >
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                {submitting ? "Đang tạo..." : "Tạo service"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body,
            ) : null}
        </>
    );
}
