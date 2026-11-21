"use client";

import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import styles from "@/domains/shared/ui/admin-design-contract/AdminBusinessTable.module.css";

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
    <div className={styles.bulk}>
      <div className="text-xs text-slate-500">
        Đang chọn{" "}
        <span className="font-semibold text-slate-950">{selectedCount}</span>{" "}
        đơn nháp có thể post.
      </div>

      <div className="flex items-center gap-2">
        <AdminButton variant="primary" density="compact" type="button" onClick={onBulkPost}>
          Post các đơn đã chọn
        </AdminButton>

        <AdminButton type="button" variant="quiet" density="compact" onClick={onClearSelection}>
          Bỏ chọn
        </AdminButton>
      </div>
    </div>
  );
}
