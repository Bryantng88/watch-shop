"use client";
import { Textarea } from "@/domains/shared/ui/form/fields";

export default function OrderNotesSection({ value, disabled, onChange }: { value: string; disabled?: boolean; onChange: (value: string) => void }) {
  return <Textarea aria-label="Ghi chú nội bộ" value={value} disabled={disabled} onChange={event => onChange(event.target.value)} rows={2} className="mt-2 !min-h-16" placeholder="Ghi chú cho đơn hàng..." />;
}
