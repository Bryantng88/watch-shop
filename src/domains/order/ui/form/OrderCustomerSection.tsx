"use client";

import { UserRound } from "lucide-react";

import { Input, Select } from "@/domains/shared/ui/form/fields";
import { SectionCard } from "@/domains/shared/ui/surface/card";

import OrderFormField from "./OrderFormField";
import { PAYMENT_METHOD_OPTIONS, RESERVE_TYPE_OPTIONS, numberValue } from "./helpers";
import type { OrderFormValues } from "./types";

type Props = {
    values: OrderFormValues;
    disabled?: boolean;
    onChange: (patch: Partial<OrderFormValues>) => void;
};

export default function OrderCustomerSection({
    values,
    disabled,
    onChange,
}: Props) {
    return (
        <SectionCard
            icon={<UserRound className="h-5 w-5" />}
            title="Khách hàng"
            subtitle="Thông tin khách, thanh toán và giữ hàng."
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <OrderFormField label="Tên khách hàng">
                    <Input
                        value={values.customerName}
                        onChange={(event) =>
                            onChange({ customerName: event.target.value })
                        }
                        disabled={disabled}
                    />
                </OrderFormField>

                <OrderFormField label="Số điện thoại">
                    <Input
                        value={values.shipPhone}
                        onChange={(event) =>
                            onChange({ shipPhone: event.target.value })
                        }
                        disabled={disabled}
                    />
                </OrderFormField>

                <OrderFormField label="Phương thức thanh toán">
                    <Select
                        value={values.paymentMethod}
                        onChange={(event) =>
                            onChange({ paymentMethod: event.target.value })
                        }
                        disabled={disabled}
                        options={PAYMENT_METHOD_OPTIONS}
                    />
                </OrderFormField>

                <OrderFormField label="Loại giữ hàng">
                    <Select
                        value={values.reserveType}
                        onChange={(event) =>
                            onChange({ reserveType: event.target.value })
                        }
                        disabled={disabled}
                        placeholder="Không giữ hàng"
                        options={RESERVE_TYPE_OPTIONS}
                    />
                </OrderFormField>

                {values.reserveType ? (
                    <OrderFormField label="Số tiền cọc">
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

                {values.reserveType ? (
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
