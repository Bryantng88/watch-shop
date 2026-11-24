"use client";

import type { WatchOperationalOverview } from "@/domains/watch/shared/watch-operational-overview";
import { MediaProcessingIcon, InlineImageIcon } from "@/domains/shared/ui/icons/MediaIcons";

import { AdminDetailPage, ADMIN_DETAIL as detailUi } from "@/domains/shared/ui/admin-design-contract/AdminDetail";
import { AdminRowActionMenu } from "@/domains/shared/ui/admin-design-contract/AdminRowActionMenu";
import { AdminButton, AdminAnchorAction } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowLeftRight,
  BadgeDollarSign,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileText,
  ImageIcon,
  Landmark,
  Loader2,
  Pencil,
  ReceiptText,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";

import { mapWatchDetailToFormValues } from "@/domains/watch/client/form/watch-form.mapper";
import {
  moneyText,
  normalizeDate,
  onlyMoney,
} from "@/domains/watch/client/workbench/workbench-utils";
import { saveWatchWorkbenchPricingAction } from "@/domains/watch/client/workbench/watch-workbench.actions";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";
import {
  BusinessEntityPreviewModal,
  useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import ServiceCard from "@/domains/watch/ui/operations/side/ServiceCard";
import WatchPublishAssetActions from "./WatchPublishAssetActions";
import MediaBrowserDialog from "@/components/media/MediaBrowserDialog";
import { setWatchInlineImageAction } from "./watch-inline-image.actions";

type RecordValue = Record<string, unknown>;

function record(value: unknown): RecordValue {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as RecordValue
    : {};
}

function rows(value: unknown) {
  return Array.isArray(value) ? value.map(record) : [];
}

function number(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function text(value: unknown, fallback = "—") {
  const resolved = String(value ?? "").trim();
  return resolved || fallback;
}

function statusLabel(value: string) {
  return ({
    IN_STOCK: "Còn hàng",
    OUT_OF_STOCK: "Hết hàng",
    RESERVED: "Đã giữ",
    DRAFT: "Bản nháp",
    READY: "Sẵn sàng bán",
    SOLD: "Đã bán",
    IN_SERVICE: "Đang service",
    HOLD: "Đã giữ",
    PROCESSING: "Đang chuẩn bị",
    CONSIGNED_TO: "Đang gửi đối tác",
  } as Record<string, string>)[value.toUpperCase()] ?? value;
}

function money(value: unknown, canView = true) {
  return canView ? `${moneyText(value, "0")} ₫` : "••••••";
}

export default function WatchDetailUiProposal({
  detail,
  service,
  tradeHistory,
  canViewFinancials,
  live = false,
  canEditPrice = false,
  canEditMedia = false,
  mediaWorkspace,
  operationalOverview,
}: {
  detail: RecordValue;
  service: unknown;
  tradeHistory: RecordValue;
  canViewFinancials: boolean;
  live?: boolean;
  canEditPrice?: boolean;
  canEditMedia?: boolean;
  mediaWorkspace?: RecordValue;
  operationalOverview?: WatchOperationalOverview;
}) {
  const [expandedWork, setExpandedWork] = useState<Record<string, boolean>>({});
  const [mediaOpen, setMediaOpen] = useState(false);
  const [inlinePickerOpen, setInlinePickerOpen] = useState(false);
  const [savingInline, setSavingInline] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [savingPrice, setSavingPrice] = useState(false);
  const previewState = useBusinessEntityPreview();
  const notify = useNotify();
  const router = useRouter();
  const values = mapWatchDetailToFormValues(detail);
  const audienceSegment = text(detail.audienceSegment, "MEN").toUpperCase() === "WOMEN"
    ? "WOMEN" as const
    : text(detail.audienceSegment, "MEN").toUpperCase() === "UNISEX"
      ? "UNISEX" as const
      : "MEN" as const;
  const [salePriceValue, setSalePriceValue] = useState(values.pricing.salePrice);
  const brand = record(detail.brand);
  const images = rows(detail.images);
  const firstImage =
    values.media.inlineImage?.url ||
    values.media.galleryImages[0]?.url ||
    text(detail.primaryImageUrl, "") ||
    text(images[0]?.url, "");
  const imageSrc = firstImage
    ? resolveMediaPreviewSrc(firstImage) ?? firstImage
    : null;
  const title =
    values.basic.title ||
    text(detail.title, "") ||
    [text(brand.name, ""), values.spec.model].filter(Boolean).join(" ") ||
    "Watch";
  const detailHref = `/admin/watches/${values.productId}`;
  const workspace = record(mediaWorkspace);
  const mediaQuery = new URLSearchParams({ embedded: "1", mode: "media", returnTo: detailHref });
  if (workspace.bindingId) {
    mediaQuery.set("from", "media-workspace");
    mediaQuery.set("workspaceBindingId", String(workspace.bindingId));
  }
  if (workspace.state) mediaQuery.set("workspaceState", String(workspace.state));
  const mediaHref = `${detailHref}/edit?${mediaQuery.toString()}`;

  const summary = record(tradeHistory.costSummary);
  const acquisitionCost = number(summary.acquisitionAmount);
  const serviceCost = number(summary.serviceAmount);
  const shipmentCost = number(summary.shipmentAmount);
  const otherCost = number(summary.otherAmount);
  const landedCost = number(summary.landedCost);
  const salePrice = number(salePriceValue || values.pricing.listPrice);
  const profit = salePrice - landedCost;
  const margin = salePrice > 0 ? profit / salePrice * 100 : 0;
  const costRows = [
    { label: "Giá nhập", note: "Từ phiếu nhập gần nhất", amount: acquisitionCost },
    { label: "Service", note: `${rows(tradeHistory.serviceFees).length} hạng mục kỹ thuật`, amount: serviceCost },
    { label: "Vận chuyển", note: `${rows(tradeHistory.shipmentFees).length} vận đơn liên quan`, amount: shipmentCost },
    { label: "Chi phí khác", note: "Các khoản chi đã ghi nhận", amount: otherCost },
  ];

  const contentReady = Boolean(values.content.titleOverride || values.content.body);
  const imageReady = ["APPROVED", "READY", "PUBLISHED"].includes(String(values.imageReviewStatus ?? "").toUpperCase());
  const attention = [
    ...(!imageReady ? [{ label: "Gallery đang chờ duyệt", href: "#content-media", icon: ImageIcon }] : []),
    ...(!contentReady ? [{ label: "Chưa có nội dung bán hàng", href: "#content-media", icon: FileText }] : []),
  ];
  const serviceRecord = record(service);
  const serviceRequests = rows(serviceRecord.requests);
  const latestServiceRequest = serviceRequests[0] ?? null;
  const acquisitions = rows(tradeHistory.acquisitions);
  const orders = rows(tradeHistory.orders);
  const latestAcquisition = acquisitions[0] ?? null;
  const latestOrder = orders[0] ?? null;
  const quickOrderHref = `/admin/orders/new?${new URLSearchParams({
    mode: "quick",
    productId: values.productId,
    returnTo: detailHref,
  }).toString()}`;
  const acquisitionCreateHref = "/admin/acquisitions/watches/new";
  const transactionEvents = [
    ...acquisitions.slice(0, 2).map((item) => ({
      id: text(item.id, ""),
      type: "ACQUISITION" as const,
      label: text(item.acquisitionType, "").toUpperCase() === "BUY_BACK"
        ? "Buy back"
        : text(item.acquisitionType, "").toUpperCase() === "TRADE_IN"
          ? "Trade-in"
          : "Nhập hàng",
      party: text(item.customerName, text(item.vendorName, "Vendor")),
      amount: item.amount,
      occurredAt: item.updatedAt || item.createdAt,
      tone: "bg-rose-50 text-rose-700",
    })),
    ...orders.slice(0, 2).map((item) => ({
      id: text(item.id, ""),
      type: "ORDER" as const,
      label: "Bán hàng",
      party: text(item.customerName, "Khách hàng"),
      amount: item.amount,
      occurredAt: item.updatedAt || item.createdAt,
      tone: "bg-emerald-50 text-emerald-700",
    })),
  ];

  function openRelatedPreview(
    type: BusinessEntityPreview["type"],
    item: RecordValue | null,
    label: string,
  ) {
    const id = text(item?.id, "") || values.productId;
    const refNo = text(item?.refNo, "");
    const exists = Boolean(item?.id);
    const actions = type === "SERVICE"
      ? exists
        ? [
            { label: "Xử lý Service", href: `/admin/services/${id}` },
            { label: "Mở Service board", href: "/admin/services/operation" },
            { label: "Tạo Service mới", command: "CREATE_SERVICE" as const },
          ]
        : [
            { label: "Tạo Service", command: "CREATE_SERVICE" as const },
            { label: "Mở Service board", href: "/admin/services/operation" },
          ]
      : type === "ORDER"
        ? exists
          ? [
              { label: "Xử lý đơn hàng", href: `/admin/orders/${id}` },
              { label: "Tạo Order mới", href: quickOrderHref },
            ]
          : [{ label: "Tạo Order từ Watch", href: quickOrderHref }]
        : exists
          ? [
              { label: "Mở danh sách phiếu nhập", href: "/admin/acquisitions" },
              { label: "Tạo Buy Back / Trade-in", href: acquisitionCreateHref },
            ]
          : [{ label: "Tạo Buy Back / Trade-in", href: acquisitionCreateHref }];
    previewState.openPreview({
      type,
      id,
      refNo: refNo || null,
      title: exists ? (refNo ? `${label} ${refNo}` : label) : `Chưa có ${label}`,
      subtitle: title,
      status: exists ? text(item?.status, "") || null : "CHƯA TẠO",
      imageUrl: imageSrc,
      facts: exists
        ? [
            { label: "Mã", value: refNo || text(item?.id, "—") },
            { label: "Trạng thái", value: text(item?.status) },
            { label: "Giá trị", value: item?.amount != null ? money(item.amount, canViewFinancials) : "—" },
            { label: "Cập nhật", value: normalizeDate(item?.updatedAt || item?.createdAt) },
          ]
        : [
            { label: "Watch", value: values.header.sku || values.productId },
            { label: "Trạng thái", value: "Chưa có hồ sơ" },
            { label: "Giá bán", value: money(salePrice, canViewFinancials) },
          ],
      actions,
    });
  }

  async function saveSalePrice() {
    if (savingPrice) return;
    setSavingPrice(true);
    try {
      const result = await saveWatchWorkbenchPricingAction({
        productId: values.productId,
        pricing: { ...values.pricing, salePrice: salePriceValue },
        title,
        sku: values.header.sku,
      });
      notify.success({
        title: result.changedFields.length ? "Đã cập nhật giá bán" : "Giá bán không đổi",
        message: result.changedFields.length
          ? "Giá mới đã được lưu và đồng bộ projection."
          : "Không có thay đổi mới cần lưu.",
      });
      setPricingOpen(false);
    } catch (error) {
      notify.error({
        title: "Không cập nhật được giá bán",
        message: error instanceof Error ? error.message : "Có lỗi khi lưu giá bán.",
      });
    } finally {
      setSavingPrice(false);
    }
  }

  async function saveInlineImage(storageKey: string) {
    if (!storageKey || savingInline) return;
    setSavingInline(true);
    try {
      await setWatchInlineImageAction({
        productId: values.productId,
        storageKey,
      });
      setInlinePickerOpen(false);
      notify.success({
        title: "Đã cập nhật ảnh đại diện",
        message: "Ảnh INLINE đã được gắn trực tiếp với Watch.",
      });
      router.refresh();
    } catch (error) {
      notify.error({
        title: "Không thêm được ảnh INLINE",
        message: error instanceof Error ? error.message : "Có lỗi khi lưu ảnh.",
      });
    } finally {
      setSavingInline(false);
    }
  }

  return (
    <AdminDetailPage surface="record" emphasis>
        {!live && <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-violet-900">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <span className="font-bold">UI proposal</span>
            <span className="text-violet-700">Bản thử nghiệm chỉ đọc, không thay đổi Watch Detail hiện tại.</span>
          </div>
          <Link href={`/admin/watches/${values.productId}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-900">
            <ArrowLeft className="h-4 w-4" /> Quay lại giao diện hiện tại
          </Link>
        </div>}

        <nav className={detailUi.breadcrumb} aria-label="Breadcrumb">
            <Link href="/admin/watches" className="hover:text-violet-700">Đồng hồ</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-slate-800">{title}</span>
        </nav>

        <header className={detailUi.identityPanel}>
          <div className={`${detailUi.recordHeader} ${detailUi.identityLayout}`}>
            <div className={detailUi.recordIdentity}>
              <div className={`${detailUi.thumbnail} ${detailUi.recordImage}`}>{imageSrc ? <Image src={imageSrc} alt={title} fill sizes="(max-width: 639px) 104px, 192px" unoptimized className="object-cover" /> : <Camera className="h-5 w-5 text-slate-400" aria-hidden="true"/>}                  {canEditMedia && <AdminButton variant="secondary" className={detailUi.imageAction} iconOnly density="compact" type="button" aria-label={values.media.inlineImage ? "Đổi ảnh INLINE" : "Thêm ảnh INLINE"} title={values.media.inlineImage ? "Đổi ảnh INLINE" : "Thêm ảnh INLINE"} onClick={() => setInlinePickerOpen(true)} disabled={savingInline}>
                    {savingInline ? <Loader2 className="h-4 w-4 animate-spin"/> : <InlineImageIcon className="h-4 w-4" aria-hidden="true"/>}
                  </AdminButton>}</div>
              <div className={`${detailUi.identityText} ${detailUi.headerIdentityText}`}>
                <div className={`${detailUi.tags} ${detailUi.identityTags}`}><span className="text-slate-500">{values.header.sku || values.productId}</span><span className="text-emerald-700">{statusLabel(operationalOverview?.stock || values.basic.stockState)}</span>{statusLabel(operationalOverview?.sale || values.basic.saleState) !== statusLabel(operationalOverview?.stock || values.basic.stockState) && <span className="text-blue-700">{statusLabel(operationalOverview?.sale || values.basic.saleState)}</span>}</div>
                <h1 className={detailUi.recordTitle}>{title}</h1>
                <p className={detailUi.metadata}>{[text(brand.name, ""), values.spec.model, values.spec.referenceNumber].filter(Boolean).join(" · ") || "Chưa đủ thông tin nhận diện"} · {Math.max(values.media.galleryImages.length, images.length)} ảnh</p>
                <dl className={detailUi.identityFacts}>
                  {[
                    ["Năm sản xuất", values.basic.yearText],
                    ["Bộ máy", values.spec.calibre || values.basic.movementCalibre],
                    ["Kích thước", values.spec.caseSizeMM ? `${values.spec.caseSizeMM} mm` : ""],
                    ["Phụ kiện", [values.media.hasBox ? "Hộp" : "", values.media.hasPapers ? "Giấy tờ" : ""].filter(Boolean).join(" · ")],
                  ].filter(([, value]) => Boolean(value)).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                </dl>


              </div>
            </div>
                <div className={detailUi.headerActions} role="group" aria-label="Thao tác với đồng hồ">
                  {canEditMedia && <AdminAnchorAction href={`/admin/watches/${values.productId}/edit`} density="compact" variant="quiet" iconOnly aria-label="Chỉnh thông tin" title="Chỉnh thông tin"><Pencil className="h-4 w-4" aria-hidden="true"/></AdminAnchorAction>}
                  {live && <>
                    <AdminButton variant="quiet" iconOnly density="compact" type="button" aria-label="Xử lý Media" title="Xử lý Media" onClick={() => setMediaOpen(true)}><MediaProcessingIcon className="h-4 w-4" aria-hidden="true"/></AdminButton>
                    <AdminButton variant="quiet" iconOnly density="compact" type="button" aria-label="Service" title={latestServiceRequest ? "Xem yêu cầu kỹ thuật gần nhất" : "Tạo yêu cầu kỹ thuật"} onClick={() => openRelatedPreview("SERVICE", latestServiceRequest, "Service Request")}><Wrench className="h-4 w-4" aria-hidden="true"/></AdminButton>
                    <AdminRowActionMenu label="Thêm thao tác" status={null} iconOnly actions={[
                      {key:"order",label:latestOrder ? "Xem đơn hàng gần nhất" : "Tạo đơn hàng",onSelect:()=>openRelatedPreview("ORDER",latestOrder,"Order")},
                      {key:"acquisition",label:latestAcquisition ? "Xem phiếu nhập gần nhất" : "Tạo phiếu nhập / Buy Back",onSelect:()=>openRelatedPreview("ACQUISITION",latestAcquisition,"Phiếu nhập / Buy Back")},
                    ]}/>
                  </>}
                </div>

          </div>
        </header>


        <div className={detailUi.completeLayout}>
          <div className={detailUi.completeMain}>
            <section id="overview" className={`${detailUi.section} ${detailUi.financialPanel}`}>
              <div className={detailUi.sectionHeader}>
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-bold">
                    <CircleDollarSign className="h-4 w-4 text-violet-600" /> Giá & lợi nhuận
                  </h2>

                </div>
                {canEditPrice ? (
                  <AdminButton variant="quiet" iconOnly density="compact" type="button" aria-label="Chỉnh giá bán" title="Chỉnh giá bán" onClick={() => setPricingOpen(true)}>
                    <Pencil className="h-4 w-4" aria-hidden="true"/>
                  </AdminButton>
                ) : null}
              </div>

              <div className={detailUi.pricingGrid}>
                <div className="min-w-0">
                  <div className={detailUi.focus}>
                    <div className={detailUi.focusLabel}>Giá bán hiện tại</div>
                    <div className={detailUi.focusValue}>{money(salePrice)}</div>
                    <p className="mt-1 text-xs text-slate-500">Giá đang áp dụng cho Watch</p>
                  </div>

                  <dl className="mt-3 divide-y divide-slate-100 border-y border-slate-200">
                    {[
                      ["Lợi nhuận dự kiến", money(profit, canViewFinancials)],
                      ["Biên lợi nhuận", canViewFinancials ? `${margin.toFixed(1)}%` : "••••"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                        <dt className="text-slate-500">{label}</dt>
                        <dd className={canViewFinancials ? (profit >= 0 ? detailUi.positiveValue : detailUi.negativeValue) : "font-semibold text-slate-900"}>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700">Cấu thành giá vốn</h3>
                    
                  </div>
                  <div className="divide-y divide-slate-100 border-y border-slate-200">
                    {costRows.map(({ label, note, amount }) => (
                      <div key={label} className="flex items-center justify-between gap-4 py-2.5">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-800">{label}</div>
                          <div className="text-xs text-slate-500">{note}</div>
                        </div>
                        <div className="shrink-0 text-sm font-semibold text-slate-800">{money(amount, canViewFinancials)}</div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between gap-4 bg-slate-50 px-3 py-2.5">
                      <span className="text-xs font-bold text-slate-600">Tổng giá vốn</span>
                      <span className="text-sm font-bold text-slate-900">{money(landedCost, canViewFinancials)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div data-watch-section="content-media">
            <section id="content-media" className="scroll-mt-24">
              <div className={`${detailUi.section} ${detailUi.mediaPanel}`}>
                <div className={detailUi.sectionHeader}>
                  <div>
                    <h2 className="flex items-center gap-2 text-sm font-bold"><FileText className="h-4 w-4 text-violet-600" /> Nội dung & hình ảnh</h2>
                    <p className="mt-1 text-xs text-slate-400">Nội dung bán hàng và gallery đang gắn với Watch.</p>
                  </div>
                  <div className={detailUi.actions}>
                    <WatchPublishAssetActions detail={detail} />
                    <AdminButton variant="secondary" density="compact" type="button" onClick={() => setMediaOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-200 px-3 text-xs font-bold text-violet-700"><MediaProcessingIcon className="h-4 w-4" /> Xử lý Media</AdminButton>
                  </div>
                </div>
                <div className={`${detailUi.contentGrid} ${detailUi.editorialGrid}`}>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-slate-950">{values.content.titleOverride || title}</h3>
                    {values.content.hookText && <p className="mt-2 text-sm font-semibold text-violet-700">{values.content.hookText}</p>}
                    <div className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {values.content.body || "Watch chưa có nội dung bán hàng."}
                    </div>
                    {values.content.bulletSpecs.length > 0 && (
                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {values.content.bulletSpecs.map((item, index) => <li key={`${item}-${index}`} className="border-b border-slate-100 py-2 text-sm text-slate-700">{item}</li>)}
                      </ul>
                    )}
                    {values.content.hashTags && <p className="mt-4 text-xs font-semibold text-blue-600">{values.content.hashTags}</p>}
                    <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                      <div className="border-t border-slate-100 pt-3"><span className="text-slate-400">Box</span><div className="mt-1 font-bold">{values.media.hasBox ? "Có" : "Không"}</div></div>
                      <div className="border-t border-slate-100 pt-3"><span className="text-slate-400">Papers</span><div className="mt-1 font-bold">{values.media.hasPapers ? "Có" : "Không"}</div></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div><h3 className="text-xs font-semibold text-slate-500">Gallery</h3><span className="text-xs text-slate-400">Ảnh bán hàng của Watch</span></div>
                      <span className="text-xs text-slate-400">{values.media.galleryImages.length} ảnh</span>
                    </div>
                    {values.media.galleryImages.length ? (
                      <div className="grid grid-cols-2 gap-2">
                        {values.media.galleryImages.map((item, index) => {
                          const rawSrc = item.url || "";
                          const src = resolveMediaPreviewSrc(rawSrc) ?? rawSrc;
                          if (!src) return null;
                          return <div key={`${rawSrc}-${index}`} className={`relative overflow-hidden rounded-lg bg-slate-100 ${index === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}><Image src={src} alt={`${title} ${index + 1}`} fill sizes="280px" unoptimized className="object-cover" />{index === 0 && <span className="absolute left-2 top-2 rounded bg-slate-950/75 px-2 py-1 text-xs font-bold text-white">Cover</span>}</div>;
                        })}
                      </div>
                    ) : <div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400"><ImageIcon className="mb-2 h-6 w-6" />Chưa có ảnh gallery</div>}
                  </div>
                </div>
              </div>
            </section>
            </div>

          </div>
          <aside className={detailUi.completeSide} aria-label="Vận hành đồng hồ">
            <section aria-label="Tình trạng đồng hồ" className={`${detailUi.section} ${detailUi.statusStrip}`}>
              <h2 className={detailUi.illustratedHeading}><CheckCircle2 aria-hidden="true"/>Tình trạng đồng hồ</h2>
              {operationalOverview ? <dl className={detailUi.facts}>
                <div><dt>Bán hàng</dt><dd>{operationalOverview.sale === "SOLD" ? "Đã bán" : "Chưa bán"}<p className={detailUi.metadata}>{statusLabel(operationalOverview.sale)}</p></dd></div>
                <div><dt>Service</dt><dd>{operationalOverview.serviceCompleted} yêu cầu đã hoàn tất<p className={detailUi.metadata}>{operationalOverview.serviceOpen} yêu cầu đang mở</p></dd></div>
                <div><dt>Ký gửi</dt><dd>{({CONSIGNED_TO:"Đang gửi đối tác",CONSIGNED_FROM:"Đang nhận ký gửi",NONE:"Không ký gửi"} as Record<string,string>)[operationalOverview.consignment] ?? "Chưa xác định"}</dd></div>
                <div><dt>Tồn kho</dt><dd>{statusLabel(operationalOverview.stock)}</dd></div>
              </dl> : <p className={detailUi.metadata}>Chưa có dữ liệu tình trạng vận hành.</p>}
            </section>
            <section className={`${detailUi.section} ${detailUi.supportPanel} ${detailUi.attentionPanel}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-950">Cần chú ý</h2>
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${attention.length ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {attention.length ? `${attention.length} việc` : "Ổn"}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {attention.length ? attention.map(({ label, href, icon: Icon }) => (
                  <a key={label} href={href} className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-900">
                    <Icon className="h-4 w-4 shrink-0 text-amber-600" /><span className="flex-1">{label}</span><ChevronRight className="h-4 w-4" />
                  </a>
                )) : (
                  <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3 text-xs font-bold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Không có việc cần xử lý</div>
                )}
              </div>
            </section>
            <div data-watch-section="service" className={detailUi.servicePanel}>
            <div className={detailUi.domainIntro}><Wrench aria-hidden="true"/><div><h2>Kỹ thuật & dịch vụ</h2><p>Theo dõi yêu cầu, lỗi kỹ thuật và tiến độ xử lý.</p></div></div>
            <ServiceCard flat flatTitle="Yêu cầu dịch vụ"
              projection={service as Parameters<typeof ServiceCard>[0]["projection"]}
              productId={values.productId}
              title={title}
              sku={values.header.sku}
              onPreview={(request) => openRelatedPreview("SERVICE", request, "Service Request")}
              onIssuePreview={(issue) => openRelatedPreview("TECHNICAL_ISSUE", issue, "Technical Issue")}
            />

            </div>

            <section aria-label="Công việc liên quan" className={`${detailUi.section} ${detailUi.supportPanel} ${detailUi.relatedPanel}`}>
              <h2 className={detailUi.illustratedHeading}><ReceiptText aria-hidden="true"/>Công việc liên quan</h2>
              <p className={detailUi.metadata}>Các việc được liên kết với đồng hồ hoặc hồ sơ kỹ thuật, trong phạm vi bạn được xem.</p>
              {!operationalOverview ? <p className="mt-4 text-sm text-slate-500">Chưa có dữ liệu công việc.</p> : !operationalOverview.workVisible ? <p className="mt-4 text-sm text-slate-500">Bạn chưa có quyền xem công việc.</p> : <div className="mt-4 grid gap-6 lg:grid-cols-2">
                {([{key:"active",label:"Đang làm",items:operationalOverview.active},{key:"completed",label:"Đã hoàn tất",items:operationalOverview.completed}]).map(group => <div key={group.label} className="min-w-0"><h3 className="text-sm font-semibold">{group.label} <span className="text-xs font-normal text-slate-500">{group.items.length}</span></h3>
                  {group.items.length ? <ul className="mt-2 divide-y divide-slate-100">{(expandedWork[group.key] ? group.items : group.items.slice(0,5)).map(item => <li key={item.id} className="py-3"><div className="flex flex-wrap items-baseline justify-between gap-2"><span className="min-w-0 break-words text-sm font-medium">{item.title}</span><span className="text-xs text-slate-500">{({TODO:"Chưa bắt đầu",IN_PROGRESS:"Đang xử lý",DONE:"Đã xong"} as Record<string,string>)[item.status] ?? item.status}</span></div><p className={detailUi.metadata}>{item.assignee || "Chưa có người nhận"} · {normalizeDate(item.completedAt || item.updatedAt)}</p></li>)}</ul> : <p className="mt-3 text-sm text-slate-500">{group.label === "Đang làm" ? "Không có việc đang làm." : "Chưa có việc hoàn tất."}</p>}
                  {group.items.length > 5 && <AdminButton variant="quiet" density="compact" type="button" onClick={() => setExpandedWork(previous => ({...previous,[group.key]:!previous[group.key]}))}>{expandedWork[group.key] ? "Thu gọn" : `Xem tất cả ${group.items.length} việc`}</AdminButton>}
                </div>)}
              </div>}
            </section>
            <div data-watch-section="trade-history">
            <section id="trade-history" className={`${detailUi.section} ${detailUi.historyPanel}`}>
              <div className="flex items-center justify-between">
                <h2 className={detailUi.illustratedHeading}><ArrowLeftRight aria-hidden="true"/>Giao dịch đã ghi nhận</h2>
              </div>
              <div className="mt-4 space-y-3">
                {transactionEvents.length ? transactionEvents.map((event, index) => (
                  <AdminButton variant="contextual" type="button" onClick={() => openRelatedPreview(event.type, { id: event.id }, event.label)} key={`${event.type}-${event.id || index}`} disabled={!event.id} className="flex w-full items-start gap-3 border-b border-slate-100 pb-3 text-left transition last:border-0 last:pb-0 hover:opacity-75 disabled:cursor-default disabled:opacity-100">
                    <span className={`${detailUi.transactionIcon} ${event.type === "ACQUISITION" ? detailUi.incomingTrade : detailUi.outgoingTrade}`}>
                      {event.type === "ACQUISITION" ? <Landmark className="h-4 w-4" /> : <BadgeDollarSign className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800">{event.label}</span>
                        <span className="text-xs font-bold text-slate-700">{money(event.amount, canViewFinancials)}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{normalizeDate(event.occurredAt)} · {event.party}</div>
                    </div>
                  </AdminButton>
                )) : (
                  <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">Watch chưa có giao dịch mua bán.</div>
                )}
              </div>
            </section>

            </div>
          </aside>
        </div>
      <BusinessEntityPreviewModal
        open={previewState.open}
        preview={previewState.preview}
        loading={previewState.loading}
        error={previewState.error}
        onClose={previewState.closePreview}
        onActivityChanged={previewState.refreshPreview}
        onAction={(action) => {
          if (action.command === "CREATE_SERVICE") {
            previewState.closePreview();
            window.dispatchEvent(new Event("watch:create-service"));
          }
        }}
      />
      {pricingOpen && (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/55 p-4" role="dialog" aria-modal="true" aria-label="Chỉnh giá bán">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-900/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Chỉnh giá bán</h2>
                <p className="mt-1 text-xs text-slate-500">{title}</p>
              </div>
              <AdminButton iconOnly variant="secondary" density="compact" type="button" onClick={() => setPricingOpen(false)} disabled={savingPrice} aria-label="Đóng" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><X className="h-4 w-4" /></AdminButton>
            </div>
            <label className="mt-5 block text-[10px] font-bold uppercase tracking-wide text-slate-500" htmlFor="watch-sale-price">Giá bán</label>
            <div className="mt-2 flex h-12 items-center rounded-xl border border-slate-300 bg-white px-3 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-50">
              <input id="watch-sale-price" autoFocus inputMode="numeric" value={salePriceValue} disabled={savingPrice} onChange={(event) => setSalePriceValue(onlyMoney(event.target.value))} className="min-w-0 flex-1 bg-transparent text-lg font-bold text-slate-950 outline-none" />
              <span className="text-sm font-semibold text-slate-500">đ</span>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <AdminButton variant="secondary" density="compact" type="button" onClick={() => setPricingOpen(false)} disabled={savingPrice} className="h-10 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600">Hủy</AdminButton>
              <AdminButton variant="primary" density="compact" type="button" onClick={() => void saveSalePrice()} disabled={savingPrice} className="h-10 rounded-lg bg-slate-950 px-5 text-xs font-bold text-white disabled:opacity-60">{savingPrice ? "Đang lưu..." : "Lưu giá bán"}</AdminButton>
            </div>
          </div>
        </div>
      )}
      {mediaOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-3 sm:p-4" role="dialog" aria-modal="true" aria-label={`Xử lý Media - ${title}`}>
          <div className="flex h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
            <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4">
              <div className="min-w-0"><div className="truncate text-sm font-bold text-slate-950">Xử lý Media</div><div className="truncate text-xs text-slate-500">{title}</div></div>
              <AdminButton iconOnly variant="secondary" density="compact" type="button" onClick={() => setMediaOpen(false)} aria-label="Đóng Media" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"><X className="h-4 w-4" /></AdminButton>
            </div>
            <iframe src={mediaHref} title={`Xử lý Media - ${title}`} className="min-h-0 flex-1 border-0 bg-slate-50" />
          </div>
        </div>
      )}
      {canEditMedia && <MediaBrowserDialog
        open={inlinePickerOpen}
        onClose={() => {
          if (!savingInline) setInlinePickerOpen(false);
        }}
        profile="inline"
        audienceSegment={audienceSegment}
        selectedKey={values.media.inlineImage?.key ?? null}
        selectedKeys={values.media.inlineImage?.key ? [values.media.inlineImage.key] : []}
        selectionMode="multiple"
        maxSelection={1}
        title="Chọn ảnh INLINE cho Watch"
        description="Ảnh INLINE được dùng làm ảnh đại diện ở trang chi tiết và danh sách Watch. Gallery không bị thay đổi."
        submitLabel={savingInline ? "Đang lưu..." : "Gắn ảnh INLINE"}
        enableRecycle={false}
        onSelect={(key) => void saveInlineImage(key)}
        onSubmit={(keys) => {
          if (keys[0]) void saveInlineImage(keys[0]);
        }}
      />}
    </AdminDetailPage>
  );
}
