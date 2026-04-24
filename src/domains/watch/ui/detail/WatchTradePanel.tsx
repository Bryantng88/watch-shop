"use client";

import { ArrowLeftRight } from "lucide-react";
import {
  DetailField,
  SectionCard,
  SectionEmpty,
  StatusBadge,
  fmtDate,
  fmtMoney,
} from "./shared";

type Props = {
  tradeHistory?: any;
  canViewTradeFinancials?: boolean;
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
          x?.unitCost
      ),
      orders: tradeHistory.filter(
        (x) =>
          String(x?.type ?? x?.kind ?? "")
            .toUpperCase()
            .includes("ORDER") ||
          x?.orderId ||
          x?.salePrice
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

function TradeRow({
  item,
  type,
  canViewTradeFinancials,
}: {
  item: any;
  type: "ACQUISITION" | "ORDER";
  canViewTradeFinancials: boolean;
}) {
  const title =
    item.title ||
    item.code ||
    item.acquisitionCode ||
    item.orderCode ||
    item.id ||
    "-";

  const party =
    item.vendor?.name ||
    item.customer?.name ||
    item.vendorName ||
    item.customerName ||
    "-";

  const money =
    type === "ACQUISITION"
      ? item.unitCost || item.costPrice || item.amount
      : item.salePrice || item.totalAmount || item.amount;

  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-inset ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-sm font-semibold text-slate-900">
              {title}
            </div>
            <StatusBadge label={item.status} />
          </div>

          <div className="mt-1 text-xs text-slate-500">
            {type === "ACQUISITION" ? "Phiếu nhập" : "Đơn hàng"} ·{" "}
            {fmtDate(item.updatedAt || item.createdAt)}
          </div>
        </div>

        {canViewTradeFinancials ? (
          <div className="text-right text-sm font-semibold text-slate-900">
            {fmtMoney(money)}
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <DetailField
          label={type === "ACQUISITION" ? "Vendor" : "Customer"}
          value={party}
        />
        <DetailField
          label="Created"
          value={fmtDate(item.createdAt)}
        />
        <DetailField
          label="Updated"
          value={fmtDate(item.updatedAt)}
        />
      </div>
    </div>
  );
}

export default function WatchTradePanel({
  tradeHistory,
  canViewTradeFinancials = false,
}: Props) {
  const { acquisitions, orders } = normalizeTradeHistory(tradeHistory);
  const hasData = acquisitions.length > 0 || orders.length > 0;

  return (
    <SectionCard
      title="Lịch sử giao dịch"
      subtitle="Theo dõi nguồn nhập và giao dịch bán liên quan."
      icon={<ArrowLeftRight className="h-5 w-5" />}
      defaultOpen
    >
      {!hasData ? (
        <SectionEmpty text="Chưa có lịch sử nhập/bán cho watch này." />
      ) : (
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900">
                Phiếu nhập
              </div>
              <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {acquisitions.length}
              </div>
            </div>

            {acquisitions.length === 0 ? (
              <SectionEmpty text="Chưa có phiếu nhập liên quan." />
            ) : (
              <div className="space-y-3">
                {acquisitions.map((item: any, index: number) => (
                  <TradeRow
                    key={item.id ?? index}
                    item={item}
                    type="ACQUISITION"
                    canViewTradeFinancials={canViewTradeFinancials}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-900">
                Đơn hàng
              </div>
              <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {orders.length}
              </div>
            </div>

            {orders.length === 0 ? (
              <SectionEmpty text="Chưa có đơn hàng liên quan." />
            ) : (
              <div className="space-y-3">
                {orders.map((item: any, index: number) => (
                  <TradeRow
                    key={item.id ?? index}
                    item={item}
                    type="ORDER"
                    canViewTradeFinancials={canViewTradeFinancials}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}