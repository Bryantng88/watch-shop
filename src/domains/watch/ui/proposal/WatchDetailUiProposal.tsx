"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  BadgeDollarSign,
  Box,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileText,
  History,
  ImageIcon,
  Info,
  Landmark,
  MoreHorizontal,
  PackageCheck,
  Pencil,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
} from "lucide-react";

import { mapWatchDetailToFormValues } from "@/domains/watch/client/form/watch-form.mapper";
import {
  moneyText,
  normalizeDate,
} from "@/domains/watch/client/workbench/workbench-utils";
import { resolveMediaPreviewSrc } from "@/lib/media-profile";

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

function Metric({
  label,
  value,
  note,
  tone = "slate",
}: {
  label: string;
  value: string;
  note: string;
  tone?: "slate" | "emerald" | "violet" | "rose";
}) {
  const valueTone = {
    slate: "text-slate-950",
    emerald: "text-emerald-700",
    violet: "text-violet-700",
    rose: "text-rose-600",
  }[tone];
  const surfaceTone = {
    slate: "border-slate-200 bg-slate-50/80",
    emerald: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white",
    violet: "border-violet-100 bg-gradient-to-br from-violet-50 via-violet-50/60 to-white",
    rose: "border-rose-100 bg-gradient-to-br from-rose-50 to-white",
  }[tone];
  return (
    <div className={`min-w-0 rounded-lg border px-4 py-4 ${surfaceTone}`}>
      <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</div>
      <div className={`mt-2 truncate text-xl font-bold tracking-[-0.03em] ${valueTone}`}>{value}</div>
      <div className="mt-1 text-[11px] text-slate-400">{note}</div>
    </div>
  );
}

export default function WatchDetailUiProposal({
  detail,
  service,
  tradeHistory,
  canViewFinancials,
}: {
  detail: RecordValue;
  service: unknown;
  tradeHistory: RecordValue;
  canViewFinancials: boolean;
}) {
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
    { label: "Giá nhập", note: "Từ phiếu nhập gần nhất", amount: acquisitionCost, icon: Landmark, tone: "bg-blue-50 text-blue-700" },
    { label: "Service", note: `${rows(tradeHistory.serviceFees).length} hạng mục kỹ thuật`, amount: serviceCost, icon: Wrench, tone: "bg-amber-50 text-amber-700" },
    { label: "Vận chuyển", note: `${rows(tradeHistory.shipmentFees).length} shipment liên quan`, amount: shipmentCost, icon: Truck, tone: "bg-cyan-50 text-cyan-700" },
    { label: "Chi phí khác", note: "Payment OUT khác", amount: otherCost, icon: ReceiptText, tone: "bg-slate-100 text-slate-600" },
  ];

  const contentReady = Boolean(values.content.titleOverride || values.content.body);
  const imageReady = ["APPROVED", "READY", "PUBLISHED"].includes(values.imageReviewStatus.toUpperCase());
  const attention = [
    ...(!imageReady ? [{ label: "Gallery đang chờ duyệt", href: "#media", icon: ImageIcon }] : []),
    ...(!contentReady ? [{ label: "Chưa có nội dung bán hàng", href: "#content", icon: FileText }] : []),
  ];
  const serviceRecord = record(service);
  const activeIssues = number(serviceRecord.activeTechnicalIssueCount ?? serviceRecord.activeCount);
  const transactionEvents = [
    ...rows(tradeHistory.acquisitions).slice(0, 2).map((item) => ({
      label: "Nhập hàng",
      party: text(item.vendorName, "Vendor"),
      amount: item.amount,
      occurredAt: item.updatedAt || item.createdAt,
      tone: "bg-rose-50 text-rose-700",
    })),
    ...rows(tradeHistory.orders).slice(0, 2).map((item) => ({
      label: "Bán hàng",
      party: text(item.customerName, "Khách hàng"),
      amount: item.amount,
      occurredAt: item.updatedAt || item.createdAt,
      tone: "bg-emerald-50 text-emerald-700",
    })),
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20 text-slate-900">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-5 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-violet-900">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <span className="font-bold">UI proposal</span>
            <span className="text-violet-700">Bản thử nghiệm chỉ đọc, không thay đổi Watch Detail hiện tại.</span>
          </div>
          <Link href={`/admin/watches/${values.productId}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-900">
            <ArrowLeft className="h-4 w-4" /> Quay lại giao diện hiện tại
          </Link>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/admin/watches" className="hover:text-violet-700">Danh sách Watch</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-slate-800">{title}</span>
          </div>
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm">
            <MoreHorizontal className="h-4 w-4" /> Thao tác
          </button>
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
                <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-xs font-bold text-white transition hover:bg-slate-800">
                  <Pencil className="h-4 w-4" /> Chỉnh thông tin
                </button>
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

        <nav className="mt-4 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          {["Tổng quan", "Nội dung & hình ảnh", "Service", "Lịch sử"].map((label, index) => (
            <button key={label} className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold ${index === 0 ? "bg-violet-600 text-white shadow-sm shadow-violet-200" : "text-slate-500 hover:bg-violet-50 hover:text-violet-700"}`}>{label}</button>
          ))}
        </nav>

        <div className="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="relative flex flex-wrap items-center justify-between gap-3 overflow-hidden border-b border-violet-100 bg-gradient-to-r from-white via-violet-50/35 to-violet-50/80 px-5 py-4">
                <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-violet-500 to-indigo-500" />
                <div>
                  <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
                    <CircleDollarSign className="h-5 w-5 text-violet-600" /> Giá & lợi nhuận
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">Một nguồn thông tin tài chính duy nhất cho Watch.</p>
                </div>
                <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-200 px-3 text-xs font-bold text-violet-700">
                  <Pencil className="h-3.5 w-3.5" /> Chỉnh giá bán
                </button>
              </div>

              <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Giá bán" value={money(salePrice)} note="Giá đang áp dụng" tone="violet" />
                <Metric label="Tổng giá vốn" value={money(landedCost, canViewFinancials)} note="Từ cost ledger" />
                <Metric label="Lợi nhuận dự kiến" value={money(profit, canViewFinancials)} note="Giá bán − giá vốn" tone={profit >= 0 ? "emerald" : "rose"} />
                <Metric label="Biên lợi nhuận" value={canViewFinancials ? `${margin.toFixed(1)}%` : "••••"} note="Theo giá bán hiện tại" tone={margin >= 20 ? "emerald" : "slate"} />
              </div>

              <div className="border-t border-slate-100 px-5 py-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Cấu thành giá vốn</h3>
                  <span className="text-[10px] text-slate-400">Đọc từ projection</span>
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  {costRows.map(({ label, note, amount, icon: Icon, tone }) => (
                    <div key={label} className="grid grid-cols-[minmax(0,1fr)_130px_28px] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50/70">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></span>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-800">{label}</div>
                          <div className="mt-0.5 truncate text-[11px] text-slate-400">{note}</div>
                        </div>
                      </div>
                      <div className="text-right text-sm font-bold text-rose-600">{money(amount, canViewFinancials)}</div>
                      <ArrowUpRight className="h-4 w-4 text-slate-300" />
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-slate-200 bg-slate-950 px-4 py-3 text-white">
                    <span className="text-xs font-bold text-slate-300">Tổng giá vốn</span>
                    <span className="text-sm font-bold">{money(landedCost, canViewFinancials)}</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-bold"><PackageCheck className="h-4 w-4 text-blue-600" /> Thông tin bán hàng</h2>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-slate-50 p-3"><span className="text-slate-400">Box</span><div className="mt-1 font-bold">{values.media.hasBox ? "Có" : "Không"}</div></div>
                  <div className="rounded-lg bg-slate-50 p-3"><span className="text-slate-400">Papers</span><div className="mt-1 font-bold">{values.media.hasPapers ? "Có" : "Không"}</div></div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-[76px]">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-bold"><Wrench className="h-4 w-4 text-emerald-600" /> Service</h2>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
              <div className={`mt-4 flex items-center gap-3 rounded-lg p-3 ${activeIssues ? "bg-amber-50" : "bg-emerald-50"}`}>
                <ShieldCheck className={`h-5 w-5 shrink-0 ${activeIssues ? "text-amber-600" : "text-emerald-600"}`} />
                <div>
                  <div className={`text-xs font-bold ${activeIssues ? "text-amber-900" : "text-emerald-900"}`}>{activeIssues ? `${activeIssues} TI đang xử lý` : "Không có TI đang xử lý"}</div>
                  <div className={`mt-0.5 text-[10px] ${activeIssues ? "text-amber-700" : "text-emerald-700"}`}>Xem chi tiết trong Service Board</div>
                </div>
              </div>
              <Link href="/admin/services/operation" className={`mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg border text-xs font-bold ${activeIssues ? "border-amber-200 text-amber-700 hover:bg-amber-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}>
                Mở Service Board
              </Link>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-bold"><ArrowLeftRight className="h-4 w-4 text-indigo-600" /> Lịch sử mua bán</h2>
                <button className="text-[10px] font-bold text-indigo-700">Xem tất cả</button>
              </div>
              <div className="mt-4 space-y-3">
                {transactionEvents.length ? transactionEvents.map((event, index) => (
                  <div key={`${event.label}-${index}`} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
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
                  </div>
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

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-bold"><History className="h-4 w-4 text-violet-600" /> Hoạt động gần đây</h2>
                <Link href="/admin/activity" className="text-[10px] font-bold text-violet-700">Xem tất cả</Link>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  ["Giá bán được cập nhật", "Hôm nay · 19:04"],
                  ["Technical Issue hoàn tất", "Hôm nay · 16:14"],
                  ["Payment được ghi nhận", "Hôm nay · 12:51"],
                ].map(([label, time], index) => (
                  <div key={label} className="flex gap-3">
                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${index ? "bg-slate-300" : "bg-violet-500"}`} />
                    <div><div className="text-xs font-semibold text-slate-700">{label}</div><div className="mt-1 text-[10px] text-slate-400">{time}</div></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-xs text-slate-500">
              <div className="flex items-center gap-2 font-bold text-slate-700"><Box className="h-4 w-4" /> Diagnostics đã được ẩn</div>
              <p className="mt-2 leading-5">Projection feed và contract kỹ thuật sẽ nằm trong menu quản trị, không chiếm không gian vận hành chính.</p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
