"use client";

import React, { useMemo, useState } from "react";

type IssueRecord = {
    id: string;
    eventType?: string | null;
    notes?: string | null;
    diagnosis?: string | null;
    workSummary?: string | null;
    totalCost?: number | null;
    servicedAt?: string | null;
    createdAt?: string | null;
};

type IssueItem = {
    id: string;
    area?: string | null;
    summary?: string | null;
    note?: string | null;
    issueType?: string | null;
    actionMode?: string | null;
    executionStatus?: string | null;
    estimatedCost?: number | null;
    actualCost?: number | null;
    vendorId?: string | null;
    vendorNameSnap?: string | null;
    technicianId?: string | null;
    serviceCatalogId?: string | null;
    supplyCatalogId?: string | null;
    mechanicalPartCatalogId?: string | null;
    resolutionNote?: string | null;
    openedAt?: string | null;
    startedAt?: string | null;
    completedAt?: string | null;
    canceledAt?: string | null;
    ServiceCatalog?: { id: string; code: string; name: string } | null;
    SupplyCatalog?: { id: string; code: string; name: string } | null;
    MechanicalPartCatalog?: { id: string; code: string; name: string } | null;
    Vendor?: { id: string; name: string } | null;
    User?: { id: string; name: string | null; email: string | null } | null;
    MaintenanceRecord?: IssueRecord[];
};

function fmtMoney(v?: number | null) {
    if (v == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(v)) + " đ";
}

function fmtDate(v?: string | null) {
    if (!v) return "-";
    try {
        return new Date(v).toLocaleString("vi-VN");
    } catch {
        return v;
    }
}

function badgeClass(status?: string | null) {
    const s = String(status ?? "").toUpperCase();
    if (s === "DONE") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "IN_PROGRESS") return "bg-blue-50 text-blue-700 border-blue-200";
    if (s === "CANCELED") return "bg-slate-100 text-slate-500 border-slate-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
}

async function api(method: string, url: string, body?: any) {
    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(json?.error ?? "Request failed");
    }
    return json;
}

function ReadonlyRow({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-0.5">
            <div className="text-[11px] uppercase tracking-wide text-slate-400">
                {label}
            </div>
            <div className="text-sm text-slate-700">{value}</div>
        </div>
    );
}

function FormDialog({
    open,
    title,
    onClose,
    children,
    footer,
}: {
    open: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    footer: React.ReactNode;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 p-4">
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative z-[1201] w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
                <div className="text-lg font-semibold text-slate-950">{title}</div>
                <div className="mt-4 space-y-4">{children}</div>
                <div className="mt-5 flex justify-end gap-2">{footer}</div>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <div className="text-sm font-medium text-slate-700">{label}</div>
            {children}
        </div>
    );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
        />
    );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className="min-h-[96px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
        />
    );
}

export default function TechnicalIssuesPanel({
    issues,
    catalogs,
    onChanged,
}: {
    issues: IssueItem[];
    catalogs?: any;
    onChanged?: () => void;
}) {
    const [busyId, setBusyId] = useState<string | null>(null);
    const [editingIssue, setEditingIssue] = useState<IssueItem | null>(null);
    const [completeIssue, setCompleteIssue] = useState<IssueItem | null>(null);
    const [recordIssue, setRecordIssue] = useState<IssueItem | null>(null);
    const [cancelIssue, setCancelIssue] = useState<IssueItem | null>(null);

    const [editForm, setEditForm] = useState({
        note: "",
        summary: "",
        estimatedCost: "",
    });

    const [completeForm, setCompleteForm] = useState({
        resolutionNote: "",
        actualCost: "",
    });

    const [recordForm, setRecordForm] = useState({
        notes: "",
        diagnosis: "",
        workSummary: "",
        totalCost: "",
    });

    const [cancelForm, setCancelForm] = useState({
        reason: "",
    });

    const stats = useMemo(() => {
        const open = issues.filter((x) => {
            const s = String(x.executionStatus ?? "").toUpperCase();
            return s === "OPEN" || s === "IN_PROGRESS";
        }).length;
        return { total: issues.length, open };
    }, [issues]);

    const run = async (id: string, fn: () => Promise<any>) => {
        try {
            setBusyId(id);
            await fn();
            onChanged?.();
        } catch (e: any) {
            alert(e?.message ?? "Thao tác thất bại");
        } finally {
            setBusyId(null);
        }
    };

    const handleStart = async (id: string) => {
        await run(id, () => api("POST", `/api/admin/technical-issues/${id}/start`, {}));
    };

    function openEdit(issue: IssueItem) {
        setEditingIssue(issue);
        setEditForm({
            note: issue.note ?? "",
            summary: issue.summary ?? "",
            estimatedCost:
                issue.estimatedCost != null ? String(issue.estimatedCost) : "",
        });
    }

    function openComplete(issue: IssueItem) {
        setCompleteIssue(issue);
        setCompleteForm({
            resolutionNote: issue.resolutionNote ?? "",
            actualCost: issue.actualCost != null ? String(issue.actualCost) : "",
        });
    }

    function openRecord(issue: IssueItem) {
        setRecordIssue(issue);
        setRecordForm({
            notes: "",
            diagnosis: "",
            workSummary: "",
            totalCost: "",
        });
    }

    function openCancel(issue: IssueItem) {
        setCancelIssue(issue);
        setCancelForm({
            reason: issue.resolutionNote ?? "",
        });
    }

    async function submitEdit() {
        if (!editingIssue) return;
        const estimatedCost =
            editForm.estimatedCost.trim() === ""
                ? null
                : Number(editForm.estimatedCost);

        await run(editingIssue.id, () =>
            api("PATCH", `/api/admin/technical-issues/${editingIssue.id}`, {
                note: editForm.note,
                summary: editForm.summary,
                estimatedCost,
            })
        );
        setEditingIssue(null);
    }

    async function submitComplete() {
        if (!completeIssue) return;
        const actualCost =
            completeForm.actualCost.trim() === ""
                ? null
                : Number(completeForm.actualCost);

        await run(completeIssue.id, () =>
            api("POST", `/api/admin/technical-issues/${completeIssue.id}/complete`, {
                resolutionNote: completeForm.resolutionNote,
                actualCost,
            })
        );
        setCompleteIssue(null);
    }

    async function submitRecord() {
        if (!recordIssue) return;
        const totalCost =
            recordForm.totalCost.trim() === ""
                ? null
                : Number(recordForm.totalCost);

        await run(recordIssue.id, () =>
            api("POST", `/api/admin/service-requests/technical-issue-record`, {
                id: recordIssue.id,
                notes: recordForm.notes,
                diagnosis: recordForm.diagnosis,
                workSummary: recordForm.workSummary,
                totalCost,
            })
        );
        setRecordIssue(null);
    }

    async function submitCancel() {
        if (!cancelIssue) return;
        await run(cancelIssue.id, () =>
            api("POST", `/api/admin/technical-issues/${cancelIssue.id}/cancel`, {
                reason: cancelForm.reason,
            })
        );
        setCancelIssue(null);
    }

    const handleDelete = async (id: string) => {
        const ok = window.confirm("Xóa nghiệp vụ kỹ thuật này?");
        if (!ok) return;
        await run(id, () => api("DELETE", `/api/admin/technical-issues/${id}`));
    };

    if (!issues.length) {
        return (
            <div className="rounded-xl border border-dashed px-4 py-6 text-sm text-slate-500">
                Không có nghiệp vụ kỹ thuật nào đang mở. Nếu assessment không mở issue nào thì service request có thể hoàn tất luôn.
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{stats.total} nghiệp vụ</span>
                    <span>{stats.open} đang mở</span>
                </div>

                {issues.map((issue, idx) => {
                    const status = String(issue.executionStatus ?? "OPEN").toUpperCase();
                    const disabled = busyId === issue.id;

                    return (
                        <div
                            key={issue.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="text-sm font-semibold text-slate-900">
                                                #{idx + 1} · {issue.area || "ISSUE"}
                                            </div>

                                            <span
                                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${badgeClass(
                                                    status
                                                )}`}
                                            >
                                                {status}
                                            </span>

                                            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] text-slate-600">
                                                {issue.actionMode || "-"}
                                            </span>

                                            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] text-slate-600">
                                                {issue.issueType || "-"}
                                            </span>
                                        </div>

                                        <div className="mt-2 text-sm text-slate-800">
                                            {issue.summary || issue.note || "Nghiệp vụ kỹ thuật"}
                                        </div>

                                        {issue.note &&
                                            issue.summary &&
                                            issue.note !== issue.summary && (
                                                <div className="mt-1 text-sm text-slate-600">
                                                    {issue.note}
                                                </div>
                                            )}
                                    </div>

                                    <div className="flex flex-wrap gap-2 md:justify-end">
                                        {status === "OPEN" && (
                                            <button
                                                disabled={disabled}
                                                onClick={() => handleStart(issue.id)}
                                                className="rounded-lg border px-3 py-1.5 text-xs hover:bg-slate-50 disabled:opacity-60"
                                            >
                                                Bắt đầu
                                            </button>
                                        )}

                                        {(status === "OPEN" ||
                                            status === "IN_PROGRESS") && (
                                                <button
                                                    disabled={disabled}
                                                    onClick={() => openEdit(issue)}
                                                    className="rounded-lg border px-3 py-1.5 text-xs hover:bg-slate-50 disabled:opacity-60"
                                                >
                                                    Cập nhật
                                                </button>
                                            )}

                                        {status === "IN_PROGRESS" && (
                                            <button
                                                disabled={disabled}
                                                onClick={() => openRecord(issue)}
                                                className="rounded-lg border px-3 py-1.5 text-xs hover:bg-slate-50 disabled:opacity-60"
                                            >
                                                Thêm record
                                            </button>
                                        )}

                                        {status === "IN_PROGRESS" && (
                                            <button
                                                disabled={disabled}
                                                onClick={() => openComplete(issue)}
                                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-700 disabled:opacity-60"
                                            >
                                                Hoàn tất
                                            </button>
                                        )}

                                        {(status === "OPEN" ||
                                            status === "IN_PROGRESS") && (
                                                <button
                                                    disabled={disabled}
                                                    onClick={() => openCancel(issue)}
                                                    className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                                                >
                                                    Hủy
                                                </button>
                                            )}

                                        {status === "OPEN" && (
                                            <button
                                                disabled={disabled}
                                                onClick={() => handleDelete(issue.id)}
                                                className="rounded-lg border px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-60"
                                            >
                                                Xóa
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-3 md:grid-cols-3">
                                    <ReadonlyRow
                                        label="Vendor"
                                        value={
                                            issue.Vendor?.name ||
                                            issue.vendorNameSnap ||
                                            "-"
                                        }
                                    />
                                    <ReadonlyRow
                                        label="Người xử lý"
                                        value={
                                            issue.User?.name ||
                                            issue.User?.email ||
                                            "-"
                                        }
                                    />
                                    <ReadonlyRow
                                        label="Dự kiến"
                                        value={fmtMoney(issue.estimatedCost)}
                                    />
                                    <ReadonlyRow
                                        label="Thực tế"
                                        value={fmtMoney(issue.actualCost)}
                                    />
                                    <ReadonlyRow
                                        label="Service catalog"
                                        value={
                                            issue.ServiceCatalog
                                                ? `${issue.ServiceCatalog.code} · ${issue.ServiceCatalog.name}`
                                                : "-"
                                        }
                                    />
                                    <ReadonlyRow
                                        label="Part"
                                        value={
                                            issue.MechanicalPartCatalog
                                                ? `${issue.MechanicalPartCatalog.code} · ${issue.MechanicalPartCatalog.name}`
                                                : "-"
                                        }
                                    />
                                    <ReadonlyRow
                                        label="Mở lúc"
                                        value={fmtDate(issue.openedAt)}
                                    />
                                    <ReadonlyRow
                                        label="Bắt đầu"
                                        value={fmtDate(issue.startedAt)}
                                    />
                                    <ReadonlyRow
                                        label="Hoàn tất"
                                        value={fmtDate(issue.completedAt)}
                                    />
                                </div>

                                {!!issue.MaintenanceRecord?.length && (
                                    <div className="rounded-xl bg-slate-50 p-3">
                                        <div className="mb-2 text-xs font-medium text-slate-600">
                                            Nhật ký của nghiệp vụ
                                        </div>

                                        <div className="space-y-2">
                                            {issue.MaintenanceRecord.map((r) => (
                                                <div
                                                    key={r.id}
                                                    className="rounded-lg border bg-white px-3 py-2 text-xs text-slate-600"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="font-medium text-slate-800">
                                                            {r.eventType || "NOTE"}
                                                        </div>
                                                        <div className="text-[11px] text-slate-400">
                                                            {fmtDate(
                                                                r.servicedAt || r.createdAt
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mt-1 whitespace-pre-wrap">
                                                        {r.notes ||
                                                            r.workSummary ||
                                                            r.diagnosis ||
                                                            "-"}
                                                    </div>

                                                    {r.totalCost != null && (
                                                        <div className="mt-1 text-[11px] text-slate-500">
                                                            Chi phí: {fmtMoney(r.totalCost)}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <FormDialog
                open={!!editingIssue}
                title="Cập nhật nghiệp vụ"
                onClose={() => setEditingIssue(null)}
                footer={
                    <>
                        <button
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                            onClick={() => setEditingIssue(null)}
                        >
                            Hủy
                        </button>
                        <button
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
                            onClick={submitEdit}
                        >
                            Lưu cập nhật
                        </button>
                    </>
                }
            >
                <Field label="Tóm tắt">
                    <TextInput
                        value={editForm.summary}
                        onChange={(e) =>
                            setEditForm((p) => ({ ...p, summary: e.target.value }))
                        }
                    />
                </Field>
                <Field label="Ghi chú">
                    <TextArea
                        value={editForm.note}
                        onChange={(e) =>
                            setEditForm((p) => ({ ...p, note: e.target.value }))
                        }
                    />
                </Field>
                <Field label="Chi phí dự kiến">
                    <TextInput
                        inputMode="numeric"
                        value={editForm.estimatedCost}
                        onChange={(e) =>
                            setEditForm((p) => ({
                                ...p,
                                estimatedCost: e.target.value,
                            }))
                        }
                    />
                </Field>
            </FormDialog>

            <FormDialog
                open={!!recordIssue}
                title="Thêm record xử lý"
                onClose={() => setRecordIssue(null)}
                footer={
                    <>
                        <button
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                            onClick={() => setRecordIssue(null)}
                        >
                            Hủy
                        </button>
                        <button
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
                            onClick={submitRecord}
                        >
                            Lưu record
                        </button>
                    </>
                }
            >
                <Field label="Nhật ký xử lý">
                    <TextArea
                        value={recordForm.notes}
                        onChange={(e) =>
                            setRecordForm((p) => ({ ...p, notes: e.target.value }))
                        }
                    />
                </Field>
                <Field label="Chẩn đoán">
                    <TextArea
                        value={recordForm.diagnosis}
                        onChange={(e) =>
                            setRecordForm((p) => ({
                                ...p,
                                diagnosis: e.target.value,
                            }))
                        }
                    />
                </Field>
                <Field label="Nội dung thực hiện">
                    <TextArea
                        value={recordForm.workSummary}
                        onChange={(e) =>
                            setRecordForm((p) => ({
                                ...p,
                                workSummary: e.target.value,
                            }))
                        }
                    />
                </Field>
                <Field label="Chi phí phát sinh">
                    <TextInput
                        inputMode="numeric"
                        value={recordForm.totalCost}
                        onChange={(e) =>
                            setRecordForm((p) => ({
                                ...p,
                                totalCost: e.target.value,
                            }))
                        }
                    />
                </Field>
            </FormDialog>

            <FormDialog
                open={!!completeIssue}
                title="Hoàn tất nghiệp vụ"
                onClose={() => setCompleteIssue(null)}
                footer={
                    <>
                        <button
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                            onClick={() => setCompleteIssue(null)}
                        >
                            Hủy
                        </button>
                        <button
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white"
                            onClick={submitComplete}
                        >
                            Hoàn tất
                        </button>
                    </>
                }
            >
                <Field label="Kết luận xử lý">
                    <TextArea
                        value={completeForm.resolutionNote}
                        onChange={(e) =>
                            setCompleteForm((p) => ({
                                ...p,
                                resolutionNote: e.target.value,
                            }))
                        }
                    />
                </Field>
                <Field label="Chi phí thực tế">
                    <TextInput
                        inputMode="numeric"
                        value={completeForm.actualCost}
                        onChange={(e) =>
                            setCompleteForm((p) => ({
                                ...p,
                                actualCost: e.target.value,
                            }))
                        }
                    />
                </Field>
            </FormDialog>

            <FormDialog
                open={!!cancelIssue}
                title="Hủy nghiệp vụ"
                onClose={() => setCancelIssue(null)}
                footer={
                    <>
                        <button
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                            onClick={() => setCancelIssue(null)}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            className="rounded-xl bg-rose-600 px-4 py-2 text-sm text-white"
                            onClick={submitCancel}
                        >
                            Xác nhận hủy
                        </button>
                    </>
                }
            >
                <Field label="Lý do hủy">
                    <TextArea
                        value={cancelForm.reason}
                        onChange={(e) =>
                            setCancelForm((p) => ({
                                ...p,
                                reason: e.target.value,
                            }))
                        }
                    />
                </Field>
            </FormDialog>
        </>
    );
}