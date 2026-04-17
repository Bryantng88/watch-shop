"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import {
    BookOpen,
    Boxes,
    FileText,
    Gem,
    Image as ImageIcon,
    Pencil,
    Save,
    Settings2,
    Tag,
    Wrench,
} from "lucide-react";

import { submitWatchForm } from "./watch-form.actions";
import { mapWatchDetailToFormValues } from "./watch-form.mapper";
import type { WatchFormValues } from "./watch-form.types";
import type { WatchDetailModel } from "../server/shared/watch.types";
import {
    Badge,
    Field,
    formatMoneyPreview,
    Input,
    Section,
    Select,
    SideStat,
    statusTone,
    Textarea,
    Toggle,
} from "./edit/shared";

type SimpleOption = { id: string; name: string; slug?: string | null };

type Props = {
    detail: WatchDetailModel;
    brands?: SimpleOption[];
    vendors?: SimpleOption[];
    categories?: SimpleOption[];
    canEditPricing?: boolean;
};

const PRODUCT_STATUS_OPTIONS = ["DRAFT", "AVAILABLE", "HOLD", "SOLD"];
const GENDER_OPTIONS = ["MEN", "WOMEN", "UNISEX"];
const SITE_CHANNEL_OPTIONS = ["AFFORDABLE", "LUXURY"];
const MATERIAL_PROFILE_OPTIONS = ["SINGLE_MATERIAL", "BIMETAL", "COATED", "OTHER"];
const PRIMARY_MATERIAL_OPTIONS = [
    "STAINLESS_STEEL",
    "TITANIUM",
    "CERAMIC",
    "CARBON",
    "GOLD",
    "PLATINUM",
    "SILVER",
    "BRASS",
    "OTHER",
];
const GOLD_TREATMENT_OPTIONS = ["", "SOLID_GOLD", "CAPPED_GOLD", "GOLD_PLATED", "GOLD_VERMEIL", "GOLD_FILLED"];
const GOLD_COLOR_OPTIONS = ["YELLOW", "WHITE", "ROSE", "MIXED"] as const;
const CASE_SHAPE_OPTIONS = ["ROUND", "TONNEAU", "CUSHION", "RECTANGLE", "SQUARE", "OVAL"];
const CRYSTAL_OPTIONS = ["", "ACRYLIC", "MINERAL", "SAPPHIRE"];
const BRACELET_TYPE_OPTIONS = ["", "LEATHER", "STEEL", "RUBBER", "NYLON", "TWO_PIECE", "BRACELET"];
const MOVEMENT_OPTIONS = ["", "MANUAL_WIND", "AUTOMATIC", "QUARTZ", "SOLAR", "KINETIC"];

function imageSrc(raw?: string | null) {
    if (!raw) return "";
    if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) {
        return raw;
    }
    return `/api/media/sign?key=${encodeURIComponent(raw)}`;
}

export default function WatchFormClient({
    detail,
    brands = [],
    vendors = [],
    categories = [],
    canEditPricing = false,
}: Props) {
    const initialValues = useMemo(() => mapWatchDetailToFormValues(detail), [detail]);
    const [values, setValues] = useState<WatchFormValues>(initialValues);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");

    function setCore<K extends keyof WatchFormValues["core"]>(key: K, value: WatchFormValues["core"][K]) {
        setValues((prev) => ({ ...prev, core: { ...prev.core, [key]: value } }));
    }

    function setSpec<K extends keyof WatchFormValues["spec"]>(key: K, value: WatchFormValues["spec"][K]) {
        setValues((prev) => ({ ...prev, spec: { ...prev.spec, [key]: value } }));
    }

    function setPricing<K extends keyof WatchFormValues["pricing"]>(key: K, value: WatchFormValues["pricing"][K]) {
        setValues((prev) => ({ ...prev, pricing: { ...prev.pricing, [key]: value } }));
    }

    function setContent<K extends keyof WatchFormValues["content"]>(key: K, value: WatchFormValues["content"][K]) {
        setValues((prev) => ({ ...prev, content: { ...prev.content, [key]: value } }));
    }

    function onSubmit() {
        setMessage("");
        setError("");

        startTransition(async () => {
            try {
                const result = await submitWatchForm(values, initialValues);
                setMessage(result?.message ?? "Đã lưu watch");
            } catch (err: any) {
                setError(err?.message ?? "Lưu thất bại");
            }
        });
    }

    const heroImage = useMemo(() => {
        const gallery = detail?.images?.find((img: any) => String(img?.role ?? "").toUpperCase() === "GALLERY");
        return imageSrc(gallery?.url ?? gallery?.fileKey ?? detail?.primaryImageUrl ?? null);
    }, [detail]);

    const hasContent = Boolean(
        values.content.summary.trim() ||
        values.content.hookText.trim() ||
        values.content.body.trim() ||
        values.content.bulletSpecsText.trim()
    );
    const hasPrice = Boolean(values.pricing.salePrice || values.pricing.listPrice);
    const priceChanged =
        values.pricing.salePrice !== initialValues.pricing.salePrice ||
        values.pricing.listPrice !== initialValues.pricing.listPrice ||
        values.pricing.minPrice !== initialValues.pricing.minPrice ||
        values.pricing.costPrice !== initialValues.pricing.costPrice;

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <Link href="/admin/watches" className="hover:text-slate-700">Watch</Link>
                            <span>/</span>
                            <Link href={`/admin/watches/${detail.productId}`} className="hover:text-slate-700">{detail.title || detail.sku || detail.productId}</Link>
                            <span>/</span>
                            <span>Edit</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Chỉnh sửa watch</h1>
                            <Badge label={values.core.status || "DRAFT"} tone={statusTone(values.core.status)} />
                            {values.core.saleState ? <Badge label={values.core.saleState} tone={statusTone(values.core.saleState)} /> : null}
                            {values.core.serviceState ? <Badge label={`Service ${values.core.serviceState}`} tone={statusTone(values.core.serviceState)} /> : null}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                            <span>SKU: <span className="font-medium text-slate-700">{values.core.sku || "-"}</span></span>
                            <span>Brand: <span className="font-medium text-slate-700">{brands.find((x) => x.id === values.core.brandId)?.name || detail.brand?.name || "-"}</span></span>
                            <span>Updated: <span className="font-medium text-slate-700">{detail.updatedAt ? new Date(detail.updatedAt).toLocaleString("vi-VN") : "-"}</span></span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/admin/watches/${detail.productId}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            Xem detail
                        </Link>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={isPending}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save className="h-4 w-4" />
                            {isPending ? "Đang lưu..." : "Lưu watch"}
                        </button>
                    </div>
                </div>

                {message ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
                {error ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    <Section title="Core & vận hành" desc="Những thông tin gốc cần ổn định như product edit." icon={<Pencil className="h-5 w-5" />}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field label="Title" span={2}>
                                <Input value={values.core.title} onChange={(e) => setCore("title", e.target.value)} placeholder="Tên watch" />
                            </Field>
                            <Field label="Slug">
                                <Input value={values.core.slug} onChange={(e) => setCore("slug", e.target.value)} placeholder="slug" />
                            </Field>
                            <Field label="SKU">
                                <Input value={values.core.sku} onChange={(e) => setCore("sku", e.target.value)} placeholder="SKU" />
                            </Field>
                            <Field label="Brand">
                                <Select value={values.core.brandId} onChange={(e) => setCore("brandId", e.target.value)}>
                                    <option value="">Chọn brand</option>
                                    {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                                </Select>
                            </Field>
                            <Field label="Vendor">
                                <Select value={values.core.vendorId} onChange={(e) => setCore("vendorId", e.target.value)}>
                                    <option value="">Chọn vendor</option>
                                    {vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
                                </Select>
                            </Field>
                            <Field label="Category">
                                <Select value={values.core.categoryId} onChange={(e) => setCore("categoryId", e.target.value)}>
                                    <option value="">Chọn category</option>
                                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </Select>
                            </Field>
                            <Field label="Product status">
                                <Select value={values.core.status} onChange={(e) => setCore("status", e.target.value)}>
                                    {PRODUCT_STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                                </Select>
                            </Field>
                            <Field label="Gender">
                                <Select value={values.core.gender} onChange={(e) => setCore("gender", e.target.value as any)}>
                                    {GENDER_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                                </Select>
                            </Field>
                            <Field label="Site channel">
                                <Select value={values.core.siteChannel} onChange={(e) => setCore("siteChannel", e.target.value as any)}>
                                    {SITE_CHANNEL_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                                </Select>
                            </Field>
                            <Field label="Stock state">
                                <Input value={values.core.stockState} onChange={(e) => setCore("stockState", e.target.value)} placeholder="IN_STOCK / RESERVED / ..." />
                            </Field>
                            <Field label="Sale state">
                                <Input value={values.core.saleState} onChange={(e) => setCore("saleState", e.target.value)} placeholder="READY / HOLD / ..." />
                            </Field>
                            <Field label="Service state">
                                <Input value={values.core.serviceState} onChange={(e) => setCore("serviceState", e.target.value)} placeholder="PENDING / IN_SERVICE / ..." />
                            </Field>
                            <Field label="Condition grade">
                                <Input value={values.core.conditionGrade} onChange={(e) => setCore("conditionGrade", e.target.value)} placeholder="A / B / NOS / ..." />
                            </Field>
                            <Field label="Movement type">
                                <Select value={values.core.movementType} onChange={(e) => setCore("movementType", e.target.value)}>
                                    {MOVEMENT_OPTIONS.map((item) => <option key={item} value={item}>{item || "Chưa chọn"}</option>)}
                                </Select>
                            </Field>
                            <Field label="Movement calibre">
                                <Input value={values.core.movementCalibre} onChange={(e) => setCore("movementCalibre", e.target.value)} placeholder="L993.1 / 7S26 / ..." />
                            </Field>
                            <Field label="Serial number">
                                <Input value={values.core.serialNumber} onChange={(e) => setCore("serialNumber", e.target.value)} placeholder="Serial" />
                            </Field>
                            <Field label="Year text">
                                <Input value={values.core.yearText} onChange={(e) => setCore("yearText", e.target.value)} placeholder="1970s / 1998 / ..." />
                            </Field>
                            <Field label="SEO title" span={2}>
                                <Input value={values.core.seoTitle} onChange={(e) => setCore("seoTitle", e.target.value)} placeholder="SEO title" />
                            </Field>
                            <Field label="SEO description" span={2}>
                                <Textarea value={values.core.seoDescription} onChange={(e) => setCore("seoDescription", e.target.value)} placeholder="SEO description" className="min-h-[96px]" />
                            </Field>
                            <Field label="Primary image URL" span={2}>
                                <Input value={values.core.primaryImageUrl} onChange={(e) => setCore("primaryImageUrl", e.target.value)} placeholder="https://... hoặc media key" />
                            </Field>
                            <Field label="Storefront image key" span={2}>
                                <Input value={values.core.storefrontImageKey} onChange={(e) => setCore("storefrontImageKey", e.target.value)} placeholder="product/inline/..." />
                            </Field>
                            <Field label="Ghi chú nội bộ" span={2}>
                                <Textarea value={values.core.notes} onChange={(e) => setCore("notes", e.target.value)} placeholder="Ghi chú vận hành, service, sale..." className="min-h-[120px]" />
                            </Field>
                            <Field label="Phụ kiện đi kèm" span={2}>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <Toggle checked={values.core.hasBox} onChange={(checked) => setCore("hasBox", checked)} label="Has box" />
                                    <Toggle checked={values.core.hasPapers} onChange={(checked) => setCore("hasPapers", checked)} label="Has papers" />
                                </div>
                            </Field>
                        </div>
                    </Section>

                    <Section title="Spec & vật liệu" desc="Làm đúng format để chỗ khác còn lấy làm mẫu refactor." icon={<Gem className="h-5 w-5" />}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field label="Spec brand"><Input value={values.spec.brand} onChange={(e) => setSpec("brand", e.target.value)} placeholder="Citizen / Longines / ..." /></Field>
                            <Field label="Model"><Input value={values.spec.model} onChange={(e) => setSpec("model", e.target.value)} placeholder="Model" /></Field>
                            <Field label="Reference"><Input value={values.spec.referenceNumber} onChange={(e) => setSpec("referenceNumber", e.target.value)} placeholder="Reference" /></Field>
                            <Field label="Nickname"><Input value={values.spec.nickname} onChange={(e) => setSpec("nickname", e.target.value)} placeholder="Nickname" /></Field>
                            <Field label="Case shape"><Select value={values.spec.caseShape} onChange={(e) => setSpec("caseShape", e.target.value)}><option value="">Chưa chọn</option>{CASE_SHAPE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}</Select></Field>
                            <Field label="Dial color"><Input value={values.spec.dialColor} onChange={(e) => setSpec("dialColor", e.target.value)} placeholder="Green / Silver / ..." /></Field>
                            <Field label="Case size (mm)"><Input value={values.spec.caseSizeMM} onChange={(e) => setSpec("caseSizeMM", e.target.value)} placeholder="36" /></Field>
                            <Field label="Lug to lug (mm)"><Input value={values.spec.lugToLugMM} onChange={(e) => setSpec("lugToLugMM", e.target.value)} placeholder="44" /></Field>
                            <Field label="Lug width (mm)"><Input value={values.spec.lugWidthMM} onChange={(e) => setSpec("lugWidthMM", e.target.value)} placeholder="18" /></Field>
                            <Field label="Thickness (mm)"><Input value={values.spec.thicknessMM} onChange={(e) => setSpec("thicknessMM", e.target.value)} placeholder="11" /></Field>
                            <Field label="Crystal"><Select value={values.spec.crystal} onChange={(e) => setSpec("crystal", e.target.value)}>{CRYSTAL_OPTIONS.map((item) => <option key={item} value={item}>{item || "Chưa chọn"}</option>)}</Select></Field>
                            <Field label="Calibre"><Input value={values.spec.calibre} onChange={(e) => setSpec("calibre", e.target.value)} placeholder="7S26 / L993.1 / ..." /></Field>
                            <Field label="Material profile"><Select value={values.spec.materialProfile} onChange={(e) => setSpec("materialProfile", e.target.value as any)}>{MATERIAL_PROFILE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}</Select></Field>
                            <Field label="Primary material"><Select value={values.spec.primaryCaseMaterial} onChange={(e) => setSpec("primaryCaseMaterial", e.target.value as any)}>{PRIMARY_MATERIAL_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}</Select></Field>
                            <Field label="Secondary material"><Select value={values.spec.secondaryCaseMaterial} onChange={(e) => setSpec("secondaryCaseMaterial", e.target.value as any)}><option value="">Không có</option>{PRIMARY_MATERIAL_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}</Select></Field>
                            <Field label="Gold treatment"><Select value={values.spec.goldTreatment} onChange={(e) => setSpec("goldTreatment", e.target.value as any)}>{GOLD_TREATMENT_OPTIONS.map((item) => <option key={item} value={item}>{item || "Không có"}</option>)}</Select></Field>
                            <Field label="Gold karat"><Select value={values.spec.goldKarat} onChange={(e) => setSpec("goldKarat", e.target.value as any)}><option value="">Không có</option><option value="10">10K</option><option value="14">14K</option><option value="18">18K</option></Select></Field>
                            <Field label="Gold colors" span={2}>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {GOLD_COLOR_OPTIONS.map((color) => {
                                        const checked = values.spec.goldColors.includes(color);
                                        return (
                                            <Toggle
                                                key={color}
                                                checked={checked}
                                                onChange={(next) =>
                                                    setSpec(
                                                        "goldColors",
                                                        next ? [...values.spec.goldColors, color] : values.spec.goldColors.filter((x) => x !== color)
                                                    )
                                                }
                                                label={color}
                                            />
                                        );
                                    })}
                                </div>
                            </Field>
                            <Field label="Bracelet type"><Select value={values.spec.braceletType} onChange={(e) => setSpec("braceletType", e.target.value)}>{BRACELET_TYPE_OPTIONS.map((item) => <option key={item} value={item}>{item || "Chưa chọn"}</option>)}</Select></Field>
                            <Field label="Strap material text"><Input value={values.spec.strapMaterialText} onChange={(e) => setSpec("strapMaterialText", e.target.value)} placeholder="Leather / steel / ..." /></Field>
                            <Field label="Water resistance"><Input value={values.spec.waterResistance} onChange={(e) => setSpec("waterResistance", e.target.value)} placeholder="30m / 50m" /></Field>
                            <Field label="Power reserve"><Input value={values.spec.powerReserve} onChange={(e) => setSpec("powerReserve", e.target.value)} placeholder="40h" /></Field>
                            <Field label="Dial finish"><Input value={values.spec.dialFinish} onChange={(e) => setSpec("dialFinish", e.target.value)} placeholder="Sunburst / linen / ..." /></Field>
                            <Field label="Buckle type"><Input value={values.spec.buckleType} onChange={(e) => setSpec("buckleType", e.target.value)} placeholder="Pin buckle / deployant" /></Field>
                            <Field label="Material note" span={2}><Textarea value={values.spec.materialNote} onChange={(e) => setSpec("materialNote", e.target.value)} placeholder="Ghi chú vật liệu" className="min-h-[96px]" /></Field>
                            <Field label="Accessories from spec" span={2}>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <Toggle checked={values.spec.boxIncluded} onChange={(checked) => setSpec("boxIncluded", checked)} label="Box included" />
                                    <Toggle checked={values.spec.bookletIncluded} onChange={(checked) => setSpec("bookletIncluded", checked)} label="Booklet included" />
                                    <Toggle checked={values.spec.cardIncluded} onChange={(checked) => setSpec("cardIncluded", checked)} label="Card included" />
                                </div>
                            </Field>
                        </div>
                    </Section>

                    <Section title="Pricing" desc="Khối giá quan trọng, có notification khi thay đổi." icon={<Tag className="h-5 w-5" />} right={priceChanged ? <Badge label="Price changed" tone="amber" /> : null}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field label="Sale price">
                                <Input value={values.pricing.salePrice} onChange={(e) => setPricing("salePrice", e.target.value)} placeholder="0" disabled={!canEditPricing} />
                            </Field>
                            <Field label="List price">
                                <Input value={values.pricing.listPrice} onChange={(e) => setPricing("listPrice", e.target.value)} placeholder="0" disabled={!canEditPricing} />
                            </Field>
                            <Field label="Cost price">
                                <Input value={values.pricing.costPrice} onChange={(e) => setPricing("costPrice", e.target.value)} placeholder="0" disabled={!canEditPricing} />
                            </Field>
                            <Field label="Min price">
                                <Input value={values.pricing.minPrice} onChange={(e) => setPricing("minPrice", e.target.value)} placeholder="0" disabled={!canEditPricing} />
                            </Field>
                            <Field label="Service cost">
                                <Input value={values.pricing.serviceCost} onChange={(e) => setPricing("serviceCost", e.target.value)} placeholder="0" disabled={!canEditPricing} />
                            </Field>
                            <Field label="Landed cost">
                                <Input value={values.pricing.landedCost} onChange={(e) => setPricing("landedCost", e.target.value)} placeholder="0" disabled={!canEditPricing} />
                            </Field>
                            <Field label="Pricing note" span={2}>
                                <Textarea value={values.pricing.pricingNote} onChange={(e) => setPricing("pricingNote", e.target.value)} placeholder="Ghi chú pricing / margin / strategy" className="min-h-[110px]" disabled={!canEditPricing} />
                            </Field>
                        </div>
                        {!canEditPricing ? (
                            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                Tài khoản hiện tại không được chỉnh giá. Bạn vẫn có thể cập nhật core, spec và content.
                            </div>
                        ) : null}
                    </Section>

                    <Section title="Content" desc="Khối nội dung để vận hành và đăng bài." icon={<FileText className="h-5 w-5" />}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field label="Title override"><Input value={values.content.titleOverride} onChange={(e) => setContent("titleOverride", e.target.value)} placeholder="Title override" /></Field>
                            <Field label="SEO title"><Input value={values.content.seoTitle} onChange={(e) => setContent("seoTitle", e.target.value)} placeholder="SEO title" /></Field>
                            <Field label="Summary"><Textarea value={values.content.summary} onChange={(e) => setContent("summary", e.target.value)} placeholder="Summary" className="min-h-[120px]" /></Field>
                            <Field label="Hook"><Textarea value={values.content.hookText} onChange={(e) => setContent("hookText", e.target.value)} placeholder="Hook" className="min-h-[120px]" /></Field>
                            <Field label="Body" span={2}><Textarea value={values.content.body} onChange={(e) => setContent("body", e.target.value)} placeholder="Body" className="min-h-[180px]" /></Field>
                            <Field label="Bullet specs" span={2}><Textarea value={values.content.bulletSpecsText} onChange={(e) => setContent("bulletSpecsText", e.target.value)} placeholder={"Mỗi dòng là 1 bullet\nVí dụ:\nBộ máy automatic\nVỏ thép\nMặt số xanh"} className="min-h-[160px]" /></Field>
                            <Field label="SEO description" span={2}><Textarea value={values.content.seoDescription} onChange={(e) => setContent("seoDescription", e.target.value)} placeholder="SEO description" className="min-h-[120px]" /></Field>
                        </div>
                    </Section>
                </div>

                <div className="space-y-6 xl:col-span-4">
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"><ImageIcon className="h-5 w-5" /></div>
                                <div>
                                    <div className="text-base font-semibold text-slate-900">Media snapshot</div>
                                    <div className="text-sm text-slate-500">Xem nhanh ảnh và dữ liệu publish.</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                                {heroImage ? <img src={heroImage} alt={values.core.title || "watch"} className="h-[280px] w-full object-cover" /> : <div className="flex h-[280px] items-center justify-center text-sm text-slate-400">Chưa có ảnh</div>}
                            </div>
                        </div>
                    </div>

                    <Section title="Tóm tắt" desc="Khối nhìn nhanh giống product edit." icon={<Boxes className="h-5 w-5" />}>
                        <div className="grid grid-cols-1 gap-3">
                            <SideStat label="Giá bán" value={formatMoneyPreview(values.pricing.salePrice)} emphasize />
                            <SideStat label="Giá niêm yết" value={formatMoneyPreview(values.pricing.listPrice)} />
                            {canEditPricing ? <SideStat label="Giá mua" value={formatMoneyPreview(values.pricing.costPrice)} /> : null}
                            <SideStat label="Has content" value={hasContent ? "Có" : "Chưa"} hint={hasContent ? "Đã có summary / hook / body / bullet" : "Chưa đủ content"} />
                            <SideStat label="Brand / model" value={`${brands.find((x) => x.id === values.core.brandId)?.name || values.spec.brand || detail.brand?.name || "-"} / ${values.spec.model || "-"}`} />
                            <SideStat label="Reference" value={values.spec.referenceNumber || "-"} />
                        </div>
                    </Section>

                    <Section title="Phụ kiện & machine" desc="Theo dõi nhanh điểm sale và technical hay nhìn." icon={<Wrench className="h-5 w-5" />}>
                        <div className="grid grid-cols-1 gap-3">
                            <SideStat label="Movement" value={values.core.movementType || values.spec.calibre || "-"} />
                            <SideStat label="Calibre" value={values.spec.calibre || values.core.movementCalibre || "-"} />
                            <SideStat label="Has box" value={values.core.hasBox || values.spec.boxIncluded ? "Có" : "Không"} />
                            <SideStat label="Has papers" value={values.core.hasPapers || values.spec.cardIncluded ? "Có" : "Không"} />
                            <SideStat label="Booklet" value={values.spec.bookletIncluded ? "Có" : "Không"} />
                        </div>
                    </Section>

                    <Section title="Lưu ý notification" desc="Khi giá thay đổi, hệ thống sẽ bắn notification cho sale và technician." icon={<BookOpen className="h-5 w-5" />} defaultOpen={false}>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                            <p>- So sánh giá cũ và giá mới ngay lúc submit.</p>
                            <p>- Chỉ bắn khi thật sự có thay đổi ở các field giá quan trọng.</p>
                            <p>- Metadata gửi kèm gồm productId, watchId, title, sku và before/after.</p>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
}
