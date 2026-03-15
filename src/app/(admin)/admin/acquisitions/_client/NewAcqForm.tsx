"use client";

import { ProductType } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Vendor = { id: string; name: string };
type Props = { vendors: Vendor[] };

type WatchLine = {
    id: string;
    title: string;
    quantity: number;
    unitCost: number;
};

type StrapMaterial =
    | "LEATHER"
    | "BRACELET"
    | "RUBBER"
    | "NATO"
    | "CANVASS"
    | "SPECIAL";

type StrapLine = {
    id: string;
    title: string;
    material: StrapMaterial;
    lugWidthMM: number;
    buckleWidthMM: number;
    color: string;
    quickRelease: boolean;
    quantity: number;
    unitCost: number;
    sellPrice: number;
};

const CURRENCIES = ["VND", "USD", "EUR"] as const;
const TYPES = ["PURCHASE", "BUY_BACK", "TRADE_IN", "CONSIGNMENT"] as const;

const STRAP_MATERIALS: Array<{ value: StrapMaterial; label: string }> = [
    { value: "LEATHER", label: "Da" },
    { value: "BRACELET", label: "Kim loại" },
    { value: "RUBBER", label: "Cao su" },
    { value: "NATO", label: "NATO" },
    { value: "CANVASS", label: "Canvas" },
    { value: "SPECIAL", label: "Khác" },
];

function uid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return Math.random().toString(36).slice(2, 10);
}

function newWatchLine(): WatchLine {
    return {
        id: uid(),
        title: "",
        quantity: 1,
        unitCost: 0,
    };
}

function newStrapLine(): StrapLine {
    return {
        id: uid(),
        title: "",
        material: "LEATHER",
        lugWidthMM: 20,
        buckleWidthMM: 18,
        color: "",
        quickRelease: true,
        quantity: 1,
        unitCost: 0,
        sellPrice: 0,
    };
}

export default function NewAcqForm({ vendors }: Props) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        currency: "VND",
        type: "PURCHASE",
        acquiredAt: new Date().toISOString().slice(0, 16),
        notes: "",
        vendorId: "",
        quickVendorName: "",
    });

    const [showQuickVendor, setShowQuickVendor] = useState(false);

    const [watchLines, setWatchLines] = useState<WatchLine[]>([newWatchLine()]);
    const [strapLines, setStrapLines] = useState<StrapLine[]>([]);

    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);
    const [showAfterCreate, setShowAfterCreate] = useState(false);

    const watchTotal = useMemo(
        () =>
            watchLines.reduce(
                (s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitCost) || 0),
                0
            ),
        [watchLines]
    );

    const strapTotal = useMemo(
        () =>
            strapLines.reduce(
                (s, l) => s + (Number(l.quantity) || 0) * (Number(l.unitCost) || 0),
                0
            ),
        [strapLines]
    );

    const total = watchTotal + strapTotal;

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function setWatchLine<K extends keyof WatchLine>(id: string, key: K, value: WatchLine[K]) {
        setWatchLines((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
    }

    function setStrapLine<K extends keyof StrapLine>(id: string, key: K, value: StrapLine[K]) {
        setStrapLines((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
    }

    const addWatchLine = () => setWatchLines((prev) => [...prev, newWatchLine()]);
    const addStrapLine = () => setStrapLines((prev) => [...prev, newStrapLine()]);

    const removeWatchLine = (id: string) =>
        setWatchLines((prev) => (prev.length === 1 ? prev : prev.filter((l) => l.id !== id)));

    const removeStrapLine = (id: string) =>
        setStrapLines((prev) => prev.filter((l) => l.id !== id));

    function resetFormForNew() {
        setErr(null);
        setOkMsg(null);
        setShowQuickVendor(false);

        setFormData({
            currency: "VND",
            type: "PURCHASE",
            acquiredAt: new Date().toISOString().slice(0, 16),
            notes: "",
            vendorId: "",
            quickVendorName: "",
        });

        setWatchLines([newWatchLine()]);
        setStrapLines([]);
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setOkMsg(null);
        setSaving(true);

        try {
            const watchItems = watchLines
                .filter((l) => l.title.trim())
                .map((l) => ({
                    title: l.title.trim(),
                    quantity: Number(l.quantity || 1),
                    unitCost: Number(l.unitCost || 0),
                    productType: ProductType.WATCH,
                }));

            const strapItems = strapLines
                .filter((l) => l.title.trim())
                .map((l) => ({
                    title: l.title.trim(),
                    quantity: Number(l.quantity || 1),
                    unitCost: Number(l.unitCost || 0),
                    productType: ProductType.WATCH_STRAP,
                    strapSpec: {
                        material: l.material,
                        lugWidthMM: Number(l.lugWidthMM || 0),
                        buckleWidthMM: Number(l.buckleWidthMM || 0),
                        color: l.color.trim(),
                        quickRelease: l.quickRelease,
                        sellPrice: Number(l.sellPrice || 0),
                    },
                }));

            const items = [...watchItems, ...strapItems];

            if (!items.length) {
                throw new Error("Vui lòng nhập ít nhất 1 dòng đồng hồ hoặc dây");
            }

            const res = await fetch("/api/admin/acquisitions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    acquiredAt: new Date(formData.acquiredAt),
                    items,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(data?.error || "Tạo phiếu nhập thất bại");
            }

            setOkMsg("Đã tạo phiếu thành công");
            setShowAfterCreate(true);
        } catch (e: any) {
            setErr(e?.message || "Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <form id="acq-form" onSubmit={onSubmit} className="space-y-6 pb-24">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Tạo phiếu nhập (DRAFT)</h1>
                    <Link
                        href="/admin/acquisitions"
                        className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                        ← Danh sách
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-md border bg-white p-5 shadow-sm">
                        <h3 className="mb-3 font-semibold">Vendor</h3>

                        {!showQuickVendor ? (
                            <>
                                <select
                                    name="vendorId"
                                    className="mb-3 w-full rounded border px-3 py-2"
                                    value={formData.vendorId}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Chọn vendor --</option>
                                    {vendors.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.name}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="button"
                                    onClick={() => setShowQuickVendor(true)}
                                    className="w-full rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-neutral-800"
                                >
                                    + Thêm nhanh vendor mới
                                </button>
                            </>
                        ) : (
                            <div className="rounded border bg-gray-50 p-3">
                                <label className="mb-1 block text-xs">Tên vendor mới</label>
                                <input
                                    name="quickVendorName"
                                    className="w-full rounded border px-3 py-2"
                                    value={formData.quickVendorName}
                                    onChange={handleChange}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowQuickVendor(false)}
                                    className="mt-2 w-full rounded border px-3 py-2"
                                >
                                    Huỷ thêm mới
                                </button>
                            </div>
                        )}

                        <label className="mt-4 block text-sm font-medium">Ghi chú</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="mt-1 min-h-[80px] w-full rounded border px-3 py-2"
                        />
                    </div>

                    <div className="rounded-md border bg-white p-5 shadow-sm">
                        <h3 className="mb-3 font-semibold">Thông tin phiếu</h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Ngày nhập</label>
                                <input
                                    name="acquiredAt"
                                    type="datetime-local"
                                    value={formData.acquiredAt}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded border px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Tiền tệ</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded border px-3 py-2"
                                >
                                    {CURRENCIES.map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Loại phiếu</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded border px-3 py-2"
                                >
                                    {TYPES.map((t) => (
                                        <option key={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-md border bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Nhập đồng hồ</h3>
                            <p className="text-sm text-gray-500">Đồng hồ nhập theo tên, SL, giá nhập</p>
                        </div>

                        <button
                            type="button"
                            onClick={addWatchLine}
                            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                        >
                            + Thêm đồng hồ
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 text-left">Tên đồng hồ</th>
                                    <th className="px-3 py-3 text-right">SL</th>
                                    <th className="px-3 py-3 text-right">Giá nhập</th>
                                    <th className="px-3 py-3 text-right">Thành tiền</th>
                                    <th className="px-3 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {watchLines.map((line) => {
                                    const rowTotal = Number(line.quantity || 0) * Number(line.unitCost || 0);
                                    return (
                                        <tr key={line.id} className="border-t">
                                            <td className="px-3 py-3">
                                                <input
                                                    className="w-full rounded border px-3 py-2"
                                                    value={line.title}
                                                    onChange={(e) => setWatchLine(line.id, "title", e.target.value)}
                                                />
                                            </td>
                                            <td className="px-3 py-3 text-right">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    className="w-24 rounded border px-3 py-2 text-right"
                                                    value={line.quantity}
                                                    onChange={(e) =>
                                                        setWatchLine(line.id, "quantity", Number(e.target.value || 1))
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-3 text-right">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    className="w-32 rounded border px-3 py-2 text-right"
                                                    value={line.unitCost}
                                                    onChange={(e) =>
                                                        setWatchLine(line.id, "unitCost", Number(e.target.value || 0))
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-3 text-right font-medium">
                                                {new Intl.NumberFormat("vi-VN").format(rowTotal)} {formData.currency}
                                            </td>
                                            <td className="px-3 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => removeWatchLine(line.id)}
                                                    className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                                                >
                                                    Xoá
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-md border bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold">Nhập dây</h3>
                            <p className="text-sm text-gray-500">
                                Dây nhập đầy đủ spec để tạo StrapVariantSpec khi post phiếu
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={addStrapLine}
                            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                        >
                            + Thêm dây
                        </button>
                    </div>

                    {strapLines.length === 0 ? (
                        <div className="rounded-md border border-dashed px-4 py-6 text-sm text-gray-500">
                            Chưa có dòng dây nào.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3 text-left">Tên dây</th>
                                        <th className="px-3 py-3 text-left">Chất liệu</th>
                                        <th className="px-3 py-3 text-right">Đầu dây</th>
                                        <th className="px-3 py-3 text-right">Đầu khóa</th>
                                        <th className="px-3 py-3 text-left">Màu</th>
                                        <th className="px-3 py-3 text-center">QR</th>
                                        <th className="px-3 py-3 text-right">SL</th>
                                        <th className="px-3 py-3 text-right">Giá nhập</th>
                                        <th className="px-3 py-3 text-right">Giá bán</th>
                                        <th className="px-3 py-3 text-right">Thành tiền</th>
                                        <th className="px-3 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {strapLines.map((line) => {
                                        const rowTotal = Number(line.quantity || 0) * Number(line.unitCost || 0);
                                        return (
                                            <tr key={line.id} className="border-t">
                                                <td className="px-3 py-3">
                                                    <input
                                                        className="w-44 rounded border px-3 py-2"
                                                        value={line.title}
                                                        onChange={(e) => setStrapLine(line.id, "title", e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <select
                                                        className="w-32 rounded border px-3 py-2"
                                                        value={line.material}
                                                        onChange={(e) =>
                                                            setStrapLine(line.id, "material", e.target.value as StrapMaterial)
                                                        }
                                                    >
                                                        {STRAP_MATERIALS.map((m) => (
                                                            <option key={m.value} value={m.value}>
                                                                {m.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-3 py-3 text-right">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="w-20 rounded border px-3 py-2 text-right"
                                                        value={line.lugWidthMM}
                                                        onChange={(e) =>
                                                            setStrapLine(line.id, "lugWidthMM", Number(e.target.value || 0))
                                                        }
                                                    />
                                                </td>
                                                <td className="px-3 py-3 text-right">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="w-20 rounded border px-3 py-2 text-right"
                                                        value={line.buckleWidthMM}
                                                        onChange={(e) =>
                                                            setStrapLine(line.id, "buckleWidthMM", Number(e.target.value || 0))
                                                        }
                                                    />
                                                </td>
                                                <td className="px-3 py-3">
                                                    <input
                                                        className="w-24 rounded border px-3 py-2"
                                                        value={line.color}
                                                        onChange={(e) => setStrapLine(line.id, "color", e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-3 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={line.quickRelease}
                                                        onChange={(e) =>
                                                            setStrapLine(line.id, "quickRelease", e.target.checked)
                                                        }
                                                    />
                                                </td>
                                                <td className="px-3 py-3 text-right">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="w-20 rounded border px-3 py-2 text-right"
                                                        value={line.quantity}
                                                        onChange={(e) =>
                                                            setStrapLine(line.id, "quantity", Number(e.target.value || 1))
                                                        }
                                                    />
                                                </td>
                                                <td className="px-3 py-3 text-right">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        className="w-24 rounded border px-3 py-2 text-right"
                                                        value={line.unitCost}
                                                        onChange={(e) =>
                                                            setStrapLine(line.id, "unitCost", Number(e.target.value || 0))
                                                        }
                                                    />
                                                </td>
                                                <td className="px-3 py-3 text-right">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        className="w-24 rounded border px-3 py-2 text-right"
                                                        value={line.sellPrice}
                                                        onChange={(e) =>
                                                            setStrapLine(line.id, "sellPrice", Number(e.target.value || 0))
                                                        }
                                                    />
                                                </td>
                                                <td className="px-3 py-3 text-right font-medium">
                                                    {new Intl.NumberFormat("vi-VN").format(rowTotal)} {formData.currency}
                                                </td>
                                                <td className="px-3 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeStrapLine(line.id)}
                                                        className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                                                    >
                                                        Xoá
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="rounded-md border bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-end gap-6">
                        <div className="text-sm text-gray-500">
                            Đồng hồ: <b>{watchTotal.toLocaleString("vi-VN")} {formData.currency}</b>
                        </div>
                        <div className="text-sm text-gray-500">
                            Dây: <b>{strapTotal.toLocaleString("vi-VN")} {formData.currency}</b>
                        </div>
                        <div className="text-base font-semibold">
                            Tổng cộng: {total.toLocaleString("vi-VN")} {formData.currency}
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 flex justify-end gap-3 border-t bg-white px-6 py-3 shadow-lg">
                    <button
                        disabled={saving}
                        className="rounded-md border px-4 py-2"
                        onClick={() => history.back()}
                        type="button"
                    >
                        Hủy
                    </button>

                    <button
                        type="submit"
                        form="acq-form"
                        disabled={saving}
                        className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-neutral-800"
                    >
                        {saving ? "Đang lưu…" : "Lưu phiếu (DRAFT)"}
                    </button>
                </div>

                {err && <div className="text-red-600">{err}</div>}
                {okMsg && <div className="text-green-600">{okMsg}</div>}
            </form>

            {showAfterCreate && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4">
                    <div className="w-full max-w-md space-y-4 rounded-xl border bg-white p-5 shadow-xl">
                        <div>
                            <h3 className="text-lg font-semibold">Tạo phiếu thành công</h3>
                            <p className="mt-1 text-sm text-gray-600">
                                Bạn muốn tạo phiếu nhập mới hay quay về danh sách?
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                                onClick={() => {
                                    setShowAfterCreate(false);
                                    router.push("/admin/acquisitions");
                                }}
                            >
                                Về danh sách
                            </button>

                            <button
                                type="button"
                                className="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-neutral-800"
                                onClick={() => {
                                    setShowAfterCreate(false);
                                    resetFormForNew();
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                            >
                                + Tạo phiếu mới
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}