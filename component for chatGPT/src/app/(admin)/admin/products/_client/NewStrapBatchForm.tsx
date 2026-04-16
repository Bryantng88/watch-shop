"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Vendor = {
    id: string;
    name: string;
};

type StrapMaterial =
    | "LEATHER"
    | "BRACELET"
    | "RUBBER"
    | "NATO"
    | "CANVASS"
    | "SPECIAL";

type LengthLabel = "SHORT" | "STANDARD" | "LONG";

type StrapLine = {
    id: string;
    title: string;
    material: StrapMaterial;
    widthMM: number;
    lengthLabel: LengthLabel;
    color: string;
    quickRelease: boolean;
    price: number;
    quantity: number;
};

type Props = {
    vendors: Vendor[];
};

const MATERIAL_OPTIONS: Array<{ value: StrapMaterial; label: string }> = [
    { value: "LEATHER", label: "Da" },
    { value: "BRACELET", label: "Kim loại / Bracelet" },
    { value: "RUBBER", label: "Cao su" },
    { value: "NATO", label: "NATO" },
    { value: "CANVASS", label: "Canvas" },
    { value: "SPECIAL", label: "Khác / Đặc biệt" },
];

const LENGTH_OPTIONS: Array<{ value: LengthLabel; label: string }> = [
    { value: "SHORT", label: "Short" },
    { value: "STANDARD", label: "Standard" },
    { value: "LONG", label: "Long" },
];

function uid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2, 10);
}

function newLine(): StrapLine {
    return {
        id: uid(),
        title: "",
        material: "LEATHER",
        widthMM: 20,
        lengthLabel: "STANDARD",
        color: "",
        quickRelease: true,
        price: 0,
        quantity: 1,
    };
}

export default function NewStrapBatchForm({ vendors }: Props) {
    const router = useRouter();

    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [okMsg, setOkMsg] = useState<string | null>(null);

    const [showQuickVendor, setShowQuickVendor] = useState(false);

    const [formData, setFormData] = useState({
        vendorId: "",
        vendorName: "",
        vendorPhone: "",
        vendorEmail: "",
        currency: "VND",
        acquiredAt: new Date().toISOString().slice(0, 10),
        notes: "",
    });

    const [lines, setLines] = useState<StrapLine[]>([newLine()]);

    function setField<K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }

    function updateLine<K extends keyof StrapLine>(id: string, key: K, value: StrapLine[K]) {
        setLines((prev) => prev.map((line) => (line.id === id ? { ...line, [key]: value } : line)));
    }

    function addLine() {
        setLines((prev) => [...prev, newLine()]);
    }

    function removeLine(id: string) {
        setLines((prev) => (prev.length <= 1 ? prev : prev.filter((line) => line.id !== id)));
    }

    const total = useMemo(() => {
        return lines.reduce((sum, line) => {
            return sum + Number(line.price || 0) * Number(line.quantity || 0);
        }, 0);
    }, [lines]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setOkMsg(null);

        const normalizedRows = lines
            .map((line) => ({
                title: line.title.trim(),
                material: line.material,
                widthMM: Number(line.widthMM || 0),
                lengthLabel: line.lengthLabel,
                color: line.color.trim(),
                quickRelease: Boolean(line.quickRelease),
                price: Number(line.price || 0),
                quantity: Number(line.quantity || 0),
            }))
            .filter((line) => line.title.length > 0);

        if (!formData.vendorId && !formData.vendorName.trim()) {
            setErr("Vui lòng chọn vendor có sẵn hoặc nhập vendor nhanh.");
            return;
        }

        if (!normalizedRows.length) {
            setErr("Vui lòng nhập ít nhất 1 dòng dây.");
            return;
        }

        if (
            normalizedRows.some(
                (line) =>
                    line.price < 0 ||
                    line.quantity <= 0 ||
                    line.widthMM <= 0 ||
                    !line.color
            )
        ) {
            setErr("Giá tiền phải >= 0, số lượng > 0, width > 0 và màu không được trống.");
            return;
        }

        try {
            setSubmitting(true);

            const res = await fetch("/api/admin/products/strap-batch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    vendorId: formData.vendorId || undefined,
                    vendorName: formData.vendorName || undefined,
                    vendorPhone: formData.vendorPhone || undefined,
                    vendorEmail: formData.vendorEmail || undefined,
                    currency: formData.currency,
                    acquiredAt: formData.acquiredAt,
                    notes: formData.notes || undefined,
                    rows: normalizedRows,
                }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || !data?.ok) {
                throw new Error(data?.error || data?.message || "Tạo dây thất bại");
            }

            setOkMsg(data?.message || "Đã tạo dây thành công");
            router.push("/admin/products?catalog=strap");
            router.refresh();
        } catch (error: any) {
            setErr(error?.message || "Tạo dây thất bại");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Tạo dây theo lô</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Một form cho nhiều loại dây, dùng chung 1 vendor.
                    </p>
                </div>

                <Link
                    href="/admin/products?catalog=strap"
                    className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                >
                    ← Danh sách dây
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                        <h3 className="font-semibold">Vendor</h3>

                        <div>
                            <label className="block text-sm font-medium">Vendor có sẵn</label>
                            <div className="mt-1 flex gap-2">
                                <select
                                    className="w-full rounded border px-3 py-2"
                                    value={formData.vendorId}
                                    onChange={(e) => setField("vendorId", e.target.value)}
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
                                    className="rounded-md bg-[#11191f] px-3 py-2 text-sm font-medium text-gray-200"
                                    onClick={() => setShowQuickVendor((v) => !v)}
                                >
                                    {showQuickVendor ? "Ẩn" : "Thêm nhanh"}
                                </button>
                            </div>
                        </div>

                        {showQuickVendor && (
                            <div className="space-y-3 rounded bg-gray-50 p-3">
                                <div>
                                    <label className="block text-sm font-medium">Tên vendor</label>
                                    <input
                                        className="mt-1 w-full rounded border px-3 py-2"
                                        value={formData.vendorName}
                                        onChange={(e) => setField("vendorName", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Điện thoại</label>
                                    <input
                                        className="mt-1 w-full rounded border px-3 py-2"
                                        value={formData.vendorPhone}
                                        onChange={(e) => setField("vendorPhone", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">Email</label>
                                    <input
                                        className="mt-1 w-full rounded border px-3 py-2"
                                        value={formData.vendorEmail}
                                        onChange={(e) => setField("vendorEmail", e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
                            <div>
                                <label className="block text-sm font-medium">Tiền tệ</label>
                                <input
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    value={formData.currency}
                                    onChange={(e) => setField("currency", e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Ngày mua</label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    value={formData.acquiredAt}
                                    onChange={(e) => setField("acquiredAt", e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Ghi chú</label>
                            <textarea
                                className="mt-1 min-h-[96px] w-full rounded border px-3 py-2"
                                placeholder="Ghi chú chung cho đợt nhập dây..."
                                value={formData.notes}
                                onChange={(e) => setField("notes", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">Danh sách dây</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Mỗi dòng là một loại dây + spec riêng.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={addLine}
                                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                            >
                                + Thêm dòng
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="text-left text-gray-700">
                                        <th className="px-3 py-3">Tên loại dây</th>
                                        <th className="px-3 py-3">Chất liệu</th>
                                        <th className="px-3 py-3">Width</th>
                                        <th className="px-3 py-3">Length</th>
                                        <th className="px-3 py-3">Màu</th>
                                        <th className="px-3 py-3">QR</th>
                                        <th className="px-3 py-3 text-right">Giá tiền</th>
                                        <th className="px-3 py-3 text-right">SL</th>
                                        <th className="px-3 py-3 text-right">Thành tiền</th>
                                        <th className="px-3 py-3 text-right"></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {lines.map((line) => {
                                        const rowTotal = Number(line.price || 0) * Number(line.quantity || 0);

                                        return (
                                            <tr key={line.id} className="border-t">
                                                <td className="px-3 py-3">
                                                    <input
                                                        className="w-44 rounded border px-3 py-2"
                                                        placeholder="VD: Dây cá sấu đen"
                                                        value={line.title}
                                                        onChange={(e) =>
                                                            updateLine(line.id, "title", e.target.value)
                                                        }
                                                    />
                                                </td>

                                                <td className="px-3 py-3">
                                                    <select
                                                        className="w-32 rounded border px-3 py-2"
                                                        value={line.material}
                                                        onChange={(e) =>
                                                            updateLine(
                                                                line.id,
                                                                "material",
                                                                e.target.value as StrapMaterial
                                                            )
                                                        }
                                                    >
                                                        {MATERIAL_OPTIONS.map((opt) => (
                                                            <option key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                <td className="px-3 py-3">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="w-24 rounded border px-3 py-2 text-right"
                                                        value={line.widthMM}
                                                        onChange={(e) =>
                                                            updateLine(
                                                                line.id,
                                                                "widthMM",
                                                                Number(e.target.value || 0)
                                                            )
                                                        }
                                                    />
                                                </td>

                                                <td className="px-3 py-3">
                                                    <select
                                                        className="w-28 rounded border px-3 py-2"
                                                        value={line.lengthLabel}
                                                        onChange={(e) =>
                                                            updateLine(
                                                                line.id,
                                                                "lengthLabel",
                                                                e.target.value as LengthLabel
                                                            )
                                                        }
                                                    >
                                                        {LENGTH_OPTIONS.map((opt) => (
                                                            <option key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                <td className="px-3 py-3">
                                                    <input
                                                        className="w-28 rounded border px-3 py-2"
                                                        placeholder="Black"
                                                        value={line.color}
                                                        onChange={(e) =>
                                                            updateLine(line.id, "color", e.target.value)
                                                        }
                                                    />
                                                </td>

                                                <td className="px-3 py-3">
                                                    <label className="inline-flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={line.quickRelease}
                                                            onChange={(e) =>
                                                                updateLine(
                                                                    line.id,
                                                                    "quickRelease",
                                                                    e.target.checked
                                                                )
                                                            }
                                                        />
                                                        <span>Yes</span>
                                                    </label>
                                                </td>

                                                <td className="px-3 py-3 text-right">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        className="w-28 rounded border px-3 py-2 text-right"
                                                        value={line.price}
                                                        onChange={(e) =>
                                                            updateLine(
                                                                line.id,
                                                                "price",
                                                                Number(e.target.value || 0)
                                                            )
                                                        }
                                                    />
                                                </td>

                                                <td className="px-3 py-3 text-right">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="w-24 rounded border px-3 py-2 text-right"
                                                        value={line.quantity}
                                                        onChange={(e) =>
                                                            updateLine(
                                                                line.id,
                                                                "quantity",
                                                                Number(e.target.value || 1)
                                                            )
                                                        }
                                                    />
                                                </td>

                                                <td className="px-3 py-3 text-right font-medium">
                                                    {new Intl.NumberFormat("vi-VN").format(rowTotal)}{" "}
                                                    {formData.currency}
                                                </td>

                                                <td className="px-3 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLine(line.id)}
                                                        className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                                                        disabled={lines.length <= 1}
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                                <tfoot>
                                    <tr className="border-t bg-gray-50">
                                        <td colSpan={8} className="px-3 py-3 text-right font-semibold">
                                            Tổng cộng
                                        </td>
                                        <td className="px-3 py-3 text-right font-semibold">
                                            {new Intl.NumberFormat("vi-VN").format(total)} {formData.currency}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {err ? <div className="text-sm text-red-600">{err}</div> : null}
            {okMsg ? <div className="text-sm text-green-600">{okMsg}</div> : null}

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="rounded-md border px-4 py-2"
                    onClick={() => history.back()}
                    disabled={submitting}
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    className="rounded-md bg-[#11191f] px-4 py-2 text-sm font-medium text-gray-200 shadow-sm"
                    disabled={submitting}
                >
                    {submitting ? "Đang lưu..." : "Lưu nhiều dòng dây"}
                </button>
            </div>
        </form>
    );
}