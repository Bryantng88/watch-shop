"use client";

import { Calculator, ChevronDown, Loader2 } from "lucide-react";
import type { WatchWorkbenchPermissions, WatchWorkbenchValues } from "@/domains/watch/client/workbench/types";
import { maskMoney, moneyText, onlyMoney, updateValues } from "@/domains/watch/client/workbench/workbench-utils";
import { Field, inputClass, OperationShell, operationButtonClass } from "../shared/OperationShell";
import PriceLedgerTable, { PriceLedgerItem } from "./PriceLedgerTable";
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

function FinancialMetric({
    label,
    value,
    note,
    tone,
}: {
    label: string;
    value: string;
    note: string;
    tone: "slate" | "emerald" | "rose";
}) {
    const styles = {
        slate: "text-slate-950",
        emerald: "text-emerald-700",
        rose: "text-rose-600",
    }[tone];
    return (
        <div className={`min-w-0 px-4 py-4 ${styles}`}>
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</div>
            <div className="mt-2 truncate text-xl font-bold tracking-[-0.03em]">{value}</div>
            <div className="mt-1 text-[11px] text-slate-400">{note}</div>
        </div>
    );
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
    const margin = Number(salePrice || 0) > 0
        ? profit / Number(salePrice) * 100
        : 0;
    const ledgerItems: PriceLedgerItem[] = [
        {
            label: "Giá nhập",
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
            label: "Chi phí service",
            description: `${serviceFees.length} TI · ${paymentGroups.service.length} payment OUT`,
            amount: serviceLedgerAmount || null,
            status: uncoveredServiceFees.some((item) => numberValue(item.amount) > 0)
                ? "UNPAID"
                : paymentStatus(paymentGroups.service),
        },
        {
            label: "Vận chuyển / logistics",
            description: `${shipmentFees.length} shipment · ${paymentGroups.shipment.length} payment OUT`,
            amount: shipmentLedgerAmount || null,
            status: uncoveredShipmentFees.some((item) => numberValue(item.amount) > 0)
                ? "UNPAID"
                : paymentStatus(paymentGroups.shipment),
        },
        {
            label: "Chi phí khác",
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
            title="Giá & lợi nhuận"
            icon={<Calculator className="h-4 w-4" />}
            description="Giá bán, giá vốn và lợi nhuận trong một financial view thống nhất."
            actions={
                <button type="button" onClick={onSave} disabled={saving} className={operationButtonClass({ variant: "primary", size: "sm", className: "disabled:opacity-70" })}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Lưu giá bán
                </button>
            }
        >
            <div className="grid gap-3 xl:grid-cols-[minmax(250px,0.85fr)_minmax(0,1.5fr)]">
                <div className="relative overflow-hidden rounded-lg border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50/70 p-5">
                    <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-violet-500 to-indigo-500" />
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-violet-600">Giá bán hiện tại</div>
                    <div className="mt-3 text-[30px] font-bold tracking-[-0.045em] text-slate-950">
                        {salePrice ? moneyText(salePrice) : "0"} ₫
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Giá đang áp dụng cho Watch</div>
                </div>
                <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-slate-50/70 sm:grid-cols-3 sm:divide-x sm:divide-slate-200">
                    <FinancialMetric label="Tổng giá vốn" value={maskMoney(permissions.canViewSensitivePrice, landedCost)} note="Đọc từ cost ledger" tone="slate" />
                    <FinancialMetric label="Lợi nhuận" value={maskMoney(permissions.canViewSensitivePrice, profit)} note="Giá bán − giá vốn" tone={profit < 0 ? "rose" : "emerald"} />
                    <FinancialMetric label="Biên lợi nhuận" value={permissions.canViewSensitivePrice ? `${margin.toFixed(1)}%` : "••••••"} note="Theo giá bán" tone={margin < 0 ? "rose" : "emerald"} />
                </div>
            </div>
            {!permissions.canViewSensitivePrice ? <div className="mt-3"><PricePermissionNotice /></div> : null}

            <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                    <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Cấu thành giá vốn</div>
                    <div className="text-[10px] text-slate-400">Dữ liệu projection · chỉ đọc</div>
                </div>
                <PriceLedgerTable items={ledgerItems} canViewSensitivePrice={permissions.canViewSensitivePrice} />
            </div>

            <details className="group mt-4 rounded-lg border border-slate-200 bg-slate-50/70">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-bold text-slate-600">
                    Điều chỉnh giá và dữ liệu thủ công
                    <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <div className="grid gap-3 border-t border-slate-200 bg-white p-4 md:grid-cols-4">
                    <Field label="Giá vốn thủ công">
                        <input className={inputClass} value={permissions.canViewSensitivePrice ? values.pricing.costPrice : "••••••"} disabled={!permissions.canEditPrice} onChange={(event) => setPricing({ costPrice: onlyMoney(event.target.value) })} />
                    </Field>
                    <Field label="Service rate">
                        <input className={inputClass} value={permissions.canViewSensitivePrice ? values.pricing.serviceCost : "••••••"} disabled={!permissions.canEditPrice} onChange={(event) => setPricing({ serviceCost: onlyMoney(event.target.value) })} />
                    </Field>
                    <Field label="Lợi nhuận">
                        <input className={inputClass} value={permissions.canViewSensitivePrice ? moneyText(profit) : "••••••"} disabled />
                    </Field>
                    <Field label="Giá bán">
                        <input className={inputClass} value={values.pricing.salePrice} disabled={!permissions.canEditPrice} placeholder="Nhập giá bán" onChange={(event) => setPricing({ salePrice: onlyMoney(event.target.value) })} />
                    </Field>
                </div>
            </details>
        </OperationShell>
    );
}
