"use client";

import { ArrowLeftRight } from "lucide-react";
import { SectionCard, SectionEmpty, fmtDate, fmtMoney } from "./shared";

type Props = {
  tradeHistory?: any;
  canViewTradeFinancials?: boolean;
};

type TimelineRow = {
  id: string;
  date: any;
  amount: any;
  text: string;
  tone: "buy" | "sell" | "buyback";
};

function normalizeTradeHistory(tradeHistory: any) {
  if (Array.isArray(tradeHistory)) {
    return {
      acquisitions: tradeHistory.filter(
        (x) =>
          String(x?.type ?? x?.kind ?? "")
            .toUpperCase()
            .includes("ACQUISITION") ||
          x?.acquisitionId ||
          x?.unitCost,
      ),
      orders: tradeHistory.filter(
        (x) =>
          String(x?.type ?? x?.kind ?? "")
            .toUpperCase()
            .includes("ORDER") ||
          x?.orderId ||
          x?.salePrice,
      ),
    };
  }

  return {
    acquisitions: Array.isArray(tradeHistory?.acquisitions)
      ? tradeHistory.acquisitions
      : [],
    orders: Array.isArray(tradeHistory?.orders) ? tradeHistory.orders : [],
  };
}

function getAcquisitionParty(item: any) {
  if (String(item?.acquisitionType ?? "").toUpperCase() === "BUY_BACK") {
    return (
      item.customer?.name ||
      item.customerName ||
      item.orderCustomerName ||
      "khách"
    );
  }

  return item.vendor?.name || item.vendorName || "nguồn nhập";
}

function getOrderParty(item: any) {
  return item.customer?.name || item.customerName || "khách";
}

function buildTimeline(tradeHistory: any): TimelineRow[] {
  const { acquisitions, orders } = normalizeTradeHistory(tradeHistory);

  const acquisitionRows: TimelineRow[] = acquisitions.map((item: any, index: number) => {
    const acquisitionType = String(item?.acquisitionType ?? "").toUpperCase();
    const isBuyBack = acquisitionType === "BUY_BACK";

    return {
      id: `acq-${item.id ?? index}`,
      date: item.createdAt ?? item.updatedAt,
      amount: item.amount ?? item.unitCost ?? item.costPrice,
      text: isBuyBack
        ? `Mua lại từ ${getAcquisitionParty(item)}`
        : `Mua từ ${getAcquisitionParty(item)}`,
      tone: isBuyBack ? "buyback" : "buy",
    };
  });

  const orderRows: TimelineRow[] = orders.map((item: any, index: number) => ({
    id: `order-${item.id ?? index}`,
    date: item.createdAt ?? item.updatedAt,
    amount: item.amount ?? item.salePrice ?? item.totalAmount,
    text: `Bán cho ${getOrderParty(item)}`,
    tone: "sell",
  }));

  return [...acquisitionRows, ...orderRows].sort((a, b) => {
    const timeA = new Date(a.date ?? 0).getTime();
    const timeB = new Date(b.date ?? 0).getTime();
    return timeA - timeB;
  });
}

function dotClass(tone: TimelineRow["tone"]) {
  if (tone === "sell") return "bg-emerald-500";
  if (tone === "buyback") return "bg-orange-500";
  return "bg-blue-500";
}

export default function WatchTradePanel({
  tradeHistory,
  canViewTradeFinancials = false,
}: Props) {
  const timeline = buildTimeline(tradeHistory);

  return (
    <SectionCard
      title="Lịch sử giao dịch"
      subtitle="Theo dõi vòng đời mua vào, bán ra và mua lại của watch."
      icon={<ArrowLeftRight className="h-5 w-5" />}
      defaultOpen
    >
      {timeline.length === 0 ? (
        <SectionEmpty text="Chưa có lịch sử nhập/bán cho watch này." />
      ) : (
        <div className="space-y-2">
          {timeline.map((row, index) => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                  {index + 1}
                </div>

                <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass(row.tone)}`} />

                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-950">
                    {row.text}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {fmtDate(row.date)}
                  </div>
                </div>
              </div>

              {canViewTradeFinancials ? (
                <div className="shrink-0 text-right text-sm font-semibold text-slate-950">
                  {fmtMoney(row.amount)}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}