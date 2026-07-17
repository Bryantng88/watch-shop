"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wrench, X } from "lucide-react";
import { Header } from "./TradeHistoryCard";
import {
    useAppProgress,
    type AppProgressStep,
} from "@/domains/shared/feedback/AppProgressProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { operationButtonClass } from "../shared/OperationShell";

function stringValue(value: unknown) {
    return typeof value === "string" ? value : "";
}

export default function ServiceCard({
    serviceHistory,
    productId,
    title,
    sku,
}: {
    serviceHistory?: Array<Record<string, unknown>>;
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

    const rows = Array.isArray(serviceHistory) ? serviceHistory.slice(0, 4) : [];
    const displayRows = rows.length
        ? rows
        : [{ issue: "Khong can service", status: "-", id: "empty" }];
    const cleanProductId = String(productId ?? "").trim();
    const watchLabel = title || sku || cleanProductId || "watch";

    function openServiceBoard() {
        router.push("/admin/services/operation");
    }

    async function submitServiceIntake() {
        const trimmedSuspicion = suspicion.trim();

        if (!cleanProductId) {
            setError("Watch nay chua co productId.");
            return;
        }

        if (!trimmedSuspicion) {
            setError("Vui long nhap nghi ngo ky thuat dau tien.");
            return;
        }

        if (submitting) return;

        setSubmitting(true);
        setError(null);

        let steps: AppProgressStep[] = [
            {
                id: "validate",
                label: "Kiem tra thong tin watch",
                detail: `${watchLabel} da san sang tao phieu ky thuat.`,
                status: "done",
            },
            {
                id: "create",
                label: "Tao Service Request va Technical Issue",
                detail: "Dang ghi nhan phieu ky thuat that trong Service Operation.",
                status: "running",
            },
            {
                id: "background",
                label: "Dong bo workspace va timeline",
                detail: "technical_issue.created se duoc consumer xu ly nen.",
                status: "pending",
            },
        ];

        progress.show({
            title: "Dang tao phieu ky thuat",
            message: "He thong dang tao Service Request va nghi ngo ky thuat dau tien.",
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
                throw new Error(json?.error || "Khong the tao phieu ky thuat.");
            }

            const data = json.data ?? {};
            steps = steps.map((step) =>
                step.id === "create"
                    ? { ...step, status: "done", detail: "Phieu ky thuat da duoc ghi nhan." }
                    : step.id === "background"
                      ? {
                            ...step,
                            status: "running",
                            detail: "Workspace va event dang duoc dong bo nen.",
                        }
                      : step,
            );

            progress.update({
                title: data.createdInitialIssue ? "Da tao phieu ky thuat" : "Da mo phieu ky thuat",
                message: data.workspaceHref
                    ? "Dang chuyen sang workspace xu ly."
                    : "Service Operation da nhan yeu cau.",
                steps,
            });

            notify.success({
                title: data.createdInitialIssue ? "Da tao service" : "Watch da co service",
                message: data.refNo
                    ? `SR ${data.refNo} da duoc ghi nhan.`
                    : "Service Operation da nhan phieu ky thuat.",
            });

            setIntakeOpen(false);
            setSuspicion("");

            if (data.workspaceHref) {
                router.push(data.workspaceHref);
            }
            window.setTimeout(() => progress.hide(), 900);
        } catch (err) {
            progress.hide();
            const message = err instanceof Error ? err.message : "Khong the tao phieu ky thuat.";
            setError(message);
            notify.error({
                title: "Khong the tao service",
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
                    subtitle={`${rows.length} service/TI co phat sinh chi phi`}
                />
                <div className="p-4">
                    <div className="overflow-hidden rounded-lg border border-slate-200/80">
                        <div className="grid grid-cols-[minmax(0,1fr)_80px_28px] gap-2 bg-slate-50/80 px-3 py-2.5 text-[10px] font-semibold uppercase text-slate-400">
                            <div>Service code</div>
                            <div>Trang thai</div>
                            <div>+</div>
                        </div>
                        {displayRows.map((item) => {
                            const id = stringValue(item.id) || stringValue(item.issue) || "service";

                            return (
                                <div
                                    key={id}
                                    className="grid min-h-[44px] grid-cols-[minmax(0,1fr)_80px_28px] items-center gap-2 border-t border-slate-100 px-3 py-2 text-xs"
                                >
                                    <div className="truncate text-slate-600">
                                        {stringValue(item.issue) || stringValue(item.title)}
                                    </div>
                                    <div className="truncate font-medium text-indigo-600">
                                        {stringValue(item.status) || "-"}
                                    </div>
                                    <div className="font-medium text-slate-500">2</div>
                                </div>
                            );
                        })}
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
                            {submitting ? "Dang tao..." : "Tao service"}
                        </button>
                    </div>
                </div>
            </aside>

            {intakeOpen ? (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-950/35"
                        aria-label="Dong modal tao service"
                        onClick={() => {
                            if (!submitting) setIntakeOpen(false);
                        }}
                    />
                    <div className="relative z-[1] w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-base font-semibold text-slate-950">Tao service that</div>
                                <div className="mt-1 text-sm leading-6 text-slate-500">
                                    Nhap nghi ngo ky thuat dau tien cho {watchLabel}.
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
                                Nghi ngo ky thuat
                            </span>
                            <textarea
                                value={suspicion}
                                onChange={(event) => setSuspicion(event.target.value)}
                                disabled={submitting}
                                rows={4}
                                placeholder="VD: Kiem tra may chay cham, lau dau, ve sinh tong the..."
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
                                Huy
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
                                {submitting ? "Dang tao..." : "Tao service"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
