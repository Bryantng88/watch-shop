"use client";

import { History, ShoppingCart, Tag } from "lucide-react";
import { CollapsibleSection, SectionEmpty, fmtDate, fmtMoney } from "./shared";

export default function WatchTradePanel({ tradeHistory }: { tradeHistory?: { acquisitions?: any[]; orders?: any[] } | any[]; }) {
  const normalized = Array.isArray(tradeHistory)
    ? { acquisitions: [], orders: tradeHistory }
    : { acquisitions: tradeHistory?.acquisitions ?? [], orders: tradeHistory?.orders ?? [] };

  return (
    <CollapsibleSection
      title="Lịch sử giao dịch"
      desc="Acquisition và order liên quan đến watch này."
      icon={<History className="h-5 w-5" />}
      defaultOpen={false}
    >
      <div className="space-y-6">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Tag className="h-4 w-4" /> Acquisition
          </div>

          {normalized.acquisitions.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 font-medium">Phiếu nhập</th>
                    <th className="px-3 py-3 font-medium">Vendor</th>
                    <th className="px-3 py-3 font-medium">Unit cost</th>
                    <th className="px-3 py-3 font-medium">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {normalized.acquisitions.map((item: any) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="px-3 py-3 text-slate-900">{item?.acquisitionCode || item?.code || "-"}</td>
                      <td className="px-3 py-3 text-slate-700">{item?.vendor?.name || item?.vendorName || "-"}</td>
                      <td className="px-3 py-3 text-slate-700">{fmtMoney(item?.unitCost)}</td>
                      <td className="px-3 py-3 text-slate-500">{fmtDate(item?.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <SectionEmpty text="Chưa có acquisition history." />
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ShoppingCart className="h-4 w-4" /> Orders
          </div>

          {normalized.orders.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 font-medium">Đơn hàng</th>
                    <th className="px-3 py-3 font-medium">Khách</th>
                    <th className="px-3 py-3 font-medium">Giá bán</th>
                    <th className="px-3 py-3 font-medium">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {normalized.orders.map((item: any) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="px-3 py-3 text-slate-900">{item?.orderCode || item?.code || "-"}</td>
                      <td className="px-3 py-3 text-slate-700">{item?.customerName || item?.order?.customerName || "-"}</td>
                      <td className="px-3 py-3 text-slate-700">{fmtMoney(item?.subtotal ?? item?.unitPriceAgreed)}</td>
                      <td className="px-3 py-3 text-slate-500">{fmtDate(item?.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <SectionEmpty text="Chưa có order history." />
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
