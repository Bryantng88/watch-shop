// order/ui/form/OrderShipmentSection.tsx

"use client";

import { Plus, Truck, X } from "lucide-react";

import { Button, Input } from "@/domains/shared/ui/form/fields";
import { SectionCard } from "@/domains/shared/ui/surface/card";

import OrderFormField from "./OrderFormField";
import type { OrderFormValues } from "./types";

type Props = {
    values: OrderFormValues;
    disabled?: boolean;
    onChange: (patch: Partial<OrderFormValues>) => void;
};

export default function OrderShipmentSection({
    values,
    disabled,
    onChange,
}: Props) {
    return (
        <SectionCard
            icon={<Truck className="h-5 w-5" />}
            title="Giao hàng"
            subtitle={
                values.hasShipment
                    ? "Đơn có vận chuyển."
                    : "Bật khi đơn cần giao hàng."
            }
        >
            <div className="space-y-4">
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant={values.hasShipment ? "outline" : "default"}
                        onClick={() => onChange({ hasShipment: !values.hasShipment })}
                        disabled={disabled}
                    >
                        {values.hasShipment ? (
                            <X className="mr-2 h-4 w-4" />
                        ) : (
                            <Plus className="mr-2 h-4 w-4" />
                        )}
                        {values.hasShipment ? "Bỏ giao hàng" : "Có giao hàng"}
                    </Button>
                </div>

                {values.hasShipment ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <OrderFormField label="Địa chỉ">
                            <Input
                                value={values.shipAddress}
                                onChange={(event) =>
                                    onChange({ shipAddress: event.target.value })
                                }
                                disabled={disabled}
                            />
                        </OrderFormField>

                        <OrderFormField label="Tỉnh / thành">
                            <Input
                                value={values.shipCity}
                                onChange={(event) =>
                                    onChange({ shipCity: event.target.value })
                                }
                                disabled={disabled}
                            />
                        </OrderFormField>

                        <OrderFormField label="Quận / huyện">
                            <Input
                                value={values.shipDistrict}
                                onChange={(event) =>
                                    onChange({ shipDistrict: event.target.value })
                                }
                                disabled={disabled}
                            />
                        </OrderFormField>

                        <OrderFormField label="Phường / xã">
                            <Input
                                value={values.shipWard}
                                onChange={(event) =>
                                    onChange({ shipWard: event.target.value })
                                }
                                disabled={disabled}
                            />
                        </OrderFormField>
                    </div>
                ) : null}
            </div>
        </SectionCard>
    );
}