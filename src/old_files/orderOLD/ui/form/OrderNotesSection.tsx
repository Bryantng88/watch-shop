"use client";

import { Wallet } from "lucide-react";

import { Textarea } from "@/domains/shared/ui/form/fields";
import { SectionCard } from "@/domains/shared/ui/surface/card";

type Props = {
    value: string;
    disabled?: boolean;
    onChange: (value: string) => void;
};

export default function OrderNotesSection({ value, disabled, onChange }: Props) {
    return (
        <SectionCard
            icon={<Wallet className="h-5 w-5" />}
            title="Ghi chú"
            subtitle="Thông tin nội bộ."
        >
            <Textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                placeholder="Ghi chú cho đơn hàng..."
            />
        </SectionCard>
    );
}
