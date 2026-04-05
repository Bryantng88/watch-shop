"use client";

import { ProductType } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
    ChevronRight,
    Package,
    Plus,
    Save,
    ShoppingBag,
    Trash2,
    Wallet,
    Watch,
} from "lucide-react";
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

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function uid() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return Math.random().toString(36).slice(2, 10);
}

function formatMoney(value: number, currency: string) {
    return `${new Intl.NumberFormat("vi-VN").format(value)} ${currency}`;
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

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <div className="mb-1.5 text-sm font-medium text-slate-700">{children}</div>;
}

function CardSection({
    title,
    desc,
    icon,
    children,
    right,
}: {
    title: string;
    desc?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    right?: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
                <div className="flex items-start gap-3">
                    {icon ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                            {icon}
                        </div>
                    ) : null}
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                        {desc ? <p className="mt-1 text-sm text-slate-500">{desc}</p> : null}
                    </div>
                </div>
                {right}
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}

function TinyStat({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
            <div className="mt-1 text-base font-semibold text-slate-900">{value}</div>
        </div>
    );
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
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
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

function GuideContent() {
    return (
        <div className="space-y-4">
            {QUICK_GUIDE_GROUPS.map((group) => (
                <div
                    key={group.title}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                >
                    <div className="mb-3 text-sm font-semibold text-slate-800">{group.title}</div>

                    <div className="space-y-3">
                        {group.items.map((item) => (
                            <div key={item.label}>
                                <div className="mb-1.5 text-sm font-medium text-slate-700">{item.label}</div>
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

            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <div className="font-medium">Ví dụ nhập nhanh</div>
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
        <form id="acq-form" onSubmit={onSubmit} className="w-full min-w-0 pb-28">
            <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-32">
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Link href="/admin/acquisitions" className="hover:text-slate-700">
                                    Phiếu nhập
                                </Link>
                                <ChevronRight className="h-4 w-4" />
                                <span>Tạo mới</span>
                            </div>

                            <div>
                                <h1 className="text-2xl font-semibold text-slate-900">Tạo phiếu nhập</h1>
                                <p className="mt-1 text-sm text-slate-500">
                                    Giữ nguyên logic hiện tại, chỉ tối ưu bố cục để đồng bộ với format phiếu đánh giá kỹ thuật.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <TinyStat label="Trạng thái" value="DRAFT" />
                            <TinyStat label="Đồng hồ" value={watchLines.filter((x) => x.title.trim()).length} />
                            <TinyStat label="Dây" value={strapLines.filter((x) => x.title.trim()).length} />
                            <TinyStat label="Tổng tạm" value={formatMoney(total, formData.currency)} />
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="space-y-6">
                        <CardSection
                            title="Thông tin phiếu"
                            desc="Vendor, thời gian tiếp nhận, loại phiếu và ghi chú chung."
                            icon={<ShoppingBag className="h-5 w-5" />}
                        >
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <FieldLabel>Vendor</FieldLabel>

                                        {!showQuickVendor ? (
                                            <div className="space-y-3">
                                                <select
                                                    name="vendorId"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
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
                                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Thêm nhanh vendor mới
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                                <FieldLabel>Tên vendor mới</FieldLabel>
                                                <input
                                                    name="quickVendorName"
                                                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                                    value={formData.quickVendorName}
                                                    onChange={handleChange}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowQuickVendor(false)}
                                                    className="mt-3 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white"
                                                >
                                                    Huỷ thêm mới
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <FieldLabel>Ghi chú</FieldLabel>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            className="min-h-[120px] w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <FieldLabel>Ngày nhập</FieldLabel>
                                        <input
                                            name="acquiredAt"
                                            type="datetime-local"
                                            value={formData.acquiredAt}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                        />
                                    </div>

                                    <div>
                                        <FieldLabel>Tiền tệ</FieldLabel>
                                        <select
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                        >
                                            {CURRENCIES.map((currency) => (
                                                <option key={currency}>{currency}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <FieldLabel>Loại phiếu</FieldLabel>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                        >
                                            {TYPES.map((type) => (
                                                <option key={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </CardSection>

                        <CardSection
                            title="Danh sách đồng hồ"
                            desc="Nhập mô tả nhanh để hệ thống parse rule như form kỹ thuật đang làm."
                            icon={<Watch className="h-5 w-5" />}
                            right={
                                <button
                                    type="button"
                                    onClick={() => setWatchLines((prev) => [...prev, newWatchLine()])}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Thêm đồng hồ
                                </button>
                            }
                        >
                            <div className="space-y-4">
                                {watchLines.map((line, index) => {
                                    const rowTotal =
                                        Number(line.quantity || 0) * Number(line.unitCost || 0);

                                    return (
                                        <div
                                            key={line.id}
                                            className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                                        >
                                            <div className="mb-4 flex items-start justify-between gap-3">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                                                        Đồng hồ #{index + 1}
                                                    </span>
                                                    {line.title.trim() ? (
                                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                            Đã nhập nội dung
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                                                            Dòng trống
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setWatchLines((prev) =>
                                                            prev.length === 1
                                                                ? prev.map((item) =>
                                                                    item.id === line.id ? newWatchLine() : item
                                                                )
                                                                : prev.filter((item) => item.id !== line.id)
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Xoá
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                                                <div className="xl:col-span-7">
                                                    <FieldLabel>Mô tả nhanh / tên đồng hồ</FieldLabel>
                                                    <input
                                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                                        value={line.title}
                                                        placeholder="VD: seiko tự động tròn mặt đen dây thép"
                                                        onChange={(e) => setWatchTitle(line.id, e.target.value)}
                                                    />
                                                    <QuickRuleChips spec={line.quickSpec} />
                                                </div>

                                                <div className="xl:col-span-2">
                                                    <FieldLabel>Số lượng</FieldLabel>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-right"
                                                        value={line.quantity}
                                                        onChange={(e) =>
                                                            setWatchLine(line.id, "quantity", Number(e.target.value || 1))
                                                        }
                                                    />
                                                </div>

                                                <div className="xl:col-span-3">
                                                    <FieldLabel>Giá nhập</FieldLabel>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-right"
                                                        value={line.unitCost}
                                                        onChange={(e) =>
                                                            setWatchLine(line.id, "unitCost", Number(e.target.value || 0))
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                                                <div className="mb-3 text-sm font-medium text-slate-700">
                                                    Trạng thái tiếp nhận
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <FlagCheckbox
                                                        checked={!!line.watchFlags?.needService}
                                                        label="Service"
                                                        onChange={(v) => setWatchFlag(line.id, "needService", v)}
                                                    />
                                                    <FlagCheckbox
                                                        checked={!!line.watchFlags?.hasStrap}
                                                        label="Có dây"
                                                        onChange={(v) => setWatchFlag(line.id, "hasStrap", v)}
                                                    />
                                                    <FlagCheckbox
                                                        checked={!!line.watchFlags?.hasClasp}
                                                        label="Có khóa"
                                                        onChange={(v) => setWatchFlag(line.id, "hasClasp", v)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                                                <div className="text-sm text-slate-500">Thành tiền dòng này</div>
                                                <div className="text-base font-semibold text-slate-900">
                                                    {formatMoney(rowTotal, formData.currency)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardSection>

                        <CardSection
                            title="Danh sách dây"
                            desc="Giữ nguyên logic strapSpec, chỉ đổi layout cho dễ nhìn hơn."
                            icon={<Package className="h-5 w-5" />}
                            right={
                                <button
                                    type="button"
                                    onClick={() => setStrapLines((prev) => [...prev, newStrapLine()])}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Thêm dây
                                </button>
                            }
                        >
                            {strapLines.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                    Chưa có dòng dây nào.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {strapLines.map((line, index) => {
                                        const rowTotal =
                                            Number(line.quantity || 0) * Number(line.unitCost || 0);

                                        return (
                                            <div
                                                key={line.id}
                                                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                                            >
                                                <div className="mb-4 flex items-start justify-between gap-3">
                                                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
                                                        Dây #{index + 1}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setStrapLines((prev) =>
                                                                prev.filter((item) => item.id !== line.id)
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Xoá
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                                                    <div className="xl:col-span-5">
                                                        <FieldLabel>Tên / mô tả dây</FieldLabel>
                                                        <input
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                                            value={line.title}
                                                            onChange={(e) =>
                                                                setStrapLine(line.id, "title", e.target.value)
                                                            }
                                                            placeholder="VD: Dây da bò nâu 20-18"
                                                        />
                                                    </div>

                                                    <div className="xl:col-span-3">
                                                        <FieldLabel>Chất liệu</FieldLabel>
                                                        <select
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                                            value={line.material}
                                                            onChange={(e) =>
                                                                setStrapLine(
                                                                    line.id,
                                                                    "material",
                                                                    e.target.value as StrapMaterial
                                                                )
                                                            }
                                                        >
                                                            {STRAP_MATERIALS.map((material) => (
                                                                <option key={material.value} value={material.value}>
                                                                    {material.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="xl:col-span-2">
                                                        <FieldLabel>Số lượng</FieldLabel>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-right"
                                                            value={line.quantity}
                                                            onChange={(e) =>
                                                                setStrapLine(
                                                                    line.id,
                                                                    "quantity",
                                                                    Number(e.target.value || 1)
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="xl:col-span-2">
                                                        <FieldLabel>Giá nhập</FieldLabel>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-right"
                                                            value={line.unitCost}
                                                            onChange={(e) =>
                                                                setStrapLine(
                                                                    line.id,
                                                                    "unitCost",
                                                                    Number(e.target.value || 0)
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                                                    <div>
                                                        <FieldLabel>Đầu dây (mm)</FieldLabel>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-right"
                                                            value={line.lugWidthMM}
                                                            onChange={(e) =>
                                                                setStrapLine(
                                                                    line.id,
                                                                    "lugWidthMM",
                                                                    Number(e.target.value || 0)
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <FieldLabel>Đuôi dây (mm)</FieldLabel>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-right"
                                                            value={line.buckleWidthMM}
                                                            onChange={(e) =>
                                                                setStrapLine(
                                                                    line.id,
                                                                    "buckleWidthMM",
                                                                    Number(e.target.value || 0)
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <FieldLabel>Màu sắc</FieldLabel>
                                                        <input
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5"
                                                            value={line.color}
                                                            onChange={(e) =>
                                                                setStrapLine(line.id, "color", e.target.value)
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <FieldLabel>Giá bán dự kiến</FieldLabel>
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-right"
                                                            value={line.sellPrice}
                                                            onChange={(e) =>
                                                                setStrapLine(
                                                                    line.id,
                                                                    "sellPrice",
                                                                    Number(e.target.value || 0)
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex items-end">
                                                        <FlagCheckbox
                                                            checked={line.quickRelease}
                                                            label="Quick release"
                                                            onChange={(checked) =>
                                                                setStrapLine(line.id, "quickRelease", checked)
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
                                                    <div className="text-sm text-slate-500">Thành tiền dòng này</div>
                                                    <div className="text-base font-semibold text-slate-900">
                                                        {formatMoney(rowTotal, formData.currency)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardSection>

                        {err ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {err}
                            </div>
                        ) : null}

                        {okMsg ? (
                            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {okMsg}
                            </div>
                        ) : null}
                    </div>

                    <div className="space-y-6">
                        <CardSection
                            title="Tổng quan phiếu"
                            desc="Tóm tắt nhanh để đối chiếu trước khi lưu."
                            icon={<Wallet className="h-5 w-5" />}
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <span className="text-sm text-slate-600">Tổng đồng hồ</span>
                                    <span className="font-semibold text-slate-900">
                                        {formatMoney(watchTotal, formData.currency)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <span className="text-sm text-slate-600">Tổng dây</span>
                                    <span className="font-semibold text-slate-900">
                                        {formatMoney(strapTotal, formData.currency)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900 px-4 py-3">
                                    <span className="text-sm text-slate-200">Tổng giá trị phiếu</span>
                                    <span className="text-lg font-semibold text-white">
                                        {formatMoney(total, formData.currency)}
                                    </span>
                                </div>
                            </div>
                        </CardSection>

                        <CardSection
                            title="Hướng dẫn nhập nhanh"
                            desc="Các keyword gợi ý cho quick rule."
                            icon={<Package className="h-5 w-5" />}
                        >
                            <GuideContent />
                        </CardSection>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setWatchLines((prev) => [...prev, newWatchLine()])}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                        >
                            <Plus className="h-4 w-4" />
                            Thêm đồng hồ
                        </button>

                        <button
                            type="button"
                            onClick={() => setStrapLines((prev) => [...prev, newStrapLine()])}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                        >
                            <Plus className="h-4 w-4" />
                            Thêm dây
                        </button>

                        {showAfterCreate ? (
                            <button
                                type="button"
                                onClick={resetFormForNew}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                            >
                                Tạo phiếu mới
                            </button>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <div className="text-xs text-slate-500">Tổng giá trị</div>
                            <div className="text-base font-semibold text-slate-900">
                                {formatMoney(total, formData.currency)}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                            <Save className="h-4 w-4" />
                            {saving ? "Đang lưu..." : "Lưu phiếu nhập"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}