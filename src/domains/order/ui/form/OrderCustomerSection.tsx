// order/ui/form/OrderCustomerSection.tsx

"use client";

import { CheckCircle2, Loader2, UserRound } from "lucide-react";

import { Input, Select } from "@/domains/shared/ui/form/fields";
import { SectionCard } from "@/domains/shared/ui/surface/card";

import OrderFormField from "./OrderFormField";
import {
    PAYMENT_METHOD_OPTIONS,
    RESERVE_TYPE_OPTIONS,
    needsReserveAmount,
    normalizeOrderReserveType,
    numberValue,
} from "./helpers";
import type { CustomerSearchItem, OrderFormValues } from "./types";

type Props = {
    values: OrderFormValues;
    customers?: CustomerSearchItem[];
    searchingCustomer?: boolean;
    disabled?: boolean;
    onChange: (patch: Partial<OrderFormValues>) => void;
    onPickCustomer?: (customer: CustomerSearchItem) => void;
};

export default function OrderCustomerSection({
    values,
    customers = [],
    searchingCustomer,
    disabled,
    onChange,
    onPickCustomer,
}: Props) {
    const reserveType = normalizeOrderReserveType(values.reserveType);
    const showReserveAmount = needsReserveAmount(reserveType);
    const isCod = reserveType === "COD";

    return (
        <SectionCard
            icon={<UserRound className="h-5 w-5" />}
            title="Khách hàng & thanh toán"
            subtitle="Loại thanh toán quyết định flow vận hành: full, deposit hoặc COD."
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <OrderFormField label="Tên khách hàng">
                    <Input
                        value={values.customerName}
                        onChange={(event) =>
                            onChange({
                                customerId: null,
                                customerName: event.target.value,
                            })
                        }
                        disabled={disabled}
                    />
                </OrderFormField>

                <OrderFormField label="Số điện thoại">
                    <div className="relative">
                        <Input
                            value={values.shipPhone}
                            onChange={(event) =>
                                onChange({
                                    customerId: null,
                                    shipPhone: event.target.value,
                                })
                            }
                            disabled={disabled}
                        />

                        {searchingCustomer ? (
                            <Loader2 className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
                        ) : values.customerId ? (
                            <CheckCircle2 className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                        ) : null}
                    </div>
                </OrderFormField>

                {customers.length ? (
                    <div className="md:col-span-2">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Gợi ý khách cũ
                        </div>

                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {customers.map((customer) => (
                                <button
                                    key={customer.id}
                                    type="button"
                                    onClick={() => onPickCustomer?.(customer)}
                                    disabled={disabled}
                                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <div className="text-sm font-semibold text-slate-900">
                                        {customer.name}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        {customer.phone || "-"}
                                        {customer.address ? ` · ${customer.address}` : ""}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : null}

                <OrderFormField label="Loại thanh toán">
                    <Select
                        value={reserveType}
                        onChange={(event) => {
                            const nextType = normalizeOrderReserveType(event.target.value);

                            onChange({
                                reserveType: nextType,
                                reserveAmount: needsReserveAmount(nextType)
                                    ? values.reserveAmount
                                    : 0,
                                reserveExpiresAt: needsReserveAmount(nextType)
                                    ? values.reserveExpiresAt
                                    : "",
                                paymentMethod:
                                    nextType === "COD"
                                        ? "COD"
                                        : values.paymentMethod === "COD"
                                            ? "BANK_TRANSFER"
                                            : values.paymentMethod,
                                hasShipment: nextType === "COD" ? true : values.hasShipment,
                            });
                        }}
                        disabled={disabled}
                        options={RESERVE_TYPE_OPTIONS}
                    />
                </OrderFormField>

                <OrderFormField label={isCod ? "Phương thức nhận cọc" : "Phương thức thanh toán"}>
                    <Select
                        value={isCod ? "BANK_TRANSFER" : values.paymentMethod}
                        onChange={(event) =>
                            onChange({ paymentMethod: event.target.value })
                        }
                        disabled={disabled || isCod}
                        options={PAYMENT_METHOD_OPTIONS}
                    />
                </OrderFormField>

                {showReserveAmount ? (
                    <OrderFormField label={isCod ? "Tiền cọc COD" : "Số tiền cọc"}>
                        <Input
                            inputMode="numeric"
                            value={String(values.reserveAmount)}
                            onChange={(event) =>
                                onChange({
                                    reserveAmount: numberValue(event.target.value),
                                })
                            }
                            disabled={disabled}
                        />
                    </OrderFormField>
                ) : null}

                {showReserveAmount ? (
                    <OrderFormField label="Giữ đến">
                        <Input
                            type="datetime-local"
                            value={values.reserveExpiresAt}
                            onChange={(event) =>
                                onChange({ reserveExpiresAt: event.target.value })
                            }
                            disabled={disabled}
                        />
                    </OrderFormField>
                ) : null}
            </div>
        </SectionCard>
    );
}
