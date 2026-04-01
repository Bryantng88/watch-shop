"use client";

import { ProductType } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
    applyQuickWatchSpecToFlags,
    getQuickWatchSpecChips,
    parseQuickWatchSpec,
    type QuickWatchSpec,
} from "../_shared/quick-watch-rule";

type Vendor = { id: string; name: string };
type Props = { vendors: Vendor[] };

type WatchFlags = {
    hasStrap: boolean;
    needService: boolean;
    hasClasp: boolean;
};

type WatchLine = {
    id: string;
    title: string;
    quantity: number;
    unitCost: number;
    watchFlags: WatchFlags;
    quickSpec?: QuickWatchSpec | null;
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

const QUICK_GUIDE_GROUPS = [
    {
        title: "Cơ bản",
        items: [
            { label: "Brand", hints: ["seiko", "citizen", "omega", "longines"] },
            { label: "Máy", hints: ["tự động", "automatic", "pin", "quartz", "kinetic"] },
            { label: "Dáng", hints: ["tròn", "vuông", "tank", "chữ nhật"] },
            { label: "Mặt", hints: ["mặt đen", "mặt trắng", "bạc", "xanh", "champagne"] },
            { label: "Dây", hints: ["dây thép", "dây da", "cao su", "nato"] },
        ],
    },
    {
        title: "Nâng cao",
        items: [
            { label: "Fullset", hints: ["fullset", "có hộp", "có sổ", "có thẻ", "no box"] },
            { label: "Vỏ", hints: ["vỏ thép", "titanium", "vàng", "demi"] },
            { label: "Danh mục", hints: ["dress", "tool", "diver", "chronograph", "tank"] },
        ],
    },
];

function uid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return Math.random().toString(36).slice(2, 10);
}

function defaultWatchFlags(): WatchFlags {
    return {
        hasStrap: true,
        needService: true,
        hasClasp: false,
    };
}

function buildWatchLineState(
    title = "",
    currentFlags?: WatchFlags
): Pick<WatchLine, "title" | "quickSpec" | "watchFlags"> {
    const quickSpec = parseQuickWatchSpec(title);

    const isBracelet = quickSpec?.strapType === "STEEL";

    return {
        title,
        quickSpec,
        watchFlags: {
            hasStrap: isBracelet ? true : (currentFlags?.hasStrap ?? true),
            hasClasp: isBracelet ? true : (currentFlags?.hasClasp ?? false),
            needService: currentFlags?.needService ?? true,
        },
    };
}
function newWatchLine(): WatchLine {
    const base = buildWatchLineState("");
    return {
        id: uid(),
        title: base.title,
        quantity: 1,
        unitCost: 0,
        watchFlags: base.watchFlags,
        quickSpec: base.quickSpec,
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
        <label className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
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

function SectionCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900">{title}</h3>
            {children}
        </div>
    );
}

function GuideContent() {
    return (
        <div className="space-y-4">
            {QUICK_GUIDE_GROUPS.map((group) => (
                <div
                    key={group.title}
                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"
                >
                    <div className="mb-3 text-sm font-semibold text-slate-800">{group.title}</div>

                    <div className="space-y-3">
                        {group.items.map((item) => (
                            <div key={item.label}>
                                <div className="mb-1 text-sm font-medium text-slate-700">{item.label}</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {item.hints.map((hint) => (
                                        <span
                                            key={hint}
                                            className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
                                        >
                                            {hint}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-900">
                <div className="font-medium">Ví dụ</div>
                <div className="mt-1 leading-6">Seiko tự động mặt trắng dây thép có hộp sổ thẻ</div>
            </div>
        </div>
    );
}


export default function NewAcqForm({ vendors }: Props) {
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
        () => watchLines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.unitCost || 0), 0),
        [watchLines]
    );

    const strapTotal = useMemo(
        () => strapLines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.unitCost || 0), 0),
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
        setWatchLines((prev) => prev.map((line) => (line.id === id ? { ...line, [key]: value } : line)));
    }

    function setWatchTitle(id: string, title: string) {
        setWatchLines((prev) => {
            const next = prev.map((line) => {
                if (line.id !== id) return line;
                const parsed = buildWatchLineState(title, line.watchFlags);
                return {
                    ...line,
                    title: parsed.title,
                    quickSpec: parsed.quickSpec,
                    watchFlags: parsed.watchFlags,
                };
            });

            const editedIndex = next.findIndex((x) => x.id === id);
            const isLastRow = editedIndex === next.length - 1;
            const hasValue = title.trim().length > 0;
            const lastRowHasContent = next[next.length - 1]?.title?.trim().length > 0;

            if (isLastRow && hasValue && lastRowHasContent) {
                next.push(newWatchLine());
            }

            return next;
        });
    }

    function setWatchFlag(id: string, key: keyof WatchFlags, value: boolean) {
        setWatchLines((prev) =>
            prev.map((line) =>
                line.id === id
                    ? { ...line, watchFlags: { ...line.watchFlags, [key]: value } }
                    : line
            )
        );
    }

    function setStrapLine<K extends keyof StrapLine>(id: string, key: K, value: StrapLine[K]) {
        setStrapLines((prev) => prev.map((line) => (line.id === id ? { ...line, [key]: value } : line)));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setOkMsg(null);
        setSaving(true);

        try {
            const watchItems = watchLines
                .filter((line) => line.title.trim())
                .map((line) => {
                    const quickSpec = parseQuickWatchSpec(line.title.trim());
                    return {
                        title: line.title.trim(),
                        quantity: Number(line.quantity || 1),
                        unitCost: Number(line.unitCost || 0),
                        productType: ProductType.WATCH,
                        watchFlags: applyQuickWatchSpecToFlags(quickSpec, line.watchFlags),
                        quickSpec,
                    };
                });

            const strapItems = strapLines
                .filter((line) => line.title.trim())
                .map((line) => ({
                    title: line.title.trim(),
                    quantity: Number(line.quantity || 1),
                    unitCost: Number(line.unitCost || 0),
                    productType: ProductType.WATCH_STRAP,
                    strapSpec: {
                        material: line.material,
                        lugWidthMM: Number(line.lugWidthMM || 0),
                        buckleWidthMM: Number(line.buckleWidthMM || 0),
                        color: line.color.trim(),
                        quickRelease: line.quickRelease,
                        sellPrice: Number(line.sellPrice || 0),
                    },
                }));

            const items = [...watchItems, ...strapItems];
            if (!items.length) throw new Error("Vui lòng nhập ít nhất 1 dòng đồng hồ hoặc dây");

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
            if (!res.ok) throw new Error(data?.error || "Tạo phiếu nhập thất bại");

            setOkMsg("Đã tạo phiếu thành công");
            setShowAfterCreate(true);
        } catch (error: any) {
            setErr(error?.message || "Có lỗi xảy ra");
        } finally {
            setSaving(false);
        }
    }

    function resetFormForNew() {
        setErr(null);
        setOkMsg(null);
        setShowQuickVendor(false);
        setShowAfterCreate(false);
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

    return (
        <form id="acq-form" onSubmit={onSubmit} className="w-full min-w-0 pb-24">
            <div className="mx-auto w-full max-w-6xl space-y-6 px-4 pb-28 xl:max-w-7xl">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold">Tạo phiếu nhập (DRAFT)</h1>
                    <Link
                        href="/admin/acquisitions"
                        className="shrink-0 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                        ← Danh sách
                    </Link>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <SectionCard title="Vendor">
                            {!showQuickVendor ? (
                                <>
                                    <select
                                        name="vendorId"
                                        className="mb-3 w-full rounded-md border border-slate-300 px-3 py-2"
                                        value={formData.vendorId}
                                        onChange={handleChange}
                                    >
                                        <option value="">-- Chọn vendor --</option>
                                        {vendors.map((vendor) => (
                                            <option key={vendor.id} value={vendor.id}>
                                                {vendor.name}
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
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Tên vendor mới
                                    </label>
                                    <input
                                        name="quickVendorName"
                                        className="w-full rounded-md border border-slate-300 px-3 py-2"
                                        value={formData.quickVendorName}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowQuickVendor(false)}
                                        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-white"
                                    >
                                        Huỷ thêm mới
                                    </button>
                                </div>
                            )}

                            <label className="mt-4 block text-sm font-medium text-slate-700">Ghi chú</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="mt-1 min-h-[100px] w-full rounded-md border border-slate-300 px-3 py-2"
                            />
                        </SectionCard>

                        <SectionCard title="Thông tin phiếu">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Ngày nhập</label>
                                    <input
                                        name="acquiredAt"
                                        type="datetime-local"
                                        value={formData.acquiredAt}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Tiền tệ</label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                    >
                                        {CURRENCIES.map((currency) => (
                                            <option key={currency}>{currency}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Loại phiếu</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                                    >
                                        {TYPES.map((type) => (
                                            <option key={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </SectionCard>
                    </div>


                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900">Nhập đồng hồ</h3>
                                <p className="text-sm text-slate-500">
                                    Rule sẽ tự nhận diện brand, máy, dáng mặt, màu mặt, loại dây, fullset, chất liệu vỏ và danh mục từ ô mô tả nhanh.
                                </p>
                            </div>

                        </div>

                        <div className="space-y-4">
                            {watchLines.map((line) => {
                                const rowTotal = Number(line.quantity || 0) * Number(line.unitCost || 0);

                                return (
                                    <div key={line.id} className="rounded-xl border border-slate-200 p-4">
                                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_92px_120px_72px]">
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                                    Mô tả nhanh / tên đồng hồ
                                                </label>
                                                <input
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2"
                                                    value={line.title}
                                                    placeholder="VD: seiko tự động tròn mặt đen dây thép"
                                                    onChange={(e) => setWatchTitle(line.id, e.target.value)}
                                                />
                                                <QuickRuleChips spec={line.quickSpec} />
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-slate-700">SL</label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-right"
                                                    value={line.quantity}
                                                    onChange={(e) =>
                                                        setWatchLine(line.id, "quantity", Number(e.target.value || 1))
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-slate-700">Giá nhập</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-right"
                                                    value={line.unitCost}
                                                    onChange={(e) =>
                                                        setWatchLine(line.id, "unitCost", Number(e.target.value || 0))
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-end justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setWatchLines((prev) =>
                                                            prev.length === 1
                                                                ? prev
                                                                : prev.filter((item) => item.id !== line.id)
                                                        )
                                                    }
                                                    className="rounded-md border border-slate-300 px-2.5 py-2 text-xs hover:bg-slate-50"
                                                >
                                                    Xoá
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div className="flex flex-wrap gap-2">
                                                <FlagCheckbox
                                                    checked={line.watchFlags.needService}
                                                    label="Service"
                                                    onChange={(v) => setWatchFlag(line.id, "needService", v)}
                                                />
                                            </div>

                                            <div className="text-sm font-semibold text-slate-800">
                                                Thành tiền: {new Intl.NumberFormat("vi-VN").format(rowTotal)} {formData.currency}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 flex justify-start">
                            <button
                                type="button"
                                onClick={() => setWatchLines((prev) => [...prev, newWatchLine()])}
                                className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                            >
                                + Thêm đồng hồ
                            </button>
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="font-semibold text-slate-900">Nhập dây</h3>
                                <p className="text-sm text-slate-500">
                                    Dây nhập đầy đủ spec để tạo StrapVariantSpec khi duyệt phiếu.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStrapLines((prev) => [...prev, newStrapLine()])}
                                className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                            >
                                + Thêm dây
                            </button>
                        </div>

                        {strapLines.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                                Chưa có dòng dây nào.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50">
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
                                                <tr key={line.id} className="border-t border-slate-200">
                                                    <td className="px-3 py-3">
                                                        <input
                                                            className="w-56 rounded-md border border-slate-300 px-3 py-2"
                                                            value={line.title}
                                                            onChange={(e) => setStrapLine(line.id, "title", e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <select
                                                            className="w-36 rounded-md border border-slate-300 px-3 py-2"
                                                            value={line.material}
                                                            onChange={(e) =>
                                                                setStrapLine(line.id, "material", e.target.value as StrapMaterial)
                                                            }
                                                        >
                                                            {STRAP_MATERIALS.map((material) => (
                                                                <option key={material.value} value={material.value}>
                                                                    {material.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-3 py-3 text-right">
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            className="w-24 rounded-md border border-slate-300 px-3 py-2 text-right"
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
                                                            className="w-24 rounded-md border border-slate-300 px-3 py-2 text-right"
                                                            value={line.buckleWidthMM}
                                                            onChange={(e) =>
                                                                setStrapLine(line.id, "buckleWidthMM", Number(e.target.value || 0))
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-3 py-3">
                                                        <input
                                                            className="w-28 rounded-md border border-slate-300 px-3 py-2"
                                                            value={line.color}
                                                            onChange={(e) => setStrapLine(line.id, "color", e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={line.quickRelease}
                                                            onChange={(e) => setStrapLine(line.id, "quickRelease", e.target.checked)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-3 text-right">
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            className="w-24 rounded-md border border-slate-300 px-3 py-2 text-right"
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
                                                            className="w-32 rounded-md border border-slate-300 px-3 py-2 text-right"
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
                                                            className="w-32 rounded-md border border-slate-300 px-3 py-2 text-right"
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
                                                            onClick={() =>
                                                                setStrapLines((prev) =>
                                                                    prev.filter((item) => item.id !== line.id)
                                                                )
                                                            }
                                                            className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
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
                    </section>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">Tổng giá trị phiếu</span>
                            <span className="text-lg font-semibold text-slate-900">
                                {new Intl.NumberFormat("vi-VN").format(total)} {formData.currency}
                            </span>
                        </div>
                    </div>

                    {err ? (
                        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {err}
                        </div>
                    ) : null}

                    {okMsg ? (
                        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {okMsg}
                        </div>
                    ) : null}
                </div>


            </div>

            <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
                <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setWatchLines((prev) => [...prev, newWatchLine()])}
                            className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                        >
                            + Thêm đồng hồ
                        </button>

                        <button
                            type="button"
                            onClick={() => setStrapLines((prev) => [...prev, newStrapLine()])}
                            className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                        >
                            + Thêm dây
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        {showAfterCreate ? (
                            <button
                                type="button"
                                onClick={resetFormForNew}
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                            >
                                Tạo phiếu mới
                            </button>
                        ) : null}

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                        >
                            {saving ? "Đang lưu..." : "Lưu phiếu nhập"}
                        </button>
                    </div>
                </div>
            </div>


        </form >
    );
}