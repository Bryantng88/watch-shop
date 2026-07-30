"use client";

import { Calculator, Loader2, Wand2 } from "lucide-react";
import type { WatchWorkbenchPermissions, WatchWorkbenchValues } from "@/domains/watch/client/workbench/types";
import { maskMoney, moneyText, onlyMoney, updateValues } from "@/domains/watch/client/workbench/workbench-utils";
import { Field, inputClass, OperationShell, operationButtonClass } from "../shared/OperationShell";
import PriceLedgerTable, { PriceLedgerItem, PriceSnapshot } from "./PriceLedgerTable";
import PricePermissionNotice from "./PricePermissionNotice";

type TradeHistory = {
    acquisitions?: Array<Record<string, unknown>>;
    costLedger?: Array<Record<string, unknown>>;
    serviceFees?: Array<Record<string, unknown>>;
    shipmentFees?: Array<Record<string, unknown>>;
    costSummary?: {
        acquisitionAmount?: number | null;
        serviceAmount?: number | null;
        shipmentAmount?: number | null;
        otherAmount?: number | null;
        landedCost?: number | null;
    } | null;
};

function stringValue(value: unknown) {
    return typeof value === "string" ? value : "";
}

function numberValue(value: unknown) {
    const amount = Number(value ?? 0);
    return Number.isFinite(amount) ? amount : 0;
}

function normalized(value: unknown) {
    return String(value ?? "").trim().toUpperCase();
}

export default function PriceBlock({
    values,
    permissions,
    tradeHistory,
    onChange,
    onSave,
    saving = false,
}: {
    values: WatchWorkbenchValues;
    permissions: WatchWorkbenchPermissions;
    tradeHistory?: TradeHistory | Array<Record<string, unknown>>;
    onChange: (next: WatchWorkbenchValues) => void;
    onSave: () => void;
    saving?: boolean;
}) {
    const acquisitions = !Array.isArray(tradeHistory) && Array.isArray(tradeHistory?.acquisitions)
        ? tradeHistory.acquisitions
        : [];
    const costLedger = !Array.isArray(tradeHistory) && Array.isArray(tradeHistory?.costLedger)
        ? tradeHistory.costLedger
        : [];
    const serviceFees = !Array.isArray(tradeHistory) && Array.isArray(tradeHistory?.serviceFees)
        ? tradeHistory.serviceFees
        : [];
    const shipmentFees = !Array.isArray(tradeHistory) && Array.isArray(tradeHistory?.shipmentFees)
        ? tradeHistory.shipmentFees
        : [];
    const acquisition = acquisitions[0] ?? {};
    const costSummary = !Array.isArray(tradeHistory) ? tradeHistory?.costSummary : null;
    const paymentGroups = {
        acquisition: costLedger.filter((item) => normalized(item.type) === "ACQUISITION"),
        service: costLedger.filter((item) => normalized(item.type) === "SERVICE"),
        shipment: costLedger.filter((item) => normalized(item.type) === "SHIPMENT"),
        other: costLedger.filter((item) =>
            !["ACQUISITION", "SERVICE", "SHIPMENT"].includes(normalized(item.type))),
    };
    const paymentStatus = (items: Array<Record<string, unknown>>): PriceLedgerItem["status"] => {
        if (!items.length) return "NONE";
        return items.every((item) => ["PAID", "COLLECTED"].includes(normalized(item.status)))
            ? "PAID"
            : "UNPAID";
    };
    const linkedServiceIssueIds = new Set(
        paymentGroups.service.map((item) => stringValue(item.technicalIssueId)).filter(Boolean),
    );
    const linkedServiceRequestIds = new Set(
        paymentGroups.service.map((item) => stringValue(item.serviceRequestId)).filter(Boolean),
    );
    const linkedShipmentIds = new Set(
        paymentGroups.shipment.map((item) => stringValue(item.shipmentId)).filter(Boolean),
    );
    const uncoveredServiceFees = serviceFees.filter(
        (item) =>
            !linkedServiceIssueIds.has(stringValue(item.id)) &&
            !linkedServiceRequestIds.has(stringValue(item.serviceRequestId)),
    );
    const uncoveredShipmentFees = shipmentFees.filter(
        (item) => !linkedShipmentIds.has(stringValue(item.id)),
    );
    const acquisitionLedgerAmount = numberValue(costSummary?.acquisitionAmount);
    const serviceLedgerAmount = numberValue(costSummary?.serviceAmount);
    const shipmentLedgerAmount = numberValue(costSummary?.shipmentAmount);
    const otherLedgerAmount = numberValue(costSummary?.otherAmount);
    const landedCost = numberValue(costSummary?.landedCost);
    const salePrice = values.pricing.salePrice;
    const profit = Number(salePrice || 0) - Number(landedCost || 0);
    const ledgerItems: PriceLedgerItem[] = [
        {
            label: "Acquisition payment OUT",
            description: stringValue(acquisition.code)
                ? `${stringValue(acquisition.code)} · ${stringValue(acquisition.vendorName) || "Vendor"}`
                : "Chi phí nhập từ phiếu nhập",
            amount: acquisitionLedgerAmount || null,
            status: paymentGroups.acquisition.length
                ? paymentStatus(paymentGroups.acquisition)
                : acquisitionLedgerAmount
                  ? "PAID"
                  : "NONE",
        },
        {
            label: "Service payment OUT",
            description: `${serviceFees.length} TI · ${paymentGroups.service.length} payment OUT`,
            amount: serviceLedgerAmount || null,
            status: uncoveredServiceFees.some((item) => numberValue(item.amount) > 0)
                ? "UNPAID"
                : paymentStatus(paymentGroups.service),
        },
        {
            label: "Shipment / logistics OUT",
            description: `${shipmentFees.length} shipment · ${paymentGroups.shipment.length} payment OUT`,
            amount: shipmentLedgerAmount || null,
            status: uncoveredShipmentFees.some((item) => numberValue(item.amount) > 0)
                ? "UNPAID"
                : paymentStatus(paymentGroups.shipment),
        },
        {
            label: "Other costs / fees OUT",
            description: `${paymentGroups.other.length} payment OUT khác liên kết với watch`,
            amount: otherLedgerAmount || null,
            status: paymentStatus(paymentGroups.other),
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
                    <button type="button" disabled title="Tinh nang nay chua san sang tren Watch Workbench." className={operationButtonClass({ variant: "softAmber", size: "sm", className: "disabled:opacity-60" })}>
                        Phụ phí/chi phí
                    </button>
                    <button type="button" onClick={onSave} disabled={saving} className={operationButtonClass({ variant: "primary", size: "sm", className: "disabled:opacity-70" })}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Lưu thay đổi
                    </button>
                </>
            }
        >
            <div className="grid gap-4 xl:grid-cols-[minmax(260px,0.54fr)_minmax(0,1fr)]">
                <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50/65 via-white to-emerald-50/45 p-4">
                    <div className="text-[11px] font-semibold uppercase text-blue-600">Suggested listing price</div>
                    <div className="mt-2 text-[30px] font-semibold leading-9 text-slate-950">
                        {salePrice ? moneyText(salePrice) : maskMoney(permissions.canViewSensitivePrice, landedCost)} VND
                    </div>
                    <div className="mt-2 text-xs leading-5 text-slate-500">Giá bán có thể hiển thị, cost/margin/payment OUT chỉ mở cho admin.</div>
                    <div className="mt-9 grid grid-cols-2 gap-3">
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

            <div className="mt-4 flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs leading-5 text-amber-800 md:flex-row md:items-center md:justify-between">
                <div>
                    <b>Projection advice:</b> cost ledger cần financial rollup từ payment OUT service/shipment/acquisition. UI này không tự ghi projection, chỉ emit event/domain save.
                </div>
                <button type="button" disabled title="Projection đang nằm ở feed bên cạnh; nút chi tiết sẽ được nối sau." className={operationButtonClass({ variant: "softAmber", size: "xs", className: "bg-white text-amber-800 disabled:opacity-60" })}>
                    <Wand2 className="h-4 w-4" />
                    Xem projection
                </button>
            </div>
        </OperationShell>
    );
}
