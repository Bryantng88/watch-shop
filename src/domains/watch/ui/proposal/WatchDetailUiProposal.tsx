"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  Info,
  Landmark,
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
} from "@/domains/watch/client/workbench/workbench-utils";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";
import type { BusinessEntityPreview } from "@/domains/shared/business/business-entity.types";
import {
  BusinessEntityPreviewModal,
  useBusinessEntityPreview,
} from "@/domains/shared/ui/business/BusinessEntityPreview";
import ServiceCard from "@/domains/watch/ui/operations/side/ServiceCard";
import WatchPublishAssetActions from "./WatchPublishAssetActions";

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
  mediaWorkspace,
}: {
  detail: RecordValue;
  service: unknown;
  tradeHistory: RecordValue;
  canViewFinancials: boolean;
  live?: boolean;
  canEditPrice?: boolean;
  mediaWorkspace?: RecordValue;
}) {
  const [mediaOpen, setMediaOpen] = useState(false);
  const previewState = useBusinessEntityPreview();
  const values = mapWatchDetailToFormValues(detail);
  const brand = record(detail.brand);
  const vendor = record(detail.vendor);
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
  const editHref = `${detailHref}/edit?returnTo=${encodeURIComponent(detailHref)}`;
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
  const salePrice = number(values.pricing.salePrice || values.pricing.listPrice);
  const profit = salePrice - landedCost;
  const margin = salePrice > 0 ? profit / salePrice * 100 : 0;
  const costRows = [
    { label: "Giá nhập", note: "Từ phiếu nhập gần nhất", amount: acquisitionCost },
    { label: "Service", note: `${rows(tradeHistory.serviceFees).length} hạng mục kỹ thuật`, amount: serviceCost },
    { label: "Vận chuyển", note: `${rows(tradeHistory.shipmentFees).length} shipment liên quan`, amount: shipmentCost },
    { label: "Chi phí khác", note: "Payment OUT khác", amount: otherCost },
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
  const transactionEvents = [
    ...acquisitions.slice(0, 2).map((item) => ({
      id: text(item.id, ""),
      type: "ACQUISITION" as const,
      label: "Nhập hàng",
      party: text(item.vendorName, "Vendor"),
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
    const id = text(item?.id, "");
    if (!id) return;
    const refNo = text(item?.refNo, "");
    previewState.openPreview({
      type,
      id,
      refNo: refNo || null,
      title: refNo ? `${label} ${refNo}` : label,
      subtitle: title,
      status: text(item?.status, "") || null,
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20 text-slate-900">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-5 lg:px-8">
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

        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/admin/watches" className="hover:text-violet-700">Danh sách Watch</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-slate-800">{title}</span>
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
            <div className="relative min-h-[250px] bg-slate-100">
              {imageSrc ? (
                <Image src={imageSrc} alt={title} fill sizes="260px" unoptimized className="object-cover" />
              ) : (
                <div className="grid h-full min-h-[250px] place-items-center text-slate-300"><Camera className="h-10 w-10" /></div>
              )}
              <span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/85 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur">
                {Math.max(values.media.galleryImages.length, images.length)} ảnh
              </span>
            </div>

            <div className="flex min-w-0 flex-col p-5 lg:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700">{values.header.sku || values.productId}</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">{statusLabel(values.basic.stockState)}</span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">{statusLabel(values.basic.saleState)}</span>
                  </div>
                  <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-950">{title}</h1>
                  <p className="mt-2 text-sm text-slate-500">
                    {[text(brand.name, ""), values.spec.model, values.spec.referenceNumber].filter(Boolean).join(" · ") || "Chưa đủ thông tin nhận diện"}
                  </p>
                </div>
                <Link href={editHref} className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800">
                  <Pencil className="h-4 w-4" /> Chỉnh thông tin
                </Link>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-x-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
                {[
                  ["Vendor", text(vendor.name)],
                  ["Năm sản xuất", values.basic.yearText || "—"],
                  ["Bộ máy", values.spec.calibre || values.basic.movementCalibre || "—"],
                  ["Tình trạng", values.basic.conditionGrade || "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{label}</div>
                    <div className="mt-1 truncate text-xs font-bold text-slate-800">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <nav className="flex min-w-0 gap-1 overflow-x-auto">
            {[
              ["Tổng quan", "#overview"],
              ["Nội dung & hình ảnh", "#content-media"],
              ["Service", "#service"],
              ["Lịch sử", "#trade-history"],
            ].map(([label, href]) => (
              <a href={href} key={label} className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-violet-700">{label}</a>
            ))}
          </nav>

          {live && (
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <button type="button" onClick={() => setMediaOpen(true)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-violet-200 px-2.5 text-xs font-semibold text-violet-700"><Camera className="h-3.5 w-3.5" /> Xử lý Media</button>
              <button type="button" disabled={!latestServiceRequest} title={latestServiceRequest ? "Xem nhanh Service Request gần nhất" : "Watch chưa có Service Request"} onClick={() => openRelatedPreview("SERVICE", latestServiceRequest, "Service Request")} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><Wrench className="h-3.5 w-3.5" /> Service</button>
              <button type="button" disabled={!latestOrder} title={latestOrder ? "Xem nhanh Order gần nhất" : "Watch chưa có Order"} onClick={() => openRelatedPreview("ORDER", latestOrder, "Order")} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><ReceiptText className="h-3.5 w-3.5" /> Order</button>
              <button type="button" disabled={!latestAcquisition} title={latestAcquisition ? "Xem nhanh phiếu nhập gần nhất" : "Watch chưa có phiếu nhập"} onClick={() => openRelatedPreview("ACQUISITION", latestAcquisition, "Phiếu nhập / Buy Back")} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeftRight className="h-3.5 w-3.5" /> Phiếu nhập / Buy Back</button>
            </div>
          )}
        </div>

        <div className="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            <section id="overview" className="scroll-mt-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-bold">
                    <CircleDollarSign className="h-4 w-4 text-violet-600" /> Giá & lợi nhuận
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">Một nguồn thông tin tài chính duy nhất cho Watch.</p>
                </div>
                {canEditPrice ? (
                  <Link href={`${editHref}#pricing`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-200 px-3 text-xs font-bold text-violet-700">
                    <Pencil className="h-3.5 w-3.5" /> Chỉnh giá bán
                  </Link>
                ) : null}
              </div>

              <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(420px,1.2fr)] lg:gap-0">
                <div className="lg:border-r lg:border-slate-200 lg:pr-6">
                  <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4 shadow-[0_2px_8px_rgba(109,40,217,0.06)]">
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-violet-500">Giá bán hiện tại</div>
                    <div className="mt-1 text-2xl font-bold tracking-[-0.03em] text-slate-950">{money(salePrice)}</div>
                    <p className="mt-1 text-[11px] text-slate-500">Giá đang áp dụng cho Watch</p>
                  </div>

                  <dl className="mt-3 divide-y divide-slate-100 border-y border-slate-200">
                    {[
                      ["Tổng giá vốn", money(landedCost, canViewFinancials)],
                      ["Lợi nhuận dự kiến", money(profit, canViewFinancials)],
                      ["Biên lợi nhuận", canViewFinancials ? `${margin.toFixed(1)}%` : "••••"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                        <dt className="text-slate-500">{label}</dt>
                        <dd className="font-semibold text-slate-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="lg:pl-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Cấu thành giá vốn</h3>
                    <span className="text-[10px] text-slate-400">Đọc từ projection</span>
                  </div>
                  <div className="divide-y divide-slate-100 border-y border-slate-200">
                    {costRows.map(({ label, note, amount }) => (
                      <div key={label} className="flex items-center justify-between gap-4 py-2.5">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-800">{label}</div>
                          <div className="truncate text-[11px] text-slate-400">{note}</div>
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

            <section id="content-media" className="scroll-mt-24">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                  <div>
                    <h2 className="flex items-center gap-2 text-sm font-bold"><FileText className="h-4 w-4 text-violet-600" /> Nội dung & hình ảnh</h2>
                    <p className="mt-1 text-xs text-slate-400">Nội dung bán hàng và gallery đang gắn với Watch.</p>
                  </div>
                  <div className="flex gap-2">
                    <WatchPublishAssetActions detail={detail} />
                    <button type="button" onClick={() => setMediaOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-200 px-3 text-xs font-bold text-violet-700"><Camera className="h-4 w-4" /> Xử lý Media</button>
                  </div>
                </div>
                <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-950">{values.content.titleOverride || title}</h3>
                    {values.content.hookText && <p className="mt-2 text-sm font-semibold text-violet-700">{values.content.hookText}</p>}
                    <div className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {values.content.body || "Watch chưa có nội dung bán hàng."}
                    </div>
                    {values.content.bulletSpecs.length > 0 && (
                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {values.content.bulletSpecs.map((item, index) => <li key={`${item}-${index}`} className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">{item}</li>)}
                      </ul>
                    )}
                    {values.content.hashTags && <p className="mt-4 text-xs font-semibold text-blue-600">{values.content.hashTags}</p>}
                    <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-lg bg-slate-50 p-3"><span className="text-slate-400">Box</span><div className="mt-1 font-bold">{values.media.hasBox ? "Có" : "Không"}</div></div>
                      <div className="rounded-lg bg-slate-50 p-3"><span className="text-slate-400">Papers</span><div className="mt-1 font-bold">{values.media.hasPapers ? "Có" : "Không"}</div></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 flex items-center justify-between"><h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Gallery</h3><span className="text-xs text-slate-400">{values.media.galleryImages.length} ảnh</span></div>
                    {values.media.galleryImages.length ? (
                      <div className="grid grid-cols-2 gap-2">
                        {values.media.galleryImages.map((item, index) => {
                          const rawSrc = item.url || "";
                          const src = resolveMediaPreviewSrc(rawSrc) ?? rawSrc;
                          if (!src) return null;
                          return <div key={`${rawSrc}-${index}`} className={`relative overflow-hidden rounded-lg bg-slate-100 ${index === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}><Image src={src} alt={`${title} ${index + 1}`} fill sizes="280px" unoptimized className="object-cover" />{index === 0 && <span className="absolute left-2 top-2 rounded bg-slate-950/75 px-2 py-1 text-[9px] font-bold text-white">Cover</span>}</div>;
                        })}
                      </div>
                    ) : <div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400"><ImageIcon className="mb-2 h-6 w-6" />Chưa có ảnh gallery</div>}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-[76px]">
            <ServiceCard
              projection={service as Parameters<typeof ServiceCard>[0]["projection"]}
              productId={values.productId}
              title={title}
              sku={values.header.sku}
              onPreview={(request) => openRelatedPreview("SERVICE", request, "Service Request")}
              onIssuePreview={(issue) => openRelatedPreview("TECHNICAL_ISSUE", issue, "Technical Issue")}
            />

            <section id="trade-history" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-bold"><ArrowLeftRight className="h-4 w-4 text-indigo-600" /> Lịch sử mua bán</h2>
              </div>
              <div className="mt-4 space-y-3">
                {transactionEvents.length ? transactionEvents.map((event, index) => (
                  <button type="button" onClick={() => openRelatedPreview(event.type, { id: event.id }, event.label)} key={`${event.type}-${event.id || index}`} disabled={!event.id} className="flex w-full items-start gap-3 border-b border-slate-100 pb-3 text-left transition last:border-0 last:pb-0 hover:opacity-75 disabled:cursor-default disabled:opacity-100">
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${event.tone}`}>
                      {event.label === "Nhập hàng" ? <Landmark className="h-4 w-4" /> : <BadgeDollarSign className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800">{event.label}</span>
                        <span className="text-xs font-bold text-slate-700">{money(event.amount, canViewFinancials)}</span>
                      </div>
                      <div className="mt-1 truncate text-[10px] text-slate-400">{normalizeDate(event.occurredAt)} · {event.party}</div>
                    </div>
                  </button>
                )) : (
                  <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">Watch chưa có giao dịch mua bán.</div>
                )}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-950">Cần chú ý</h2>
                <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${attention.length ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
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
              <div className="mt-3 flex items-start gap-2 text-[10px] leading-4 text-slate-400"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Checklist chỉ hiện vấn đề cần hành động, không lặp lại toàn bộ tiến độ.</div>
            </section>

          </aside>
        </div>
      </div>
      <BusinessEntityPreviewModal
        open={previewState.open}
        preview={previewState.preview}
        loading={previewState.loading}
        error={previewState.error}
        onClose={previewState.closePreview}
        onActivityChanged={previewState.refreshPreview}
      />
      {mediaOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-3 sm:p-4" role="dialog" aria-modal="true" aria-label={`Xử lý Media - ${title}`}>
          <div className="flex h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
            <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4">
              <div className="min-w-0"><div className="truncate text-sm font-bold text-slate-950">Xử lý Media</div><div className="truncate text-xs text-slate-500">{title}</div></div>
              <button type="button" onClick={() => setMediaOpen(false)} aria-label="Đóng Media" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"><X className="h-4 w-4" /></button>
            </div>
            <iframe src={mediaHref} title={`Xử lý Media - ${title}`} className="min-h-0 flex-1 border-0 bg-slate-50" />
          </div>
        </div>
      )}
    </main>
  );
}
