"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { buildWatchTitleFromForm } from "../../shared/watch-title-sku.helpers";
import type { WatchFormValues } from "../../client/form/watch-form.types";
import {
  Button,
  cx,
  FieldLabel,
  Input,
  moneyPreview,
  SectionCard,
  Select,
  Textarea,
  Toggle,
} from "./shared";
import WatchBrandField from "./WatchBrandField";
import { PostTargetChip } from "@/domains/shared/ui/post-target/PostTargetChip";
import {
  installStrapFromSpecAction,
  listAvailableClaspsAction,
  listAvailableStrapsAction,
} from "@/domains/strap/client/strap.actions";
import type { StrapListProjectionRow } from "@/domains/projection/server/strap-list";

export type SimpleOption = {
  id: string;
  name: string;
  slug?: string | null;
  platform?: string | null;
};

type Props = {
  watchId: string;
  values: WatchFormValues["basic"];
  spec: WatchFormValues["spec"];
  pricing: WatchFormValues["pricing"];
  categories: SimpleOption[];
  postTargets: SimpleOption[];
  onChange: (patch: Partial<WatchFormValues["basic"]>) => void;
  onSpecChange: (patch: Partial<WatchFormValues["spec"]>) => void;
  onPricingChange: (patch: Partial<WatchFormValues["pricing"]>) => void;
  brands: SimpleOption[];
  onBrandsChange: (brands: SimpleOption[]) => void;
  canViewCost: boolean;
  canEditPrice: boolean;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
  collapsible?: boolean;
  surface?: "card" | "flat";
};

const MOVEMENT_TYPE_OPTIONS = [
  "AUTOMATIC",
  "HAND_WOUND",
  "QUARTZ",
  "SOLAR",
  "KINETIC",
  "MECHAQUARTZ",
  "SPRING_DRIVE",
  "HYBRID",
].map((value) => ({ value, label: value }));

const MATERIAL_OPTIONS = [
  "STAINLESS_STEEL",
  "TITANIUM",
  "CERAMIC",
  "CARBON",
  "GOLD",
  "PLATINUM",
  "SILVER",
  "BRASS",
  "OTHER",
].map((value) => ({ value, label: value }));

const WATCH_STYLE_OPTIONS = [
  "MILITARY",
  "DRESS",
  "SPORT",
  "TOOL",
  "CASUAL",
  "CLASSIC",
  "MINIMALIST",
  "LUXURY",
  "RETRO",
  "FUTURISTIC",
].map((value) => ({ value, label: value }));

const CASE_SHAPE_OPTIONS = [
  "ROUND",
  "TANK",
  "SQUARE",
  "SPECIAL",
  "OTHER",
  "TONNEAU",
  "CUSHION",
  "OVAL",
  "ASYMMETRICAL",
  "OCTAGON",
  "POLYGON",
].map((value) => ({ value, label: value }));

const CRYSTAL_OPTIONS = [
  "SAPPHIRE",
  "ACRYLIC",
  "MINERAL",
  "HARDLEX",
  "AR_COATED",
].map((value) => ({ value, label: value }));

const MATERIAL_PROFILE_OPTIONS = [
  { value: "SINGLE_MATERIAL", label: "Single material" },
  { value: "BIMETAL", label: "Bi-metal / Two tone" },
  { value: "COATED", label: "Coated / Plated" },
  { value: "OTHER", label: "Other" },
];

const GOLD_TREATMENT_OPTIONS = [
  "SOLID_GOLD",
  "CAPPED_GOLD",
  "GOLD_PLATED",
  "GOLD_VERMEIL",
  "GOLD_FILLED",
].map((value) => ({ value, label: value }));

const GOLD_COLOR_OPTIONS = ["YELLOW", "WHITE", "ROSE", "MIXED"];

const GOLD_KARAT_OPTIONS = ["8", "9", "10", "14", "18"].map((value) => ({
  value,
  label: `${value}K`,
}));

const BRACELET_OPTIONS = [
  "LEATHER",
  "BRACELET",
  "RUBBER",
  "NATO",
  "CANVASS",
  "SPECIAL",
].map((value) => ({ value, label: value }));

const STRAP_SET_TYPE_OPTIONS = [
  { value: "BRAND_ORIGINAL", label: "Dây / khóa chính hãng" },
  { value: "COMPONENT", label: "Dây / khóa linh kiện" },
];

const STRAP_COMPONENT_SOURCE_OPTIONS = [
  { value: "KEEP_CURRENT", label: "Dây đi kèm đồng hồ" },
  { value: "FROM_STOCK", label: "Lấy dây thay từ kho" },
];

function normalizeTargetName(value: unknown) {
  return String(value ?? "").trim();
}

function getPostTargetGroupKey(target: SimpleOption) {
  return normalizeTargetName(target.name).toLowerCase();
}

function buildPostTargetGroups(options: SimpleOption[]) {
  const byName = new Map<
    string,
    { key: string; name: string; ids: string[] }
  >();

  for (const option of options) {
    const name = normalizeTargetName(option.name);
    const id = String(option.id ?? "").trim();

    if (!name || !id) continue;

    const key = getPostTargetGroupKey(option);
    const current = byName.get(key);

    if (current) {
      if (!current.ids.includes(id)) current.ids.push(id);
    } else {
      byName.set(key, { key, name, ids: [id] });
    }
  }

  return Array.from(byName.values());
}

export function PostTargetMultiSelect({
  value,
  options,
  onChange,
}: {
  value: string[];
  options: SimpleOption[];
  onChange: (next: string[]) => void;
}) {
  const selected = Array.isArray(value)
    ? value.map((id) => String(id ?? "").trim()).filter(Boolean)
    : [];

  const groups = buildPostTargetGroups(options);
  const selectedSet = new Set(selected);
  const groupById = new Map<string, (typeof groups)[number]>();

  for (const group of groups) {
    for (const id of group.ids) groupById.set(id, group);
  }

  const selectedGroups = selected.reduce<(typeof groups)[number][]>(
    (acc, id) => {
      const group = groupById.get(id);
      if (!group || acc.some((item) => item.key === group.key)) return acc;
      acc.push(group);
      return acc;
    },
    [],
  );

  const toggleGroup = (groupKey: string) => {
    const group = groups.find((item) => item.key === groupKey);
    if (!group) return;

    const hasGroup = group.ids.some((id) => selectedSet.has(id));
    const groupIds = new Set(group.ids);

    if (hasGroup) {
      onChange(selected.filter((id) => !groupIds.has(id)));
      return;
    }

    onChange(Array.from(new Set([...selected, ...group.ids])));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedGroups.length ? (
          selectedGroups.map((group) => (
            <button
              key={group.key}
              type="button"
              onClick={() => toggleGroup(group.key)}
              className="rounded-full"
              title="Bỏ chọn"
            >
              <PostTargetChip
                trailing={<span className="text-slate-300">x</span>}
              >
                {group.name}
              </PostTargetChip>
            </button>
          ))
        ) : (
          <div className="text-sm text-slate-400">Chưa chọn page/kênh đăng</div>
        )}
      </div>

      <select
        value=""
        onChange={(event) => {
          toggleGroup(event.target.value);
          event.currentTarget.value = "";
        }}
        className="block h-[40px] w-full border-0 border-b border-slate-200 bg-transparent px-0 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-0"
      >
        <option value="">Thêm page/kênh đăng</option>
        {groups.map((group) => {
          const selectedGroup = group.ids.some((id) => selectedSet.has(id));

          return (
            <option key={group.key} value={group.key}>
              {selectedGroup ? "- " : ""}
              {group.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function buildTitlePreviewValues(
  values: WatchFormValues["basic"],
  spec: WatchFormValues["spec"],
): WatchFormValues {
  return {
    watchId: "",
    productId: "",
    header: { sku: "", status: "", serviceState: "" },
    basic: values,
    spec,
    content: {
      titleOverride: "",
      hookText: "",
      body: "",
      bulletSpecs: [],
      hashTags: "",
    },
    pricing: {
      salePrice: "",
      listPrice: "",
      minPrice: "",
      costPrice: "",
      serviceCost: "",
      landedCost: "",
      pricingNote: "",
    },
    media: {
      inlineImage: null,
      poolImages: [],
      galleryImages: [],
      imageCount: 0,
      hasBox: false,
      hasPapers: false,
      bookletIncluded: false,
      cardIncluded: false,
    },
  };
}

function compactParts(parts: Array<string | null | undefined>) {
  return parts.map((part) => String(part ?? "").trim()).filter(Boolean);
}

function onlyMoney(value: string) {
  return value.replace(/[^\d]/g, "");
}

function getBrandName(brandId: string, brands: SimpleOption[]) {
  return brands.find((brand) => brand.id === brandId)?.name ?? "";
}

function FormSection({
  index,
  title,
  subtitle,
  children,
}: {
  index: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-slate-200 pt-6 first:border-t-0 first:pt-0">
      <div className="-mx-2 mb-5 flex items-start gap-3 rounded-lg bg-slate-50 px-2 py-2 ring-1 ring-inset ring-slate-100">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200">
          {index}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-3">
        {children}
      </div>
    </section>
  );
}

function SummaryChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-6 items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      {children}
    </span>
  );
}

export default function WatchBasicSection({
  watchId,
  values,
  spec,
  pricing,
  brands,
  categories,
  postTargets,
  onChange,
  onSpecChange,
  onPricingChange,
  onBrandsChange,
  canViewCost,
  canEditPrice,
  defaultOpen = false,
  actions,
  collapsible = true,
  surface = "card",
}: Props) {
  void categories;

  const materialProfile = spec.materialProfile || "SINGLE_MATERIAL";
  const isBimetal = materialProfile === "BIMETAL";
  const isCoated = materialProfile === "COATED";
  const generatedTitle = buildWatchTitleFromForm(
    buildTitlePreviewValues(values, spec),
    brands,
  );
  const brandName = getBrandName(values.brandId, brands);
  const summaryTitle = values.title || generatedTitle || "Untitled watch";
  const summaryParts = compactParts([
    values.yearText,
    brandName,
    spec.model,
    spec.referenceNumber,
    spec.nickname,
    values.movementType,
  ]);
  const specParts = compactParts([
    spec.dialColor ? `${spec.dialColor} dial` : "",
    spec.caseShape,
    spec.caseSizeMM ? `${spec.caseSizeMM}mm` : "",
    spec.primaryCaseMaterial,
    spec.braceletType,
  ]);
  const [availableStraps, setAvailableStraps] = useState<
    StrapListProjectionRow[]
  >([]);
  const [selectedStrapId, setSelectedStrapId] = useState("");
  const [availableClasps, setAvailableClasps] = useState<
    Awaited<ReturnType<typeof listAvailableClaspsAction>>
  >([]);
  const [selectedClaspId, setSelectedClaspId] = useState("");
  const [loadingStraps, setLoadingStraps] = useState(false);
  const [installingStrap, setInstallingStrap] = useState(false);
  const [strapMessage, setStrapMessage] = useState("");

  useEffect(() => {
    if (spec.strapComponentSource !== "FROM_STOCK") return;
    let active = true;
    setLoadingStraps(true);
    setStrapMessage("");
    void Promise.all([listAvailableStrapsAction(), listAvailableClaspsAction()])
      .then(([straps, clasps]) => {
        if (active) {
          setAvailableStraps(straps);
          setAvailableClasps(clasps);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setStrapMessage(
            error instanceof Error
              ? error.message
              : "Không tải được tồn kho dây.",
          );
        }
      })
      .finally(() => {
        if (active) setLoadingStraps(false);
      });
    return () => {
      active = false;
    };
  }, [spec.strapComponentSource]);

  async function installSelectedStrap() {
    if (!selectedStrapId) return;
    setInstallingStrap(true);
    setStrapMessage("");
    try {
      await installStrapFromSpecAction({
        watchId,
        variantId: selectedStrapId,
        claspVariantId: selectedClaspId || null,
      });
      const installed = availableStraps.find(
        (item) => item.variantId === selectedStrapId,
      );
      setStrapMessage(`Đã gắn ${installed?.title ?? "dây"} vào Watch.`);
      setAvailableStraps((rows) =>
        rows.filter((item) => item.variantId !== selectedStrapId),
      );
      setSelectedStrapId("");
      if (selectedClaspId) {
        setAvailableClasps((rows) =>
          rows.filter((item) => item.variantId !== selectedClaspId),
        );
        setSelectedClaspId("");
      }
    } catch (error) {
      setStrapMessage(
        error instanceof Error ? error.message : "Không thể gắn dây vào Watch.",
      );
    } finally {
      setInstallingStrap(false);
    }
  }

  return (
    <SectionCard
      defaultOpen={defaultOpen}
      icon={<Pencil className="h-5 w-5" />}
      title="Thông tin chính"
      subtitle="Thông tin định danh, thông số và dữ liệu tạo nội dung."
      actions={actions}
      collapsible={collapsible}
      surface={surface}
    >
      <div className="space-y-6">
        <div className="sticky top-0 z-10 -mx-5 -mt-5 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Realtime summary
              </div>
              <div className="mt-1 truncate text-base font-semibold text-slate-950">
                {summaryTitle}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {summaryParts.length ? (
                  summaryParts.map((part) => (
                    <SummaryChip key={part}>{part}</SummaryChip>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">
                    Chưa đủ thông tin định danh
                  </span>
                )}
              </div>
              {specParts.length ? (
                <div className="mt-2 text-sm text-slate-500">
                  {specParts.join(" - ")}
                </div>
              ) : null}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => onChange({ title: generatedTitle })}
              className="shrink-0"
            >
              Apply title
            </Button>
          </div>
        </div>

        <FormSection
          index={1}
          title="Nhận diện"
          subtitle="Thông tin nhận diện của chiếc đồng hồ."
        >
          <div>
            <WatchBrandField
              value={values.brandId}
              brands={brands}
              onBrandsChange={onBrandsChange}
              onChange={(brandId) => onChange({ brandId })}
            />
          </div>

          <div>
            <FieldLabel>Model</FieldLabel>
            <Input
              value={spec.model}
              onChange={(event) => onSpecChange({ model: event.target.value })}
              placeholder="Seamaster / Datejust / Tank..."
            />
          </div>

          <div>
            <FieldLabel>Reference</FieldLabel>
            <Input
              value={spec.referenceNumber}
              onChange={(event) =>
                onSpecChange({ referenceNumber: event.target.value })
              }
              placeholder="Reference"
            />
          </div>

          <div>
            <FieldLabel>Tên gọi</FieldLabel>
            <Input
              value={spec.nickname}
              onChange={(event) =>
                onSpecChange({ nickname: event.target.value })
              }
              placeholder="Jumbo / Ghost / Linen dial..."
            />
          </div>

          <div>
            <FieldLabel>Năm sản xuất</FieldLabel>
            <Input
              value={values.yearText}
              onChange={(event) => onChange({ yearText: event.target.value })}
              placeholder="1970s / 1990s / ..."
            />
          </div>

          <div>
            <FieldLabel>Màu mặt số</FieldLabel>
            <Input
              value={spec.dialColor}
              onChange={(event) =>
                onSpecChange({ dialColor: event.target.value })
              }
              placeholder="Silver / Black / Champagne"
            />
          </div>

          <div>
            <FieldLabel>Hoàn thiện mặt số</FieldLabel>
            <Input
              value={spec.dialFinish}
              onChange={(event) =>
                onSpecChange({ dialFinish: event.target.value })
              }
              placeholder="Sunburst / linen / brushed / ..."
            />
          </div>

          <div>
            <FieldLabel>Phong cách</FieldLabel>
            <Select
              value={values.style}
              onChange={(event) => onChange({ style: event.target.value })}
              options={WATCH_STYLE_OPTIONS}
              placeholder="Chọn phong cách"
            />
          </div>
        </FormSection>

        <FormSection
          index={2}
          title="Bộ máy & vỏ"
          subtitle="Thông tin về bộ máy và vỏ đồng hồ."
        >
          <div>
            <FieldLabel>Loại máy</FieldLabel>
            <Select
              value={values.movementType}
              onChange={(event) =>
                onChange({ movementType: event.target.value })
              }
              options={MOVEMENT_TYPE_OPTIONS}
              placeholder="Chọn loại máy"
            />
          </div>

          <div>
            <FieldLabel>Calibre bộ máy</FieldLabel>
            <Input
              value={values.movementCalibre}
              onChange={(event) =>
                onChange({ movementCalibre: event.target.value })
              }
              placeholder="L993.1 / 7S26 / ..."
            />
          </div>

          <div>
            <FieldLabel>Đường kính vỏ (mm)</FieldLabel>
            <Input
              value={spec.caseSizeMM}
              onChange={(event) =>
                onSpecChange({ caseSizeMM: event.target.value })
              }
              placeholder="35"
            />
          </div>

          <div>
            <FieldLabel>Lug-to-lug (mm)</FieldLabel>
            <Input
              value={spec.lugToLugMM}
              onChange={(event) =>
                onSpecChange({ lugToLugMM: event.target.value })
              }
              placeholder="44"
            />
          </div>

          <div>
            <FieldLabel>Độ dày (mm)</FieldLabel>
            <Input
              value={spec.thicknessMM}
              onChange={(event) =>
                onSpecChange({ thicknessMM: event.target.value })
              }
              placeholder="11"
            />
          </div>

          <div>
            <FieldLabel>Hình dáng vỏ</FieldLabel>
            <Select
              value={spec.caseShape}
              onChange={(event) =>
                onSpecChange({ caseShape: event.target.value })
              }
              options={CASE_SHAPE_OPTIONS}
              placeholder="Round / Square / Tank / ..."
            />
          </div>

          <div>
            <FieldLabel>Kính</FieldLabel>
            <Select
              value={spec.crystal}
              onChange={(event) =>
                onSpecChange({ crystal: event.target.value })
              }
              options={CRYSTAL_OPTIONS}
              placeholder="Chọn loại kính"
            />
          </div>
        </FormSection>

        <FormSection
          index={3}
          title="Dây & khóa"
          subtitle="Chọn bộ đi kèm đồng hồ hoặc xuất dây và khóa trực tiếp từ kho."
        >
          <div>
            <FieldLabel>Nguồn dây & khóa</FieldLabel>
            <Select
              value={spec.strapComponentSource}
              onChange={(event) => {
                const source = event.target.value;
                onSpecChange({
                  strapComponentSource: source,
                  ...(source === "FROM_STOCK"
                    ? {
                        strapSetType: "",
                        braceletType: "",
                        buckleType: "",
                      }
                    : {}),
                });
              }}
              options={STRAP_COMPONENT_SOURCE_OPTIONS}
              placeholder="Chọn đi kèm đồng hồ / từ kho"
            />
          </div>

          {spec.strapComponentSource === "KEEP_CURRENT" ? (
            <>
              <div>
                <FieldLabel>Loại dây đi kèm</FieldLabel>
                <Select
                  value={spec.braceletType}
                  onChange={(event) =>
                    onSpecChange({ braceletType: event.target.value })
                  }
                  options={BRACELET_OPTIONS}
                  placeholder="Chọn loại dây"
                />
              </div>

              <div>
                <FieldLabel>Loại khóa đi kèm</FieldLabel>
                <Input
                  value={spec.buckleType}
                  onChange={(event) =>
                    onSpecChange({ buckleType: event.target.value })
                  }
                  placeholder="Pin buckle / deployant / ..."
                />
              </div>

              <div>
                <FieldLabel>Nguồn gốc bộ dây / khóa</FieldLabel>
                <Select
                  value={spec.strapSetType}
                  onChange={(event) =>
                    onSpecChange({ strapSetType: event.target.value })
                  }
                  options={STRAP_SET_TYPE_OPTIONS}
                  placeholder="Chọn chính hãng / linh kiện"
                />
              </div>
            </>
          ) : null}

          {spec.strapComponentSource === "FROM_STOCK" ? (
            <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 md:col-span-3">
              <div className="mb-3">
                <div className="text-sm font-semibold text-slate-900">
                  Xuất dây & khóa từ kho
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Thuộc tính chính hãng/linh kiện và loại khóa được lấy từ sản
                  phẩm kho, không cần khai báo lại.
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Select
                  value={selectedStrapId}
                  onChange={(event) => setSelectedStrapId(event.target.value)}
                  options={availableStraps.map((item) => ({
                    value: item.variantId,
                    label: `${item.title} · ${item.lugWidthMM}-${item.buckleWidthMM ?? "—"} · tồn ${item.stockQty}`,
                  }))}
                  placeholder={
                    loadingStraps
                      ? "Đang tải inventory..."
                      : availableStraps.length
                        ? "Chọn dây phù hợp"
                        : "Không có dây còn tồn"
                  }
                />
                <Select
                  value={selectedClaspId}
                  onChange={(event) => setSelectedClaspId(event.target.value)}
                  options={availableClasps.map((item) => ({
                    value: item.variantId,
                    label: `${item.title} · ${item.claspType} · ${item.widthMM} mm · tồn ${item.stockQty}`,
                  }))}
                  placeholder={
                    loadingStraps
                      ? "Đang tải inventory khóa..."
                      : availableClasps.length
                        ? "Chọn khóa từ kho (không bắt buộc)"
                        : "Không có khóa còn tồn"
                  }
                />
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  onClick={installSelectedStrap}
                  disabled={!selectedStrapId || installingStrap}
                  className="shrink-0"
                >
                  {installingStrap ? "Đang xuất kho..." : "Gắn vào Watch"}
                </Button>
              </div>
              {strapMessage ? (
                <div className="mt-2 text-xs font-medium text-violet-700">
                  {strapMessage}
                </div>
              ) : null}
            </div>
          ) : null}
        </FormSection>

        <FormSection
          index={4}
          title="Chất liệu"
          subtitle="Chất liệu và kiểu hoàn thiện."
        >
          <div>
            <FieldLabel>Chất liệu chính</FieldLabel>
            <Select
              value={spec.primaryCaseMaterial}
              onChange={(event) =>
                onSpecChange({ primaryCaseMaterial: event.target.value })
              }
              options={MATERIAL_OPTIONS}
              placeholder="Chọn chất liệu"
            />
          </div>

          <div>
            <FieldLabel>Cấu trúc chất liệu</FieldLabel>
            <Select
              value={spec.materialProfile}
              onChange={(event) => {
                const next = event.target.value;

                onSpecChange({
                  materialProfile: next,
                  ...(next === "SINGLE_MATERIAL"
                    ? {
                        secondaryCaseMaterial: "",
                        goldTreatment: "",
                        goldColors: [],
                        goldKarat: "",
                      }
                    : {}),
                  ...(next === "BIMETAL"
                    ? {
                        goldTreatment: "",
                      }
                    : {}),
                  ...(next === "COATED"
                    ? {
                        secondaryCaseMaterial: "",
                      }
                    : {}),
                });
              }}
              options={MATERIAL_PROFILE_OPTIONS}
            />
          </div>

          <div className={cx(!isBimetal && !isCoated ? "hidden md:block" : "")}>
            {isBimetal ? (
              <>
                <FieldLabel>Chất liệu phụ</FieldLabel>
                <Select
                  value={spec.secondaryCaseMaterial}
                  onChange={(event) =>
                    onSpecChange({
                      secondaryCaseMaterial: event.target.value,
                    })
                  }
                  options={MATERIAL_OPTIONS}
                  placeholder="Chọn chất liệu phụ"
                />
              </>
            ) : isCoated ? (
              <>
                <FieldLabel>Kiểu xử lý vàng</FieldLabel>
                <Select
                  value={spec.goldTreatment}
                  onChange={(event) =>
                    onSpecChange({ goldTreatment: event.target.value })
                  }
                  options={GOLD_TREATMENT_OPTIONS}
                  placeholder="Chọn kiểu xử lý vàng"
                />
              </>
            ) : null}
          </div>

          {isCoated ? (
            <>
              <div>
                <FieldLabel>Tuổi vàng</FieldLabel>
                <Select
                  value={spec.goldKarat}
                  onChange={(event) =>
                    onSpecChange({ goldKarat: event.target.value })
                  }
                  options={GOLD_KARAT_OPTIONS}
                  placeholder="Chọn tuổi vàng"
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel>Màu vàng</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {GOLD_COLOR_OPTIONS.map((color) => {
                    const checked = spec.goldColors.includes(color);

                    return (
                      <Toggle
                        key={color}
                        checked={checked}
                        label={color}
                        onChange={(next) => {
                          const current = spec.goldColors || [];
                          onSpecChange({
                            goldColors: next
                              ? [...current, color]
                              : current.filter((item) => item !== color),
                          });
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}
        </FormSection>

        <FormSection
          index={5}
          title="Giá"
          subtitle="Thông tin giá cần biết khi hoàn thiện thông số."
        >
          <div>
            <FieldLabel>Giá mua</FieldLabel>
            <div className="flex h-[40px] items-center border-b border-slate-200 text-sm font-medium text-slate-900">
              {canViewCost ? moneyPreview(pricing.costPrice) : "-"}
            </div>
          </div>

          <div>
            <FieldLabel>Giá bán</FieldLabel>
            <Input
              inputMode="numeric"
              value={pricing.salePrice}
              onChange={(event) =>
                onPricingChange({ salePrice: onlyMoney(event.target.value) })
              }
              placeholder="VD: 18500000"
              disabled={!canEditPrice}
            />
          </div>
        </FormSection>

        <FormSection
          index={6}
          title="Bổ sung"
          subtitle="Các thông tin bổ sung khác."
        >
          <div>
            <FieldLabel>Trang đăng / xuất bản</FieldLabel>
            <PostTargetMultiSelect
              value={values.postTargetIds}
              options={postTargets}
              onChange={(postTargetIds) => onChange({ postTargetIds })}
            />
          </div>

          <div>
            <FieldLabel>Tên hiển thị tùy chỉnh</FieldLabel>
            <Input
              value={values.title}
              onChange={(event) => onChange({ title: event.target.value })}
              placeholder={generatedTitle || "Tên đồng hồ"}
            />
          </div>

          <div>
            <FieldLabel>Ghi chú chất liệu</FieldLabel>
            <Textarea
              rows={2}
              value={spec.materialNote}
              onChange={(event) =>
                onSpecChange({ materialNote: event.target.value })
              }
              placeholder="Ghi chú chất liệu"
              className="min-h-[40px]"
            />
          </div>
        </FormSection>
      </div>
    </SectionCard>
  );
}
