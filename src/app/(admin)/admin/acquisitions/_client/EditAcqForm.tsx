"use client";

import { ProductType } from "@prisma/client";
import { useMemo, useState } from "react";

type WatchFlags = {
    hasStrap: boolean;
    isServiced: boolean;
    hasClasp: boolean;
    isSpa: boolean;
};

type Line = {
    id: string;
    title: string;
    quantity: number;
    unitCost: number;
    productType: string;
    watchFlags?: WatchFlags;
};

type Props = {
    acquisition: {
        id: string;
        vendorId: string;
        acquiredAt: string;
        notes: string;
        currency: string;
        type: string;
    };
    items: Line[];
    vendors: { id: string; name: string }[];
    productTypes: string[];
};

function uid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return Math.random().toString(36).slice(2, 10);
}

function defaultWatchFlags(): WatchFlags {
    return {
        hasStrap: false,
        isServiced: false,
        hasClasp: false,
        isSpa: false,
    };
}

function normalizeWatchFlags(flags?: Partial<WatchFlags> | null): WatchFlags {
    return {
        hasStrap: !!flags?.hasStrap,
        isServiced: !!flags?.isServiced,
        hasClasp: !!flags?.hasClasp,
        isSpa: !!flags?.isSpa,
    };
}

function FlagCheckbox({
    checked,
    label,
    onChange,
}: {
    checked: boolean;
    label: string;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
            {label}
        </label>
    );
}

export default function EditAcqForm({ acquisition, items: initialItems, vendors, productTypes }: Props) {
    const [formData, setFormData] = useState({ ...acquisition });
    const [lines, setLines] = useState<Line[]>(
        (initialItems ?? []).map((item) => ({
            ...item,
            id: item.id || `tmp-${uid()}`,
            watchFlags:
                item.productType === ProductType.WATCH
                    ? normalizeWatchFlags(item.watchFlags)
                    : undefined,
        }))
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
                return {
                    ...line,
                    ...patch,
                    watchFlags:
                        nextType === ProductType.WATCH
                            ? normalizeWatchFlags(patch.watchFlags ?? line.watchFlags)
                            : undefined,
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

    function addLine() {
        setLines((prev) => [
            ...prev,
            {
                id: `tmp-${uid()}`,
                title: "",
                quantity: 1,
                unitCost: 0,
                productType: productTypes?.[0] ?? ProductType.WATCH,
                watchFlags: (productTypes?.[0] ?? ProductType.WATCH) === ProductType.WATCH ? defaultWatchFlags() : undefined,
            },
        ]);
    }

    function removeLine(id: string) {
        setLines((prev) => prev.filter((line) => line.id !== id));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setOkMsg(null);

        if (!formData.vendorId) {
            setErr("Phải chọn vendor.");
            return;
        }

        const items = lines
            .map((line) => ({
                id: line.id,
                title: line.title?.trim(),
                quantity: Number(line.quantity) || 0,
                unitCost: Number(line.unitCost) || 0,
                productType: line.productType,
                ...(line.productType === ProductType.WATCH
                    ? { watchFlags: normalizeWatchFlags(line.watchFlags) }
                    : {}),
            }))
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
                    ...formData,
                    items,
                }),
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(data?.error || "Cập nhật phiếu nhập thất bại");
            }

            setOkMsg("Đã cập nhật phiếu nhập.");
        } catch (error: any) {
            setErr(error?.message || "Lỗi cập nhật phiếu nhập");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2 xl:grid-cols-5">
                <label className="space-y-1 text-sm">
                    <div className="font-medium text-slate-700">Vendor</div>
                    <select
                        value={formData.vendorId}
                        onChange={(e) => setFormData((prev) => ({ ...prev, vendorId: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                        onChange={(e) => setFormData((prev) => ({ ...prev, acquiredAt: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>

                <label className="space-y-1 text-sm">
                    <div className="font-medium text-slate-700">Loại phiếu</div>
                    <input
                        type="text"
                        value={formData.type}
                        onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>

                <label className="space-y-1 text-sm">
                    <div className="font-medium text-slate-700">Tiền tệ</div>
                    <input
                        type="text"
                        value={formData.currency}
                        onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>

                <label className="space-y-1 text-sm xl:col-span-1 md:col-span-2">
                    <div className="font-medium text-slate-700">Ghi chú</div>
                    <input
                        type="text"
                        value={formData.notes || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                </label>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">Dòng sản phẩm</h3>
                        <p className="text-sm text-slate-500">Đồng hồ có thể khai báo sẵn thông tin cơ bản để đẩy sang màn hình sản phẩm.</p>
                    </div>
                    <button
                        type="button"
                        onClick={addLine}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                        + Thêm dòng
                    </button>
                </div>

                <div className="space-y-4">
                    {lines.map((line, idx) => {
                        const money = (Number(line.quantity) || 0) * (Number(line.unitCost) || 0);
                        const isWatch = line.productType === ProductType.WATCH;

                        return (
                            <div key={line.id} className="rounded-xl border border-slate-200 p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-slate-700">Dòng #{idx + 1}</div>
                                    <button
                                        type="button"
                                        onClick={() => removeLine(line.id)}
                                        className="text-sm font-medium text-rose-600 hover:underline"
                                    >
                                        Xóa
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                                    <div className="md:col-span-5">
                                        <label className="space-y-1 text-sm">
                                            <div className="font-medium text-slate-700">Tên sản phẩm</div>
                                            <input
                                                type="text"
                                                value={line.title}
                                                onChange={(e) => setLine(line.id, { title: e.target.value })}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                                                placeholder="Ví dụ: Rolex Datejust 16234"
                                            />
                                        </label>
                                    </div>

                                    <div className="md:col-span-3">
                                        <label className="space-y-1 text-sm">
                                            <div className="font-medium text-slate-700">Loại sản phẩm</div>
                                            <select
                                                value={line.productType}
                                                onChange={(e) => setLine(line.id, { productType: e.target.value })}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                                                onChange={(e) => setLine(line.id, { quantity: Number(e.target.value) })}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                                                onChange={(e) => setLine(line.id, { unitCost: Number(e.target.value) })}
                                                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {isWatch ? (
                                    <div className="mt-4 space-y-2 rounded-lg bg-slate-50 p-3">
                                        <div className="text-sm font-medium text-slate-700">Thông tin cơ bản đồng hồ</div>
                                        <div className="flex flex-wrap gap-2">
                                            <FlagCheckbox checked={!!line.watchFlags?.hasStrap} label="Có dây?" onChange={(v) => setWatchFlag(line.id, "hasStrap", v)} />
                                            <FlagCheckbox checked={!!line.watchFlags?.isServiced} label="Đã service?" onChange={(v) => setWatchFlag(line.id, "isServiced", v)} />
                                            <FlagCheckbox checked={!!line.watchFlags?.hasClasp} label="Có khóa?" onChange={(v) => setWatchFlag(line.id, "hasClasp", v)} />
                                            <FlagCheckbox checked={!!line.watchFlags?.isSpa} label="Đã spa?" onChange={(v) => setWatchFlag(line.id, "isSpa", v)} />
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

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                    {saving ? "Đang lưu..." : "Lưu phiếu nhập"}
                </button>
            </div>
        </form>
    );
}
