"use client";

import { Calculator, Wand2 } from "lucide-react";
import type { WatchWorkbenchPermissions, WatchWorkbenchValues } from "@/domains/watch/client/workbench/types";
import { maskMoney, moneyText, onlyMoney, updateValues } from "@/domains/watch/client/workbench/workbench-utils";
import { Field, inputClass, OperationShell, Pill } from "../shared/OperationShell";
import PriceLedgerTable, { PriceLedgerItem, PriceSnapshot } from "./PriceLedgerTable";
import PricePermissionNotice from "./PricePermissionNotice";

export default function PriceBlock({
    values,
    permissions,
    tradeHistory,
    onChange,
    onSave,
}: {
    values: WatchWorkbenchValues;
    permissions: WatchWorkbenchPermissions;
    tradeHistory?: any;
    onChange: (next: WatchWorkbenchValues) => void;
    onSave: () => void;
}) {
    const acquisitions = Array.isArray(tradeHistory?.acquisitions) ? tradeHistory.acquisitions : [];
    const acquisitionAmount = acquisitions[0]?.amount ?? values.pricing.costPrice;
    const shipmentAmount = values.pricing.serviceCost || "";
    const landedCost = values.pricing.landedCost || values.pricing.costPrice || acquisitionAmount;
    const salePrice = values.pricing.salePrice;
    const profit = Number(salePrice || 0) - Number(landedCost || 0);
    const ledgerItems: PriceLedgerItem[] = [
        {
            label: "Acquisition payment OUT",
            description: acquisitions[0]?.code ? `${acquisitions[0].code} · ${acquisitions[0]?.vendorName ?? "Vendor"}` : "Chi phí nhập từ phiếu nhập",
            amount: acquisitionAmount,
            status: acquisitionAmount ? "PAID" : "NONE",
        },
        {
            label: "Service payment OUT",
            description: "Bảo dưỡng, kiểm tra máy và sinh tổng thể",
            amount: values.pricing.serviceCost,
            status: values.pricing.serviceCost ? "UNPAID" : "NONE",
        },
        {
            label: "Shipment / logistics OUT",
            description: "Phí vận chuyển quốc tế + nội địa",
            amount: shipmentAmount,
            status: shipmentAmount ? "UNPAID" : "NONE",
        },
        {
            label: "Other costs / fees OUT",
            description: "Phụ kiện, bao bì, dụng cụ",
            amount: null,
            status: "NONE",
        },
    ];

    const setPricing = (patch: Partial<WatchWorkbenchValues["pricing"]>) =>
        onChange(updateValues(values, { pricing: patch }));

    return (
        <OperationShell
            id="pricing"
            number="1"
            title="Giá & cost ledger"
            icon={<Calculator className="h-4 w-4" />}
            description="Thiết lập giá bán và quản lý cost. Field nhạy cảm được gate theo quyền admin."
            actions={
                <>
                    <Pill tone="red">Admin only</Pill>
                    <button type="button" className="h-9 rounded-md border border-amber-200 bg-amber-50 px-3 text-xs font-bold text-amber-700">
                        Phụ phí/chi phí
                    </button>
                    <button type="button" onClick={onSave} className="h-9 rounded-md bg-slate-950 px-3 text-xs font-bold text-white">
                        Làm gọn
                    </button>
                </>
            }
        >
            <div className="grid gap-4 xl:grid-cols-[minmax(260px,0.56fr)_minmax(0,1fr)]">
                <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-emerald-50/50 p-4">
                    <div className="text-[11px] font-black uppercase text-blue-500">Suggested listing price</div>
                    <div className="mt-2 text-3xl font-black text-slate-950">
                        {salePrice ? moneyText(salePrice) : maskMoney(permissions.canViewSensitivePrice, landedCost)} VND
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Giá bán có thể hiển thị, cost/margin/payment OUT chỉ mở cho admin.</div>
                    <div className="mt-10 grid grid-cols-2 gap-3">
                        <PriceSnapshot label="Giá vốn" value={permissions.canViewSensitivePrice ? landedCost : null} />
                        <PriceSnapshot label="Lợi nhuận dự kiến" value={permissions.canViewSensitivePrice ? profit : null} tone={profit < 0 ? "red" : "slate"} />
                    </div>
                    {!permissions.canViewSensitivePrice ? <div className="mt-3"><PricePermissionNotice /></div> : null}
                </div>

                <PriceLedgerTable items={ledgerItems} canViewSensitivePrice={permissions.canViewSensitivePrice} />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
                <Field label="Số tiền">
                    <input
                        className={inputClass}
                        value={permissions.canViewSensitivePrice ? values.pricing.costPrice : "••••••"}
                        disabled={!permissions.canEditPrice}
                        onChange={(event) => setPricing({ costPrice: onlyMoney(event.target.value) })}
                    />
                </Field>
                <Field label="Service rate">
                    <input
                        className={inputClass}
                        value={permissions.canViewSensitivePrice ? values.pricing.serviceCost : "••••••"}
                        disabled={!permissions.canEditPrice}
                        onChange={(event) => setPricing({ serviceCost: onlyMoney(event.target.value) })}
                    />
                </Field>
                <Field label="Profit amount">
                    <input className={inputClass} value={permissions.canViewSensitivePrice ? moneyText(profit) : "••••••"} disabled />
                </Field>
                <Field label="Bán price">
                    <input
                        className={inputClass}
                        value={values.pricing.salePrice}
                        disabled={!permissions.canEditPrice}
                        placeholder="Nhập giá bán"
                        onChange={(event) => setPricing({ salePrice: onlyMoney(event.target.value) })}
                    />
                </Field>
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-3 text-xs leading-5 text-amber-800 md:flex-row md:items-center md:justify-between">
                <div>
                    <b>Projection advice:</b> cost ledger cần financial rollup từ payment OUT service/shipment/acquisition. UI này không tự ghi projection, chỉ emit event/domain save.
                </div>
                <button type="button" className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-amber-200 bg-white px-3 font-bold text-amber-800">
                    <Wand2 className="h-4 w-4" />
                    Xem projection
                </button>
            </div>
        </OperationShell>
    );
}
