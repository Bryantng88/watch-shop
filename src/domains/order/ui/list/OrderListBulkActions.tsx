"use client";

import { Button } from "@/domains/shared/ui/form/fields";

type Props = {
  selectedCount: number;
  onBulkPost: () => void;
  onClearSelection: () => void;
};

export default function OrderListBulkActions({
  selectedCount,
  onBulkPost,
  onClearSelection,
}: Props) {
  if (!selectedCount) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="text-sm text-slate-600">
        Đang chọn{" "}
        <span className="font-semibold text-slate-950">{selectedCount}</span>{" "}
        đơn nháp có thể post.
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" onClick={onBulkPost}>
          Post các đơn đã chọn
        </Button>

        <Button type="button" variant="outline" onClick={onClearSelection}>
          Bỏ chọn
        </Button>
      </div>
    </div>
  );
}
