"use client";

import { ImageIcon, Trash2 } from "lucide-react";

import { Input, Textarea } from "@/domains/shared/ui/form/fields";
import { fmtMoney } from "@/domains/order/ui/order-ui.helpers";

import OrderFormField from "./OrderFormField";
import { numberValue } from "./helpers";
import type { OrderFormItem } from "./types";

type Props = {
    item: OrderFormItem;
    disabled?: boolean;
    onChange: (patch: Partial<OrderFormItem>) => void;
    onRemove: () => void;
};

function sourceLabel(item: OrderFormItem) {
    if (item.kind === "SERVICE") return "SERVICE";
    if (item.source === "WATCH_QUICK_ORDER") return "WATCH";
    return "PRODUCT";
}

function sourceClass(item: OrderFormItem) {
    if (item.kind === "SERVICE") return "bg-violet-50 text-violet-700 ring-violet-200";
    if (item.source === "WATCH_QUICK_ORDER") {
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }
    return "bg-slate-100 text-slate-700 ring-slate-200";
}

export default function OrderItemCard({
    item,
    disabled,
    onChange,
    onRemove,
}: Props) {
    const isWatchItem = item.kind === "PRODUCT" && item.source === "WATCH_QUICK_ORDER";

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                {item.kind === "PRODUCT" ? (
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        {item.img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={item.img}
                                alt={item.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-300">
                                <ImageIcon className="h-6 w-6" />
                            </div>
                        )}
                    </div>
                ) : null}

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={[
                                "w-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                                sourceClass(item),
                            ].join(" ")}
                        >
                            {sourceLabel(item)}
                        </span>

                        {item.productStatus ? (
                            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                                {item.productStatus}
                            </span>
                        ) : null}

                        {item.availabilityStatus ? (
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                                {item.availabilityStatus}
                            </span>
                        ) : null}
                    </div>

                    <Input
                        className="mt-2 font-semibold"
                        value={item.title}
                        onChange={(event) => onChange({ title: event.target.value })}
                        disabled={disabled || item.kind === "PRODUCT"}
                    />

                    {item.kind === "PRODUCT" ? (
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span>SKU: {item.sku || "-"}</span>
                            {item.source === "WATCH_QUICK_ORDER" ? (
                                <span>Quick order từ watch</span>
                            ) : null}
                        </div>
                    ) : null}
                </div>

                <button
                    type="button"
                    disabled={disabled}
                    onClick={onRemove}
                    className="rounded-xl p-2 text-rose-500 hover:bg-rose-50 disabled:opacity-40"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className={["mt-4 grid grid-cols-1 gap-4", isWatchItem ? "md:grid-cols-2" : "md:grid-cols-3"].join(" ")}>
                {!isWatchItem ? (
                    <OrderFormField label="Số lượng">
                        <Input
                            inputMode="numeric"
                            value={String(item.quantity)}
                            onChange={(event) =>
                                onChange({ quantity: numberValue(event.target.value) || 1 })
                            }
                            disabled={disabled}
                        />
                    </OrderFormField>
                ) : null}

                <OrderFormField label="Giá niêm yết">
                    <Input
                        inputMode="numeric"
                        value={String(item.listPrice)}
                        onChange={(event) =>
                            onChange({ listPrice: numberValue(event.target.value) })
                        }
                        disabled={disabled}
                    />
                    <div className="mt-1 text-xs text-slate-400">
                        {fmtMoney(item.listPrice)}
                    </div>
                </OrderFormField>

                <OrderFormField label="Giá chốt">
                    <Input
                        inputMode="numeric"
                        value={String(item.unitPriceAgreed)}
                        onChange={(event) =>
                            onChange({ unitPriceAgreed: numberValue(event.target.value) })
                        }
                        disabled={disabled}
                    />
                    <div className="mt-1 text-xs text-slate-400">
                        {fmtMoney(item.unitPriceAgreed)}
                    </div>
                </OrderFormField>
            </div>

            {item.kind === "SERVICE" ? (
                <div className="mt-4">
                    <OrderFormField label="Ghi chú dịch vụ">
                        <Textarea
                            value={item.customerItemNote ?? ""}
                            onChange={(event) =>
                                onChange({ customerItemNote: event.target.value })
                            }
                            disabled={disabled}
                        />
                    </OrderFormField>
                </div>
            ) : null}
        </div>
    );
}
