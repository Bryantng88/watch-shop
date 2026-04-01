"use client";

import { useEffect, useMemo, useState } from "react";

type IssueRow = {
    id: string;
    area: string;
    issueType: "CHECK" | "SERVICE" | "REPAIR" | "REPLACE" | "OBSERVATION";
    actionMode: "NONE" | "INTERNAL" | "VENDOR";
    serviceCatalogId: string;
    supplyCatalogId: string;
    note: string;
    estimatedCost: string;
    sortOrder: number;
};

type PanelData = {
    serviceRequest: {
        id: string;
        refNo: string | null;
        status: string;
        scope: string | null;
        notes: string | null;
        skuSnapshot: string | null;
        productTitle: string | null;
        movement: string | null;
        model: string | null;
        ref: string | null;
        primaryImageUrl: string | null;
        productImages: Array<{ fileKey: string; role?: string | null }>;
    };
    assessment: {
        movementKind: "UNKNOWN" | "BATTERY" | "MECHANICAL";
        runningOk: boolean | null;
        batteryWeak: boolean;
        batteryIssueBattery: boolean;
        batteryIssueIC: boolean;
        batteryIssueCoil: boolean;
        preRate: number | null;
        preAmplitude: number | null;
        preBeatError: number | null;
        postRate: number | null;
        postAmplitude: number | null;
        postBeatError: number | null;
        actionMode: "NONE" | "INTERNAL" | "VENDOR";
        vendorId: string | null;
        vendorNameSnap: string | null;
        diagnosis: string;
        conclusion: string;
        imageFileKey: string | null;
        status: string;
        issues: Array<{
            id?: string;
            area?: string | null;
            issueType: "CHECK" | "SERVICE" | "REPAIR" | "REPLACE" | "OBSERVATION";
            actionMode: "NONE" | "INTERNAL" | "VENDOR";
            serviceCatalogId?: string | null;
            supplyCatalogId?: string | null;
            note?: string | null;
            estimatedCost?: number | null;
            sortOrder?: number | null;
        }>;
    };
    serviceCatalogs: Array<{
        id: string;
        code: string | null;
        name: string;
        vendorPrice: number | null;
        customerPrice: number | null;
        internalCost: number | null;
        note: string | null;
    }>;
    supplyCatalogs: Array<{
        id: string;
        code: string;
        name: string;
        category: string;
        unit: string | null;
        defaultCost: number | null;
        note: string | null;
    }>;
    vendors: Array<{ id: string; name: string }>;
};

function emptyIssue(): IssueRow {
    return {
        id: Math.random().toString(36).slice(2),
        area: "",
        issueType: "CHECK",
        actionMode: "INTERNAL",
        serviceCatalogId: "",
        supplyCatalogId: "",
        note: "",
        estimatedCost: "",
        sortOrder: 0,
    };
}

export default function TechnicalAssessmentModal({
    open,
    serviceRequestId,
    onClose,
    onSaved,
}: {
    open: boolean;
    serviceRequestId: string | null;
    onClose: () => void;
    onSaved?: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [panel, setPanel] = useState<PanelData | null>(null);

    const [movementKind, setMovementKind] = useState<"UNKNOWN" | "BATTERY" | "MECHANICAL">("UNKNOWN");
    const [runningOk, setRunningOk] = useState<boolean | null>(null);
    const [batteryWeak, setBatteryWeak] = useState(false);
    const [batteryIssueBattery, setBatteryIssueBattery] = useState(false);
    const [batteryIssueIC, setBatteryIssueIC] = useState(false);
    const [batteryIssueCoil, setBatteryIssueCoil] = useState(false);

    const [preRate, setPreRate] = useState("");
    const [preAmplitude, setPreAmplitude] = useState("");
    const [preBeatError, setPreBeatError] = useState("");
    const [postRate, setPostRate] = useState("");
    const [postAmplitude, setPostAmplitude] = useState("");
    const [postBeatError, setPostBeatError] = useState("");

    const [actionMode, setActionMode] = useState<"NONE" | "INTERNAL" | "VENDOR">("NONE");
    const [vendorId, setVendorId] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [conclusion, setConclusion] = useState("");
    const [imageFileKey, setImageFileKey] = useState("");
    const [issues, setIssues] = useState<IssueRow[]>([]);

    const serviceCatalogMap = useMemo(() => {
        const map = new Map<string, PanelData["serviceCatalogs"][number]>();
        for (const row of panel?.serviceCatalogs ?? []) {
            map.set(row.id, row);
        }
        return map;
    }, [panel]);

    const supplyCatalogMap = useMemo(() => {
        const map = new Map<string, PanelData["supplyCatalogs"][number]>();
        for (const row of panel?.supplyCatalogs ?? []) {
            map.set(row.id, row);
        }
        return map;
    }, [panel]);

    useEffect(() => {
        if (!open || !serviceRequestId) return;

        let cancelled = false;

        async function run() {
            try {
                setLoading(true);
                const res = await fetch(`/api/admin/service-requests/${serviceRequestId}/technical-assessment`);
                const data = await res.json().catch(() => null);
                if (!res.ok) throw new Error(data?.error || "Load failed");
                if (cancelled) return;

                setPanel(data);

                const a = data.assessment;
                setMovementKind(a.movementKind ?? "UNKNOWN");
                setRunningOk(a.runningOk ?? null);
                setBatteryWeak(!!a.batteryWeak);
                setBatteryIssueBattery(!!a.batteryIssueBattery);
                setBatteryIssueIC(!!a.batteryIssueIC);
                setBatteryIssueCoil(!!a.batteryIssueCoil);

                setPreRate(a.preRate != null ? String(a.preRate) : "");
                setPreAmplitude(a.preAmplitude != null ? String(a.preAmplitude) : "");
                setPreBeatError(a.preBeatError != null ? String(a.preBeatError) : "");
                setPostRate(a.postRate != null ? String(a.postRate) : "");
                setPostAmplitude(a.postAmplitude != null ? String(a.postAmplitude) : "");
                setPostBeatError(a.postBeatError != null ? String(a.postBeatError) : "");

                setActionMode(a.actionMode ?? "NONE");
                setVendorId(a.vendorId ?? "");
                setDiagnosis(a.diagnosis ?? "");
                setConclusion(a.conclusion ?? "");
                setImageFileKey(a.imageFileKey ?? "");
                setIssues(
                    Array.isArray(a.issues) && a.issues.length
                        ? a.issues.map((x: any, idx: number) => ({
                            id: x.id ?? `${idx}`,
                            area: x.area ?? "",
                            issueType: x.issueType ?? "CHECK",
                            actionMode: x.actionMode ?? "INTERNAL",
                            serviceCatalogId: x.serviceCatalogId ?? "",
                            supplyCatalogId: x.supplyCatalogId ?? "",
                            note: x.note ?? "",
                            estimatedCost:
                                x.estimatedCost != null ? String(x.estimatedCost) : "",
                            sortOrder: x.sortOrder ?? idx,
                        }))
                        : []
                );
            } catch (e: any) {
                alert(e?.message || "Load technical assessment failed");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [open, serviceRequestId]);

    function addIssue() {
        setIssues((prev) => [...prev, { ...emptyIssue(), sortOrder: prev.length }]);
    }

    function updateIssue(id: string, patch: Partial<IssueRow>) {
        setIssues((prev) =>
            prev.map((x) => (x.id === id ? { ...x, ...patch } : x))
        );
    }

    function removeIssue(id: string) {
        setIssues((prev) => prev.filter((x) => x.id !== id));
    }

    async function handleSave() {
        if (!serviceRequestId) return;

        try {
            setSaving(true);

            const res = await fetch(
                `/api/admin/service-requests/${serviceRequestId}/technical-assessment`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        movementKind,
                        runningOk,
                        batteryWeak,
                        batteryIssueBattery,
                        batteryIssueIC,
                        batteryIssueCoil,
                        preRate: preRate === "" ? null : Number(preRate),
                        preAmplitude: preAmplitude === "" ? null : Number(preAmplitude),
                        preBeatError: preBeatError === "" ? null : Number(preBeatError),
                        postRate: postRate === "" ? null : Number(postRate),
                        postAmplitude: postAmplitude === "" ? null : Number(postAmplitude),
                        postBeatError: postBeatError === "" ? null : Number(postBeatError),
                        actionMode,
                        vendorId: actionMode === "VENDOR" ? vendorId || null : null,
                        diagnosis,
                        conclusion,
                        imageFileKey: imageFileKey || null,
                        issues: issues.map((x, idx) => ({
                            area: x.area || null,
                            issueType: x.issueType,
                            actionMode: x.actionMode,
                            serviceCatalogId: x.serviceCatalogId || null,
                            supplyCatalogId: x.supplyCatalogId || null,
                            note: x.note || null,
                            estimatedCost: x.estimatedCost === "" ? null : Number(x.estimatedCost),
                            sortOrder: idx,
                        })),
                    }),
                }
            );

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Save failed");

            alert("Đã lưu đánh giá kỹ thuật");
            onSaved?.();
            onClose();
        } catch (e: any) {
            alert(e?.message || "Save failed");
        } finally {
            setSaving(false);
        }
    }

    if (!open || !serviceRequestId) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 p-4" >
            <div className="max-h-[92vh] w-full max-w-6xl overflow-auto rounded-2xl bg-white shadow-2xl" >
                <div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white px-6 py-5" >
                    <div>
                        <h2 className="text-2xl font-semibold" > Đánh giá kỹ thuật </h2>
                        < div className="mt-1 text-sm text-slate-500" >
                            {panel?.serviceRequest.refNo || panel?.serviceRequest.id || "-"}
                        </div>
                    </div>

                    < button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
                    >
                        Đóng
                    </button>
                </div>

                {
                    loading ? (
                        <div className="p-6 text-sm text-slate-500" > Đang tải...</div>
                    ) : panel ? (
                        <div className="space-y-6 p-6" >
                            <section className="rounded-xl border p-4" >
                                <div className="grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]" >
                                    <div>
                                        {
                                            imageFileKey ? (
                                                <img
                                                    src={`/api/media/sign?key=${encodeURIComponent(imageFileKey)}`}
                                                    alt="main"
                                                    className="h-36 w-36 rounded-xl border object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-36 w-36 items-center justify-center rounded-xl border text-xs text-slate-400" >
                                                    No image
                                                </div>
                                            )
                                        }
                                    </div>

                                    < div className="space-y-2" >
                                        <div className="text-lg font-semibold" >
                                            {panel.serviceRequest.productTitle || "-"}
                                        </div>
                                        < div className="text-sm text-slate-500" >
                                            SKU: {panel.serviceRequest.skuSnapshot || "-"}
                                        </div>
                                        < div className="text-sm text-slate-500" >
                                            Bộ máy từ spec: {panel.serviceRequest.movement || "-"}
                                        </div>
                                        < div className="grid gap-3 md:grid-cols-3" >
                                            <div>
                                                <label className="mb-1 block text-xs text-slate-500" >
                                                    Loại máy
                                                </label>
                                                < select
                                                    className="h-10 w-full rounded-md border px-3"
                                                    value={movementKind}
                                                    onChange={(e) =>
                                                        setMovementKind(
                                                            e.target.value as "UNKNOWN" | "BATTERY" | "MECHANICAL"
                                                        )
                                                    }
                                                >
                                                    <option value="UNKNOWN" > Chưa rõ </option>
                                                    < option value="BATTERY" > Máy pin </option>
                                                    < option value="MECHANICAL" > Máy cơ </option>
                                                </select>
                                            </div>

                                            < div >
                                                <label className="mb-1 block text-xs text-slate-500" >
                                                    Tình trạng ban đầu
                                                </label>
                                                < div className="flex gap-3 rounded-md border px-3 py-2" >
                                                    <label className="inline-flex items-center gap-2 text-sm" >
                                                        <input
                                                            type="radio"
                                                            checked={runningOk === true}
                                                            onChange={() => setRunningOk(true)}
                                                        />
                                                        Chạy ổn
                                                    </label>
                                                    < label className="inline-flex items-center gap-2 text-sm" >
                                                        <input
                                                            type="radio"
                                                            checked={runningOk === false}
                                                            onChange={() => setRunningOk(false)}
                                                        />
                                                        Có vấn đề
                                                    </label>
                                                </div>
                                            </div>

                                            < div >
                                                <label className="mb-1 block text-xs text-slate-500" >
                                                    Hướng xử lý tổng
                                                </label>
                                                < select
                                                    className="h-10 w-full rounded-md border px-3"
                                                    value={actionMode}
                                                    onChange={(e) =>
                                                        setActionMode(
                                                            e.target.value as "NONE" | "INTERNAL" | "VENDOR"
                                                        )
                                                    }
                                                >
                                                    <option value="NONE" > Chưa kết luận </option>
                                                    < option value="INTERNAL" > Xử lý nội bộ </option>
                                                    < option value="VENDOR" > Chuyển vendor </option>
                                                </select>
                                            </div>
                                        </div>

                                        {
                                            actionMode === "VENDOR" ? (
                                                <div>
                                                    <label className="mb-1 block text-xs text-slate-500" >
                                                        Vendor
                                                    </label>
                                                    < select
                                                        className="h-10 w-full rounded-md border px-3"
                                                        value={vendorId}
                                                        onChange={(e) => setVendorId(e.target.value)
                                                        }
                                                    >
                                                        <option value="" > --Chọn vendor-- </option>
                                                        {
                                                            panel.vendors.map((v) => (
                                                                <option key={v.id} value={v.id} >
                                                                    {v.name}
                                                                </option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            ) : null}
                                    </div>
                                </div>
                            </section>

                            {
                                movementKind === "BATTERY" ? (
                                    <section className="rounded-xl border p-4" >
                                        <div className="mb-3 text-lg font-semibold" > Đánh giá máy pin </div>

                                        < div className="grid gap-4 md:grid-cols-2" >
                                            <label className="inline-flex items-center gap-2 rounded-md border px-3 py-2" >
                                                <input
                                                    type="checkbox"
                                                    checked={batteryWeak}
                                                    onChange={(e) => setBatteryWeak(e.target.checked)
                                                    }
                                                />
                                                Chạy yếu / pin yếu
                                            </label>

                                            < div className="rounded-md border p-3" >
                                                <div className="mb-2 text-sm font-medium" > Yếu tố lỗi </div>
                                                < div className="flex flex-wrap gap-3 text-sm" >
                                                    <label className="inline-flex items-center gap-2" >
                                                        <input
                                                            type="checkbox"
                                                            checked={batteryIssueBattery}
                                                            onChange={(e) => setBatteryIssueBattery(e.target.checked)}
                                                        />
                                                        Pin
                                                    </label>
                                                    < label className="inline-flex items-center gap-2" >
                                                        <input
                                                            type="checkbox"
                                                            checked={batteryIssueIC}
                                                            onChange={(e) => setBatteryIssueIC(e.target.checked)}
                                                        />
                                                        IC
                                                    </label>
                                                    < label className="inline-flex items-center gap-2" >
                                                        <input
                                                            type="checkbox"
                                                            checked={batteryIssueCoil}
                                                            onChange={(e) => setBatteryIssueCoil(e.target.checked)}
                                                        />
                                                        Dây đồng / Coil
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                ) : null}

                            {
                                movementKind === "MECHANICAL" ? (
                                    <section className="rounded-xl border p-4" >
                                        <div className="mb-3 text-lg font-semibold" > Thông số máy cơ </div>

                                        < div className="grid gap-4 md:grid-cols-2" >
                                            <div className="rounded-lg border p-4" >
                                                <div className="mb-3 font-medium" > Thông số trước xử lý </div>
                                                < div className="grid gap-3 md:grid-cols-3" >
                                                    <div>
                                                        <label className="mb-1 block text-xs text-slate-500" > Rate </label>
                                                        < input
                                                            type="number"
                                                            className="h-10 w-full rounded-md border px-3"
                                                            value={preRate}
                                                            onChange={(e) => setPreRate(e.target.value)
                                                            }
                                                        />
                                                    </div>
                                                    < div >
                                                        <label className="mb-1 block text-xs text-slate-500" > Amp </label>
                                                        < input
                                                            type="number"
                                                            className="h-10 w-full rounded-md border px-3"
                                                            value={preAmplitude}
                                                            onChange={(e) => setPreAmplitude(e.target.value)}
                                                        />
                                                    </div>
                                                    < div >
                                                        <label className="mb-1 block text-xs text-slate-500" > Err </label>
                                                        < input
                                                            type="number"
                                                            step="0.1"
                                                            className="h-10 w-full rounded-md border px-3"
                                                            value={preBeatError}
                                                            onChange={(e) => setPreBeatError(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            < div className="rounded-lg border p-4" >
                                                <div className="mb-3 font-medium" > Thông số sau xử lý </div>
                                                < div className="grid gap-3 md:grid-cols-3" >
                                                    <div>
                                                        <label className="mb-1 block text-xs text-slate-500" > Rate </label>
                                                        < input
                                                            type="number"
                                                            className="h-10 w-full rounded-md border px-3"
                                                            value={postRate}
                                                            onChange={(e) => setPostRate(e.target.value)}
                                                        />
                                                    </div>
                                                    < div >
                                                        <label className="mb-1 block text-xs text-slate-500" > Amp </label>
                                                        < input
                                                            type="number"
                                                            className="h-10 w-full rounded-md border px-3"
                                                            value={postAmplitude}
                                                            onChange={(e) => setPostAmplitude(e.target.value)}
                                                        />
                                                    </div>
                                                    < div >
                                                        <label className="mb-1 block text-xs text-slate-500" > Err </label>
                                                        < input
                                                            type="number"
                                                            step="0.1"
                                                            className="h-10 w-full rounded-md border px-3"
                                                            value={postBeatError}
                                                            onChange={(e) => setPostBeatError(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                ) : null}

                            <section className="rounded-xl border p-4" >
                                <div className="mb-3 flex items-center justify-between" >
                                    <div className="text-lg font-semibold" > Lỗi / hạng mục phát hiện </div>
                                    < button
                                        type="button"
                                        onClick={addIssue}
                                        className="rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
                                    >
                                        + Thêm dòng
                                    </button>
                                </div>

                                < div className="space-y-4" >
                                    {
                                        issues.map((row, idx) => (
                                            <div key={row.id} className="rounded-lg border p-4" >
                                                <div className="mb-3 flex items-center justify-between" >
                                                    <div className="font-medium" > Dòng #{idx + 1} </div>
                                                    < button
                                                        type="button"
                                                        onClick={() => removeIssue(row.id)}
                                                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>

                                                < div className="grid gap-3 md:grid-cols-3" >
                                                    <div>
                                                        <label className="mb-1 block text-xs text-slate-500" > Khu vực lỗi </label>
                                                        < input
                                                            className="h-10 w-full rounded-md border px-3"
                                                            value={row.area}
                                                            onChange={(e) =>
                                                                updateIssue(row.id, { area: e.target.value })
                                                            }
                                                            placeholder="Bánh xe, pin, IC, coil, cầu máy..."
                                                        />
                                                    </div>

                                                    < div >
                                                        <label className="mb-1 block text-xs text-slate-500" > Loại xử lý </label>
                                                        < select
                                                            className="h-10 w-full rounded-md border px-3"
                                                            value={row.issueType}
                                                            onChange={(e) =>
                                                                updateIssue(row.id, {
                                                                    issueType: e.target.value as IssueRow["issueType"],
                                                                })
                                                            }
                                                        >
                                                            <option value="CHECK" > Kiểm tra </option>
                                                            < option value="SERVICE" > Lau dầu / service </option>
                                                            < option value="REPAIR" > Sửa chữa </option>
                                                            < option value="REPLACE" > Thay thế </option>
                                                            < option value="OBSERVATION" > Ghi nhận </option>
                                                        </select>
                                                    </div>

                                                    < div >
                                                        <label className="mb-1 block text-xs text-slate-500" > Thực hiện </label>
                                                        < select
                                                            className="h-10 w-full rounded-md border px-3"
                                                            value={row.actionMode}
                                                            onChange={(e) =>
                                                                updateIssue(row.id, {
                                                                    actionMode: e.target.value as IssueRow["actionMode"],
                                                                })
                                                            }
                                                        >
                                                            <option value="INTERNAL" > Nội bộ </option>
                                                            < option value="VENDOR" > Vendor </option>
                                                            < option value="NONE" > Chưa rõ </option>
                                                        </select>
                                                    </div>

                                                    < div >
                                                        <label className="mb-1 block text-xs text-slate-500" >
                                                            Hạng mục kỹ thuật
                                                        </label>
                                                        < select
                                                            className="h-10 w-full rounded-md border px-3"
                                                            value={row.serviceCatalogId}
                                                            onChange={(e) => {
                                                                const nextId = e.target.value;
                                                                const cat = serviceCatalogMap.get(nextId);
                                                                updateIssue(row.id, {
                                                                    serviceCatalogId: nextId,
                                                                    estimatedCost:
                                                                        row.estimatedCost ||
                                                                        (cat?.internalCost != null
                                                                            ? String(cat.internalCost)
                                                                            : ""),
                                                                });
                                                            }}
                                                        >
                                                            <option value="" > --Chọn hạng mục-- </option>
                                                            {
                                                                panel.serviceCatalogs.map((x) => (
                                                                    <option key={x.id} value={x.id} >
                                                                        {x.code ? `${x.code} - ${x.name}` : x.name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>

                                                    < div >
                                                        <label className="mb-1 block text-xs text-slate-500" > Vật tư </label>
                                                        < select
                                                            className="h-10 w-full rounded-md border px-3"
                                                            value={row.supplyCatalogId}
                                                            onChange={(e) => {
                                                                const nextId = e.target.value;
                                                                const supply = supplyCatalogMap.get(nextId);
                                                                updateIssue(row.id, {
                                                                    supplyCatalogId: nextId,
                                                                    estimatedCost:
                                                                        row.estimatedCost ||
                                                                        (supply?.defaultCost != null
                                                                            ? String(supply.defaultCost)
                                                                            : ""),
                                                                });
                                                            }}
                                                        >
                                                            <option value="" > --Chọn vật tư-- </option>
                                                            {
                                                                panel.supplyCatalogs.map((x) => (
                                                                    <option key={x.id} value={x.id} >
                                                                        {x.code} - {x.name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>

                                                    < div >
                                                        <label className="mb-1 block text-xs text-slate-500" > Chi phí dự kiến </label>
                                                        < input
                                                            type="number"
                                                            className="h-10 w-full rounded-md border px-3"
                                                            value={row.estimatedCost}
                                                            onChange={(e) =>
                                                                updateIssue(row.id, {
                                                                    estimatedCost: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                < div className="mt-3" >
                                                    <label className="mb-1 block text-xs text-slate-500" > Ghi chú </label>
                                                    < textarea
                                                        className="min-h-[72px] w-full rounded-md border px-3 py-2"
                                                        value={row.note}
                                                        onChange={(e) =>
                                                            updateIssue(row.id, { note: e.target.value })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                    {
                                        issues.length === 0 ? (
                                            <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-slate-500" >
                                                Chưa có dòng lỗi / hạng mục nào.
                                            </div>
                                        ) : null
                                    }
                                </div>
                            </section>

                            < section className="rounded-xl border p-4" >
                                <div className="mb-3 text-lg font-semibold" > Kết luận kỹ thuật </div>

                                < div className="grid gap-4 md:grid-cols-2" >
                                    <div>
                                        <label className="mb-1 block text-sm font-medium" > Chẩn đoán </label>
                                        < textarea
                                            className="min-h-[110px] w-full rounded-md border px-3 py-2"
                                            value={diagnosis}
                                            onChange={(e) => setDiagnosis(e.target.value)}
                                            placeholder="Mô tả tình trạng, nguyên nhân, nhận định kỹ thuật..."
                                        />
                                    </div>

                                    < div >
                                        <label className="mb-1 block text-sm font-medium" > Kết luận / hướng xử lý </label>
                                        < textarea
                                            className="min-h-[110px] w-full rounded-md border px-3 py-2"
                                            value={conclusion}
                                            onChange={(e) => setConclusion(e.target.value)}
                                            placeholder="Kết luận cuối, xử lý nội bộ hay vendor, thay thế gì..."
                                        />
                                    </div>
                                </div>

                                < div className="mt-4" >
                                    <label className="mb-2 block text-sm font-medium" > Ảnh máy / movement </label>
                                    < div className="flex flex-wrap gap-2" >
                                        {(panel.serviceRequest.productImages?.length
                                            ? panel.serviceRequest.productImages
                                            : panel.serviceRequest.primaryImageUrl
                                                ? [{ fileKey: panel.serviceRequest.primaryImageUrl }]
                                                : []
                                        ).map((img) => {
                                            const active = imageFileKey === img.fileKey;
                                            return (
                                                <button
                                                    key={img.fileKey}
                                                    type="button"
                                                    onClick={() => setImageFileKey(img.fileKey)
                                                    }
                                                    className={`rounded-lg border p-1 ${active ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"}`}
                                                >
                                                    <img
                                                        src={`/api/media/sign?key=${encodeURIComponent(img.fileKey)}`}
                                                        alt="movement"
                                                        className="h-20 w-20 rounded object-cover"
                                                    />
                                                </button>
                                            );
                                        })}

                                        {
                                            !(panel.serviceRequest.productImages?.length || panel.serviceRequest.primaryImageUrl) ? (
                                                <div className="text-sm text-slate-500" >
                                                    Chưa có ảnh để chọn.
                                                </div>
                                            ) : null
                                        }
                                    </div>
                                </div>

                                < div className="mt-6 flex justify-end gap-2" >
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
                                    >
                                        Hủy
                                    </button>
                                    < button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                                    >
                                        {saving ? "Đang lưu..." : "Lưu đánh giá kỹ thuật"}
                                    </button>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="p-6 text-sm text-slate-500" > Không có dữ liệu </div>
                    )}
            </div>
        </div>
    );
}