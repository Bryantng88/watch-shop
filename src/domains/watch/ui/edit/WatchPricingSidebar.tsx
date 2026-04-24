"use client";

import { Tag } from "lucide-react";
import {
    FieldLabel,
    Input,
    SectionCard,
    SidebarStat,
    Textarea,
    moneyPreview,
} from "./shared";
import type { WatchFormValues } from "../../client/form/watch-form.types";

type Props = {
    values: WatchFormValues["pricing"];
    canViewCost: boolean;
    onChange: (patch: Partial<WatchFormValues["pricing"]>) => void;
    canEditPrice: boolean;
};

function onlyMoney(value: string) {
    return value.replace(/[^\d]/g, "");
}

function calcGrossProfit(values: WatchFormValues["pricing"]) {
    const sale = Number(values.salePrice || 0);
    const landed = Number(values.landedCost || 0);
    const cost = Number(values.costPrice || 0);
    const service = Number(values.serviceCost || 0);

    const baseCost = landed > 0 ? landed : cost + service;
    const profit = sale - baseCost;

    return profit > 0 ? String(profit) : "";
}
function LockedHint() {
    return (
        <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-500 ring-1 ring-inset ring-slate-200">
            Chỉ Admin mới được chỉnh giá.
        </div>
    );
}
export default function WatchPricingSidebar({
    values,
    canViewCost,
    onChange,
    canEditPrice,
}: Props) {
    const grossProfit = calcGrossProfit(values);

    return (
        <SectionCard
            icon={<Tag className="h-5 w-5" />}
            title="Pricing"
            subtitle="Giá bán, giá sàn và chi phí vận hành."
        >
            <div className="space-y-5">
                <div className="grid grid-cols-1 gap-3">
                    <SidebarStat
                        label="Giá bán hiện tại"
                        value={moneyPreview(values.salePrice)}
                        emphasize
                    />

                    {canViewCost ? (
                        <SidebarStat
                            label="Lãi gộp tạm tính"
                            value={grossProfit ? moneyPreview(grossProfit) : "-"}
                        />
                    ) : null}
                    {!canEditPrice ? <LockedHint /> : null}
                </div>

                <div>
                    <FieldLabel>Giá bán</FieldLabel>
                    <Input
                        inputMode="numeric"
                        value={values.salePrice}
                        onChange={(e) =>
                            onChange({ salePrice: onlyMoney(e.target.value) })
                        }
                        placeholder="VD: 18500000"
                        disabled={!canEditPrice}
                    />
                </div>

                <div>
                    <FieldLabel>Giá sàn</FieldLabel>
                    <Input
                        inputMode="numeric"
                        value={values.minPrice}
                        onChange={(e) =>
                            onChange({ minPrice: onlyMoney(e.target.value) })
                        }
                        placeholder="Mức thấp nhất có thể chốt"
                        disabled={!canEditPrice}
                    />
                </div>

                {canViewCost ? (
                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                        <div className="mb-4 text-sm font-semibold text-slate-900">
                            Chi phí nội bộ
                        </div>

                        <div className="space-y-4">
                            <div>
                                <FieldLabel>Giá mua</FieldLabel>
                                <Input
                                    inputMode="numeric"
                                    value={values.costPrice}
                                    onChange={(e) =>
                                        onChange({
                                            costPrice: onlyMoney(e.target.value),
                                        })
                                    }
                                    placeholder="Giá nhập"
                                />
                            </div>

                            <div>
                                <FieldLabel>Chi phí service</FieldLabel>
                                <Input
                                    inputMode="numeric"
                                    value={values.serviceCost}
                                    onChange={(e) =>
                                        onChange({
                                            serviceCost: onlyMoney(e.target.value),
                                        })
                                    }
                                    placeholder="Chi phí bảo dưỡng/sửa chữa"
                                />
                            </div>

                            <div>
                                <FieldLabel>Landed cost</FieldLabel>
                                <Input
                                    inputMode="numeric"
                                    value={values.landedCost}
                                    onChange={(e) =>
                                        onChange({
                                            landedCost: onlyMoney(e.target.value),
                                        })
                                    }
                                    placeholder="Tổng vốn thực tế nếu có"
                                />
                            </div>
                        </div>
                    </div>
                ) : null}

                <div>
                    <FieldLabel>Pricing note</FieldLabel>
                    <Textarea
                        rows={4}
                        value={values.pricingNote}
                        disabled={!canEditPrice}
                        onChange={(e) =>
                            onChange({ pricingNote: e.target.value })
                        }
                        placeholder="Ghi chú deal, biên giá, lý do giá sàn..."
                    />
                </div>
            </div>
        </SectionCard>
    );
}