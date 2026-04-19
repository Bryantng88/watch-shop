"use client";

import { Tag } from "lucide-react";
import { FieldLabel, Input, SectionCard, SidebarStat, Textarea, moneyPreview } from "./shared";
import type { WatchFormValues } from "../../client/watch-form.types";

type Props = {
    values: WatchFormValues["pricing"];
    canViewCost: boolean;
    onChange: (patch: Partial<WatchFormValues["pricing"]>) => void;
};

export default function WatchPricingSidebar({
    values,
    canViewCost,
    onChange,
}: Props) {
    return (
        <SectionCard
            icon={<Tag className="h-5 w-5" />}
            title="Pricing"
            subtitle="Đưa sang cột phải để thao tác giá rõ hơn."
        >
            <div className="space-y-4">
                <SidebarStat
                    label="Giá bán"
                    value={moneyPreview(values.salePrice)}
                    emphasize
                />

                <div>
                    <FieldLabel>Sale price</FieldLabel>
                    <Input
                        value={values.salePrice}
                        onChange={(e) => onChange({ salePrice: e.target.value })}
                        placeholder="0"
                    />
                </div>

                <div>
                    <FieldLabel>List price</FieldLabel>
                    <Input
                        value={values.listPrice}
                        onChange={(e) => onChange({ listPrice: e.target.value })}
                        placeholder="0"
                    />
                </div>

                <div>
                    <FieldLabel>Min price</FieldLabel>
                    <Input
                        value={values.minPrice}
                        onChange={(e) => onChange({ minPrice: e.target.value })}
                        placeholder="0"
                    />
                </div>

                {canViewCost ? (
                    <>
                        <div>
                            <FieldLabel>Cost price</FieldLabel>
                            <Input
                                value={values.costPrice}
                                onChange={(e) => onChange({ costPrice: e.target.value })}
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <FieldLabel>Service cost</FieldLabel>
                            <Input
                                value={values.serviceCost}
                                onChange={(e) => onChange({ serviceCost: e.target.value })}
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <FieldLabel>Landed cost</FieldLabel>
                            <Input
                                value={values.landedCost}
                                onChange={(e) => onChange({ landedCost: e.target.value })}
                                placeholder="0"
                            />
                        </div>
                    </>
                ) : null}

                <div>
                    <FieldLabel>Pricing note</FieldLabel>
                    <Textarea
                        rows={4}
                        value={values.pricingNote}
                        onChange={(e) => onChange({ pricingNote: e.target.value })}
                        placeholder="Ghi chú pricing"
                    />
                </div>
            </div>
        </SectionCard>
    );
}