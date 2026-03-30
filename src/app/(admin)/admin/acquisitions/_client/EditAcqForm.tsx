"use client";

import Link from "next/link";
import { ProductType } from "@prisma/client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    applyQuickWatchSpecToFlags,
    getQuickWatchSpecChips,
    parseQuickWatchSpec,
    type QuickWatchSpec,
} from "../_shared/quick-watch-rule";

type WatchFlags = {
    hasStrap: boolean;
    isServiced: boolean;
    hasClasp: boolean;
    needsService: boolean;
};

type StrapSpec = {
    material: string;
    lugWidthMM: number;
    buckleWidthMM: number;
    color: string;
    quickRelease: boolean;
    sellPrice: number;
};

type Line = {
    id: string;
    title: string;
    quantity: number;
    unitCost: number;
    productType: string;
    watchFlags?: WatchFlags;
    strapSpec?: StrapSpec;
    quickSpec?: QuickWatchSpec | null;
};

type Props = {
    acquisition: {
        id: string;
        refNo?: string;
        vendorId: string;
        acquiredAt: string;
        notes: string;
        currency: string;
        type: string;
        status?: string;
    };
    items: Line[];
    vendors: { id: string; name: string }[];
    productTypes: string[];
    readOnly?: boolean;
};

const CURRENCIES = ["VND", "USD", "EUR"] as const;
const ACQ_TYPES = ["PURCHASE", "BUY_BACK", "TRADE_IN", "CONSIGNMENT"] as const;
const STRAP_MATERIALS = [
    { value: "LEATHER", label: "Da" },
    { value: "BRACELET", label: "Kim loại" },
    { value: "RUBBER", label: "Cao su" },
    { value: "NATO", label: "NATO" },
    { value: "CANVASS", label: "Canvas" },
    { value: "SPECIAL", label: "Khác" },
] as const;

function uid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return Math.random().toString(36).slice(2, 10);
}

function defaultWatchFlags(): WatchFlags {
    return {
        hasStrap: true,
        isServiced: false,
        hasClasp: false,
        needsService: true,
    };
}

function defaultStrapSpec(): StrapSpec {
    return {
        material: "LEATHER",
        lugWidthMM: 20,
        buckleWidthMM: 18,
        color: "",
        quickRelease: true,
        sellPrice: 0,
    };
}

function normalizeWatchFlags(flags?: Partial<WatchFlags> | null): WatchFlags {
    return {
        hasStrap: !!flags?.hasStrap,
        isServiced: !!flags?.isServiced,
        hasClasp: !!flags?.hasClasp,
        needsService: flags?.needsService == null ? true : !!flags?.needsService,
    };
}

function normalizeStrapSpec(spec?: Partial<StrapSpec> | null): StrapSpec {
    return {
        material: spec?.material || "LEATHER",
        lugWidthMM: Number(spec?.lugWidthMM ?? 20),
        buckleWidthMM: Number(spec?.buckleWidthMM ?? 18),
        color: spec?.color || "",
        quickRelease: spec?.quickRelease == null ? true : Boolean(spec.quickRelease),
        sellPrice: Number(spec?.sellPrice ?? 0),
    };
}

function buildWatchLineState(title = "", currentFlags?: WatchFlags) {
    const quickSpec = parseQuickWatchSpec(title);
    return {
        quickSpec,
        watchFlags: applyQuickWatchSpecToFlags(quickSpec, currentFlags ?? defaultWatchFlags()),
    };
}

function newLine(productType = ProductType.WATCH): Line {
    const watchState = buildWatchLineState("");

    return {
        id: `tmp-${uid()}`,
        title: "",
        quantity: 1,
        unitCost: 0,
        productType,
        watchFlags: productType === ProductType.WATCH ? watchState.watchFlags : undefined,
        strapSpec: productType === ProductType.WATCH_STRAP ? defaultStrapSpec() : undefined,
        quickSpec: productType === ProductType.WATCH ? watchState.quickSpec : undefined,
    };
}

function FlagCheckbox({
    checked,
    label,
    disabled,
    onChange,
}: {
    checked: boolean;
    label: string;
    disabled?: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
            {label}
        </label>
    );
}


function QuickRuleChips({ spec }: { spec?: QuickWatchSpec | null }) {
    const chips = getQuickWatchSpecChips(spec);
    if (!chips.length) {
        return (
            <p className="mt-2 text-xs text-slate-500">
                Gợi ý: <span className="font-medium">seiko tự động tròn mặt đen dây thép</span>
            </p>
        );
    }

    return (
        <div className="mt-2 flex flex-wrap gap-2">
            {chips.map((chip) => (
                <span
                    key={chip}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                >
                    {chip}
                </span>
            ))}
        </div>
    );
}

export default function EditAcqForm({
    acquisition,
    items: initialItems,
    vendors,
    productTypes,
    readOnly = false,
}: Props) {
    const router = useRouter();

    const [formData, setFormData] = useState({ ...acquisition });
    const [lines, setLines] = useState<Line[]>(
        (initialItems ?? []).map((item) => {
            const isWatch = item.productType === ProductType.WATCH;
            const watchState = isWatch
                ? buildWatchLineState(item.title, normalizeWatchFlags(item.watchFlags))
                : null;

            return {
                ...item,
                watchFlags: isWatch ? watchState?.watchFlags : undefined,
                quickSpec: isWatch ? watchState?.quickSpec : undefined,
                strapSpec:
                    item.productType === ProductType.WATCH_STRAP
                        ? normalizeStrapSpec(item.strapSpec)
                        : undefined,
            };
        })
    );
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    const total = useMemo(
        () => lines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.unitCost || 0), 0),
        [lines]
    );

    function setLine(id: string, patch: Partial<Line>) {
        setLines((prev) =>
            prev.map((line) => {
                if (line.id !== id) return line;

                const nextType = (patch.productType ?? line.productType) as string;
                const nextTitle = patch.title ?? line.title;
                const watchState =
                    nextType === ProductType.WATCH
                        ? buildWatchLineState(nextTitle, normalizeWatchFlags(patch.watchFlags ?? line.watchFlags))
                        : null;

                return {
                    ...line,
                    ...patch,
                    watchFlags: nextType === ProductType.WATCH ? watchState?.watchFlags : undefined,
                    quickSpec: nextType === ProductType.WATCH ? watchState?.quickSpec : undefined,
                    strapSpec:
                        nextType === ProductType.WATCH_STRAP
                            ? normalizeStrapSpec(patch.strapSpec ?? line.strapSpec)
                            : undefined,
                };
            })
        );
    }

    function setWatchTitle(id: string, title: string) {
        setLines((prev) =>
            prev.map((line) => {
                if (line.id !== id) return line;
                const watchState = buildWatchLineState(title, normalizeWatchFlags(line.watchFlags));
                return {
                    ...line,
                    title,
                    watchFlags: watchState.watchFlags,
                    quickSpec: watchState.quickSpec,
                };
            })
        );
    }

    function setWatchFlag(id: string, key: keyof WatchFlags, value: boolean) {
        setLines((prev) =>
            prev.map((line) =>
                line.id === id
                    ? {
                        ...line,
                        watchFlags: normalizeWatchFlags({ ...(line.watchFlags ?? defaultWatchFlags()), [key]: value }),
                    }
                    : line
            )
        );
    }

    function setStrapField<K extends keyof StrapSpec>(id: string, key: K, value: StrapSpec[K]) {
        setLines((prev) =>
            prev.map((line) =>
                line.id === id
                    ? {
                        ...line,
                        strapSpec: normalizeStrapSpec({ ...(line.strapSpec ?? defaultStrapSpec()), [key]: value }),
                    }
                    : line
            )
        );
    }

    function addLine() {
        const defaultType = productTypes.includes(ProductType.WATCH)
            ? ProductType.WATCH
            : productTypes[0] || ProductType.WATCH;
        setLines((prev) => [...prev, newLine(defaultType as ProductType)]);
    }

    function removeLine(id: string) {
        setLines((prev) => prev.filter((line) => line.id !== id));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (readOnly) return;

        setErr(null);
        setOkMsg(null);

        if (!formData.vendorId) {
            setErr("Phải chọn vendor.");
            return;
        }

        const items = lines
            .map((line) => {
                const quickSpec = line.productType === ProductType.WATCH ? parseQuickWatchSpec(line.title?.trim()) : null;

                return {
                    id: line.id,
                    title: line.title?.trim(),
                    quantity: Number(line.quantity) || 0,
                    unitCost: Number(line.unitCost) || 0,
                    productType: line.productType,
                    ...(line.productType === ProductType.WATCH
                        ? {
                            watchFlags: applyQuickWatchSpecToFlags(quickSpec, normalizeWatchFlags(line.watchFlags)),
                            quickSpec,
                        }
                        : {}),
                    ...(line.productType === ProductType.WATCH_STRAP
                        ? {
                            strapSpec: normalizeStrapSpec(line.strapSpec),
                        }
                        : {}),
                };
            })
            .filter((line) => line.title && line.quantity > 0);

        if (!items.length) {
            setErr("Phải có ít nhất 1 dòng hợp lệ.");
            return;
        }

        try {
            setSaving(true);
            const res = await fetch(`/api/admin/acquisitions/${acquisition.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vendorId: formData.vendorId,
                    acquiredAt: formData.acquiredAt,
                    currency: formData.currency,
                    type: formData.type,
                    notes: formData.notes,
                    items,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Cập nhật phiếu nhập thất bại");

            setOkMsg("Đã lưu toàn bộ thay đổi của phiếu nhập.");
            router.refresh();
        } catch (error: any) {
            setErr(error?.message || "Lỗi cập nhật phiếu nhập");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6 pb-10">
            <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div>
                    <div className="text-sm text-slate-500">Phiếu nhập</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold text-slate-900">
                            {formData.refNo || acquisition.id}
                        </h2>
                        {formData.status ? (
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                                {formData.status}
                            </span>
                        ) : null}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/acquisitions" className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">
                        ← Danh sách
                    </Link>
                </div>
            </div>

            {readOnly ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Phiếu này không còn chỉnh sửa được vì đã duyệt hoặc đã hủy. Bạn vẫn có thể xem đầy đủ thông tin tại đây.
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-5">
                <label className="space-y-1 text-sm">
                    <div className="font-medium text-slate-700">Vendor</div>
                    <select
                        value={formData.vendorId}
                        disabled={readOnly}
                        onChange={(e) => setFormData((prev) => ({ ...prev, vendorId: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
                    >
                        <option value="">-- Chọn vendor --</option>
                        {vendors.map((vendor) => (
                            <option key={vendor.id} value={vendor.id}>
                                {vendor.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="space-y-1 text-sm">
                    <div className="font-medium text-slate-700">Ngày nhập</div>
                    <input
                        type="datetime-local"
                        value={formData.acquiredAt?.slice(0, 16) || ""}
                        disabled={readOnly}
                        onChange={(e) => setFormData((prev) => ({ ...prev, acquiredAt: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
                    />
                </label>

                <label className="space-y-1 text-sm">
                    <div className="font-medium text-slate-700">Loại phiếu</div>
                    <select
                        value={formData.type}
                        disabled={readOnly}
                        onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
                    >
                        {ACQ_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                        {!ACQ_TYPES.includes(formData.type as any) ? (
                            <option value={formData.type}>{formData.type}</option>
                        ) : null}
                    </select>
                </label>

                <label className="space-y-1 text-sm">
                    <div className="font-medium text-slate-700">Tiền tệ</div>
                    <select
                        value={formData.currency}
                        disabled={readOnly}
                        onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
                    >
                        {CURRENCIES.map((currency) => (
                            <option key={currency} value={currency}>
                                {currency}
                            </option>
                        ))}
                        {!CURRENCIES.includes(formData.currency as any) ? (
                            <option value={formData.currency}>{formData.currency}</option>
                        ) : null}
                    </select>
                </label>

                <label className="space-y-1 text-sm md:col-span-2 xl:col-span-1">
                    <div className="font-medium text-slate-700">Ghi chú</div>
                    <input
                        type="text"
                        value={formData.notes || ""}
                        disabled={readOnly}
                        onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-slate-100"
                    />
                </label>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Dòng sản phẩm</h3>
                        <p className="text-sm text-slate-500">
                            Chỉnh nhanh toàn bộ item của phiếu ngay tại đây. Metadata đồng hồ và dây nằm ở từng block bên dưới.
                        </p>
                    </div>
                    {!readOnly ? (
                        <button
                            type="button"
                            onClick={addLine}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                        >
                            + Thêm dòng
                        </button>
                    ) : null}
                </div>

                <div className="space-y-4">
                    {lines.map((line, idx) => {
                        const money = (Number(line.quantity) || 0) * (Number(line.unitCost) || 0);
                        const isWatch = line.productType === ProductType.WATCH;
                        const isStrap = line.productType === ProductType.WATCH_STRAP;

                        return (
                            <div key={line.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-sm font-semibold text-slate-700">Dòng #{idx + 1}</div>
                                        <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium text-slate-600 border border-slate-200">
                                            {line.productType}
                                        </span>
                                    </div>
                                    {!readOnly ? (
                                        <button
                                            type="button"
                                            onClick={() => removeLine(line.id)}
                                            className="text-sm font-medium text-rose-600 hover:underline"
                                        >
                                            Xóa dòng
                                        </button>
                                    ) : null}
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                                    <div className="md:col-span-5">
                                        <label className="space-y-1 text-sm">
                                            <div className="font-medium text-slate-700">Mô tả nhanh / tên sản phẩm</div>
                                            <input
                                                type="text"
                                                value={line.title}
                                                disabled={readOnly}
                                                onChange={(e) =>
                                                    isWatch
                                                        ? setWatchTitle(line.id, e.target.value)
                                                        : setLine(line.id, { title: e.target.value })
                                                }
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-white"
                                                placeholder={isWatch ? "VD: seiko tự động tròn mặt đen dây thép" : "Tên sản phẩm"}
                                            />
                                            {isWatch ? <QuickRuleChips spec={line.quickSpec} /> : null}
                                        </label>
                                    </div>

                                    <div className="md:col-span-3">
                                        <label className="space-y-1 text-sm">
                                            <div className="font-medium text-slate-700">Loại sản phẩm</div>
                                            <select
                                                value={line.productType}
                                                disabled={readOnly}
                                                onChange={(e) => setLine(line.id, { productType: e.target.value })}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-white"
                                            >
                                                {productTypes.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="space-y-1 text-sm">
                                            <div className="font-medium text-slate-700">Số lượng</div>
                                            <input
                                                type="number"
                                                min={1}
                                                value={line.quantity}
                                                disabled={readOnly}
                                                onChange={(e) => setLine(line.id, { quantity: Number(e.target.value) })}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-white"
                                            />
                                        </label>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="space-y-1 text-sm">
                                            <div className="font-medium text-slate-700">Đơn giá</div>
                                            <input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={line.unitCost}
                                                disabled={readOnly}
                                                onChange={(e) => setLine(line.id, { unitCost: Number(e.target.value) })}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-white"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {isWatch ? (
                                    <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-white p-3">
                                        <div className="text-sm font-medium text-slate-700">Trạng thái tiếp nhận đồng hồ</div>
                                        <div className="flex flex-wrap gap-2">
                                            <FlagCheckbox
                                                checked={!!line.watchFlags?.needsService}
                                                label="Service"
                                                disabled={readOnly}
                                                onChange={(v) => setWatchFlag(line.id, "needsService", v)}
                                            />
                                        </div>
                                    </div>
                                ) : null}

                                {isStrap ? (
                                    <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                                        <div className="mb-3 text-sm font-medium text-slate-700">Thông tin dây</div>
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
                                            <label className="space-y-1 text-sm xl:col-span-2">
                                                <div className="font-medium text-slate-700">Chất liệu</div>
                                                <select
                                                    value={line.strapSpec?.material ?? "LEATHER"}
                                                    disabled={readOnly}
                                                    onChange={(e) => setStrapField(line.id, "material", e.target.value)}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-white"
                                                >
                                                    {STRAP_MATERIALS.map((m) => (
                                                        <option key={m.value} value={m.value}>
                                                            {m.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>

                                            <label className="space-y-1 text-sm">
                                                <div className="font-medium text-slate-700">Đầu dây</div>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={Number(line.strapSpec?.lugWidthMM ?? 20)}
                                                    disabled={readOnly}
                                                    onChange={(e) => setStrapField(line.id, "lugWidthMM", Number(e.target.value))}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-white"
                                                />
                                            </label>

                                            <label className="space-y-1 text-sm">
                                                <div className="font-medium text-slate-700">Đuôi dây</div>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={Number(line.strapSpec?.buckleWidthMM ?? 18)}
                                                    disabled={readOnly}
                                                    onChange={(e) => setStrapField(line.id, "buckleWidthMM", Number(e.target.value))}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-white"
                                                />
                                            </label>

                                            <label className="space-y-1 text-sm xl:col-span-1">
                                                <div className="font-medium text-slate-700">Màu sắc</div>
                                                <input
                                                    type="text"
                                                    value={line.strapSpec?.color ?? ""}
                                                    disabled={readOnly}
                                                    onChange={(e) => setStrapField(line.id, "color", e.target.value)}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-white"
                                                />
                                            </label>

                                            <label className="space-y-1 text-sm xl:col-span-1">
                                                <div className="font-medium text-slate-700">Giá bán dự kiến</div>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    value={Number(line.strapSpec?.sellPrice ?? 0)}
                                                    disabled={readOnly}
                                                    onChange={(e) => setStrapField(line.id, "sellPrice", Number(e.target.value))}
                                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 disabled:bg-white"
                                                />
                                            </label>
                                        </div>

                                        <div className="mt-3">
                                            <FlagCheckbox
                                                checked={!!line.strapSpec?.quickRelease}
                                                label="Quick release"
                                                disabled={readOnly}
                                                onChange={(v) => setStrapField(line.id, "quickRelease", v)}
                                            />
                                        </div>
                                    </div>
                                ) : null}

                                <div className="mt-3 text-right text-sm text-slate-500">
                                    Thành tiền: <span className="font-semibold text-slate-900">{money.toLocaleString("vi-VN")} {formData.currency}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4 text-right text-base font-semibold text-slate-900">
                    Tổng cộng: {total.toLocaleString("vi-VN")} {formData.currency}
                </div>
            </div>

            {err ? <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{err}</div> : null}
            {okMsg ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{okMsg}</div> : null}

            {!readOnly ? (
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                    >
                        {saving ? "Đang lưu..." : "Lưu toàn bộ phiếu nhập"}
                    </button>
                </div>
            ) : null}
        </form>
    );
}
