"use client";
import { useRef, useState } from "react";
import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useAppDialog } from "@/domains/shared/feedback/AppDialogProvider";
import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { withdrawMediaQueueWatchAction } from "@/domains/watch/client/media-work/watch-media-work.actions";
import { waitForProjectionDelivery } from "@/domains/projection/client/projection-delivery.client";

type Item = { id: string; targetType: string; preview: { title: string | null } };
export function WithdrawMediaSelectionButton({ items, disabled, onPendingChange, onWithdrawn, onError, onReload }: {
  items: Item[]; disabled?: boolean; onPendingChange: (pending: boolean) => void;
  onWithdrawn: (ids: string[]) => void; onError: (message: string | null) => void;
  onReload?: () => void | Promise<void>;
}) {
  const dialog = useAppDialog(), notify = useNotify(), inFlight = useRef(false);
  const [pending, setPending] = useState(false);
  if (!items.length || items.some(item => item.targetType !== "WATCH")) return null;
  async function withdraw() {
    if (inFlight.current || disabled) return;
    inFlight.current = true;
    const selection = [...items];
    try {
      if (!await dialog.confirm({ title: "Bỏ watch khỏi quy trình media?", message: `Bỏ ${selection.length} watch đã chọn khỏi hàng chụp ảnh, xử lý và xuất bản. Ảnh, cover và nội dung đã lưu vẫn được giữ.`, confirmText: "Bỏ khỏi quy trình", cancelText: "Giữ lại", tone: "warning" })) return;
      setPending(true); onPendingChange(true); onError(null);
      const succeeded: string[] = [], failed: string[] = [];
      let delayed = false;
      for (const item of selection) {
        try {
          const result = await withdrawMediaQueueWatchAction({ bindingId: item.id });
          succeeded.push(item.id);
          if (result.event) {
            try { await waitForProjectionDelivery(result); } catch { delayed = true; }
          }
        } catch { failed.push(item.preview.title || item.id); }
      }
      if (succeeded.length) {
        onWithdrawn(succeeded);
        notify.success({ title: `Đã bỏ ${succeeded.length} watch khỏi quy trình media`, message: delayed ? "Thay đổi đã lưu; danh sách đang đồng bộ." : "Ảnh và nội dung đã lưu được giữ nguyên." });
      }
      if (failed.length) onError(`Chưa bỏ được: ${failed.join(", ")}. Bạn có thể thử lại các watch này.`);
      await onReload?.();
    } catch {
      onError("Chưa tải lại được danh sách. Vui lòng tải lại trang để kiểm tra kết quả.");
    } finally { inFlight.current = false; setPending(false); onPendingChange(false); }
  }
  return <AdminButton variant="quiet" density="compact" type="button" disabled={disabled || pending} onClick={withdraw}>
    {pending ? "Đang bỏ khỏi quy trình…" : "Bỏ khỏi quy trình media"}
  </AdminButton>;
}
