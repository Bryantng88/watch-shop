"use client";

import * as React from "react";

function fmtMoney(v?: number | null) {
    if (v == null) return "-";
    return new Intl.NumberFormat("vi-VN").format(Number(v)) + "đ";
}

function fmtDate(v?: string | null) {
    if (!v) return "-";
    try {
        return new Date(v).toLocaleString("vi-VN");
    } catch {
        return v;
    }
}

function buildSuggestions(assessment: any, issues: any[]) {
    const items: any[] = [];

    if (String(assessment?.movementStatus || "").toUpperCase() === "ISSUE") {
        items.push({
            area: "MOVEMENT",
            summary: "Kiểm tra và xử lý bộ máy",
            issueType: "CHECK",
            actionMode: "INTERNAL",
        });
    }

    if (String(assessment?.caseStatus || "").toUpperCase() === "ISSUE") {
        items.push({
            area: "CASE",
            summary: "Xử lý ngoại hình phần vỏ",
            issueType: "REPAIR",
            actionMode: "INTERNAL",
        });
    }

    if (String(assessment?.crystalStatus || "").toUpperCase() === "ISSUE") {
        items.push({
            area: "CRYSTAL",
            summary: "Kiểm tra / thay kính",
            issueType: "REPLACE",
            actionMode: "INTERNAL",
        });
    }

    if (String(assessment?.crownStatus || "").toUpperCase() === "ISSUE") {
        items.push({
            area: "CROWN",
            summary: "Kiểm tra / xử lý núm",
            issueType: "REPAIR",
            actionMode: "INTERNAL",
        });
    }

    const existed = new Set(
        (issues || []).map((x: any) => `${x.area}__${x.summary}`)
    );

    return items.filter((x) => !existed.has(`${x.area}__${x.summary}`));
}

export default function TechnicalIssuesInlineWorkbench({
    assessmentId,
    serviceRequestId,
    assessment,
    initialIssues,
    catalogs,
    onChanged,
}: {
    assessmentId: string;
    serviceRequestId: string;
    assessment: any;
    initialIssues: any[];
    catalogs: any;
    onChanged: () => Promise<void> | void;
}) {
    const [saving, setSaving] = React.useState(false);
    const [issues, setIssues] = React.useState<any[]>(initialIssues || []);
    const [form, setForm] = React.useState({
        summary: "",
        note: "",
        area: "MOVEMENT",
        issueType: "CHECK",
        actionMode: "INTERNAL",
        vendorId: "",
        serviceCatalogId: "",
        supplyCatalogId: "",
        mechanicalPartCatalogId: "",
        estimatedCost: "",
    });

    React.useEffect(() => {
        setIssues(initialIssues || []);
    }, [initialIssues]);

    const suggestions = React.useMemo(
        () => buildSuggestions(assessment, issues),
        [assessment, issues]
    );

    async function refresh() {
        await onChanged?.();
    }

    async function createIssue(payload: any) {
        try {
            setSaving(true);

            const res = await fetch("/api/admin/technical-issues", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    assessmentId,
                    serviceRequestId,
                    ...payload,
                    vendorId: payload.vendorId || null,
                    serviceCatalogId: payload.serviceCatalogId || null,
                    supplyCatalogId: payload.supplyCatalogId || null,
                    mechanicalPartCatalogId: payload.mechanicalPartCatalogId || null,
                    estimatedCost: payload.estimatedCost === "" ? null : payload.estimatedCost,
                }),
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(json?.error || "Tạo issue thất bại");
            }

            setForm({
                summary: "",
                note: "",
                area: "MOVEMENT",
                issueType: "CHECK",
                actionMode: "INTERNAL",
                vendorId: "",
                serviceCatalogId: "",
                supplyCatalogId: "",
                mechanicalPartCatalogId: "",
                estimatedCost: "",
            });

            await refresh();
        } catch (e: any) {
            alert(e?.message || "Tạo issue thất bại");
        } finally {
            setSaving(false);
        }
    }

    async function startIssue(id: string) {
        const res = await fetch(`/api/admin/technical-issues/${id}/start`, { method: "POST" });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            alert(json?.error || "Không thể bắt đầu issue");
            return;
        }
        await refresh();
    }

    async function completeIssue(id: string) {
        const resolutionNote = window.prompt("Kết luận xử lý", "") ?? "";
        const actualCost = window.prompt("Chi phí thực tế", "") ?? "";

        const res = await fetch(`/api/admin/technical-issues/${id}/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                resolutionNote,
                actualCost: actualCost.trim() ? Number(actualCost) : null,
            }),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            alert(json?.error || "Không thể hoàn tất issue");
            return;
        }
        await refresh();
    }

    async function cancelIssue(id: string) {
        const reason = window.prompt("Lý do hủy", "") ?? "";
        const res = await fetch(`/api/admin/technical-issues/${id}/cancel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reason }),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            alert(json?.error || "Không thể hủy issue");
            return;
        }
        await refresh();
    }

    async function addRecord(id: string) {
        const notes = window.prompt("Nhật ký xử lý", "") ?? "";
        const workSummary = window.prompt("Nội dung thực hiện", "") ?? "";
        const totalCost = window.prompt("Chi phí phát sinh", "") ?? "";

        const res = await fetch("/api/admin/service-requests/technical-issue-record", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id,
                notes,
                workSummary,
                totalCost: totalCost.trim() ? Number(totalCost) : null,
            }),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            alert(json?.error || "Không thể thêm record");
            return;
        }
        await refresh();
    }

    return (
        <div className="space-y-5 border-t border-slate-200 px-6 py-5">
            <div>
                <div className="text-base font-semibold text-slate-900">
                    Nghiệp vụ kỹ thuật
                </div>
                <div className="mt-1 text-sm text-slate-500">
                    Tạo và xử lý issue ngay trong phiếu, không tách sang màn khác.
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                {suggestions.length ? (
                    suggestions.map((item, idx) => (
                        <button
                            key={`${item.area}-${idx}`}
                            type="button"
                            disabled={saving}
                            onClick={() => createIssue(item)}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left hover:bg-slate-100"
                        >
                            <div className="text-sm font-semibold text-slate-900">
                                {item.area}
                            </div>
                            <div className="mt-1 text-sm text-slate-600">{item.summary}</div>
                            <div className="mt-3 text-xs text-blue-600">+ Thêm vào phiếu</div>
                        </button>
                    ))
                ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 md:col-span-2">
                        Không có gợi ý mới.
                    </div>
                )}
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
                <div className="mb-4 text-sm font-semibold text-slate-900">
                    Tạo nghiệp vụ thủ công
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <input
                        value={form.summary}
                        onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                        placeholder="Tóm tắt nghiệp vụ"
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
                    />

                    <select
                        value={form.vendorId}
                        onChange={(e) => setForm((p) => ({ ...p, vendorId: e.target.value }))}
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
                    >
                        <option value="">Vendor</option>
                        {catalogs?.vendors?.map((x: any) => (
                            <option key={x.id} value={x.id}>
                                {x.name}
                            </option>
                        ))}
                    </select>

                    <textarea
                        value={form.note}
                        onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                        placeholder="Ghi chú"
                        className="min-h-[88px] rounded-xl border border-slate-200 px-3 py-2 text-sm md:col-span-2"
                    />

                    <select
                        value={form.area}
                        onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
                    >
                        <option value="MOVEMENT">MOVEMENT</option>
                        <option value="CASE">CASE</option>
                        <option value="CRYSTAL">CRYSTAL</option>
                        <option value="CROWN">CROWN</option>
                        <option value="DIAL">DIAL</option>
                        <option value="GENERAL">GENERAL</option>
                    </select>

                    <select
                        value={form.issueType}
                        onChange={(e) => setForm((p) => ({ ...p, issueType: e.target.value }))}
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
                    >
                        <option value="CHECK">CHECK</option>
                        <option value="SERVICE">SERVICE</option>
                        <option value="REPAIR">REPAIR</option>
                        <option value="REPLACE">REPLACE</option>
                        <option value="OBSERVATION">OBSERVATION</option>
                    </select>

                    <select
                        value={form.actionMode}
                        onChange={(e) => setForm((p) => ({ ...p, actionMode: e.target.value }))}
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
                    >
                        <option value="INTERNAL">INTERNAL</option>
                        <option value="VENDOR">VENDOR</option>
                        <option value="NONE">NONE</option>
                    </select>

                    <input
                        value={form.estimatedCost}
                        onChange={(e) => setForm((p) => ({ ...p, estimatedCost: e.target.value }))}
                        placeholder="Chi phí dự kiến"
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
                    />

                    <select
                        value={form.serviceCatalogId}
                        onChange={(e) => setForm((p) => ({ ...p, serviceCatalogId: e.target.value }))}
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
                    >
                        <option value="">Service catalog</option>
                        {catalogs?.serviceCatalogs?.map((x: any) => (
                            <option key={x.id} value={x.id}>
                                {x.code} · {x.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={form.supplyCatalogId}
                        onChange={(e) => setForm((p) => ({ ...p, supplyCatalogId: e.target.value }))}
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
                    >
                        <option value="">Supply catalog</option>
                        {catalogs?.supplyCatalogs?.map((x: any) => (
                            <option key={x.id} value={x.id}>
                                {x.code} · {x.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={form.mechanicalPartCatalogId}
                        onChange={(e) =>
                            setForm((p) => ({ ...p, mechanicalPartCatalogId: e.target.value }))
                        }
                        className="h-11 rounded-xl border border-slate-200 px-3 text-sm"
                    >
                        <option value="">Mechanical part</option>
                        {catalogs?.mechanicalPartCatalogs?.map((x: any) => (
                            <option key={x.id} value={x.id}>
                                {x.code} · {x.name}
                            </option>
                        ))}
                    </select>

                    <div className="md:col-span-2">
                        <button
                            type="button"
                            disabled={saving || !form.summary.trim()}
                            onClick={() => createIssue(form)}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            {saving ? "Đang thêm..." : "Thêm nghiệp vụ"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {issues.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                        Chưa có issue nào trong phiếu này.
                    </div>
                ) : (
                    issues.map((issue: any) => (
                        <div key={issue.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-900">
                                            {issue.area || "ISSUE"}
                                        </span>
                                        <span className="rounded-full border px-2 py-0.5 text-[11px] text-slate-600">
                                            {issue.issueType}
                                        </span>
                                        <span className="rounded-full border px-2 py-0.5 text-[11px] text-slate-600">
                                            {issue.actionMode}
                                        </span>
                                        <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                            {issue.executionStatus}
                                        </span>
                                    </div>

                                    <div className="mt-2 text-sm font-medium text-slate-900">
                                        {issue.summary || "-"}
                                    </div>

                                    {issue.note ? (
                                        <div className="mt-1 text-sm text-slate-600">
                                            {issue.note}
                                        </div>
                                    ) : null}

                                    <div className="mt-2 text-xs text-slate-500">
                                        Dự kiến: {fmtMoney(issue.estimatedCost)} • Thực tế: {fmtMoney(issue.actualCost)} • Mở lúc: {fmtDate(issue.openedAt)}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {issue.executionStatus === "OPEN" && (
                                        <button
                                            type="button"
                                            onClick={() => startIssue(issue.id)}
                                            className="rounded-lg border px-3 py-1.5 text-xs hover:bg-slate-50"
                                        >
                                            Bắt đầu
                                        </button>
                                    )}

                                    {issue.executionStatus === "IN_PROGRESS" && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => addRecord(issue.id)}
                                                className="rounded-lg border px-3 py-1.5 text-xs hover:bg-slate-50"
                                            >
                                                Thêm record
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => completeIssue(issue.id)}
                                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-700"
                                            >
                                                Hoàn tất
                                            </button>
                                        </>
                                    )}

                                    {["OPEN", "IN_PROGRESS"].includes(String(issue.executionStatus)) && (
                                        <button
                                            type="button"
                                            onClick={() => cancelIssue(issue.id)}
                                            className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                                        >
                                            Hủy
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}