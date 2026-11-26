"use client";
import { useEffect } from "react";
import { AdminAnchorAction } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { notifyParentOfWorkspaceRefresh } from "@/domains/shared/ui/transitions/workspace-transition-outcome";

export function RetiredMediaWorkspace() {
  useEffect(() => {
    if (window.parent === window) return;
    notifyParentOfWorkspaceRefresh();
    window.parent.postMessage({ type: "workspace-target-modal-close" }, window.location.origin);
  }, []);
  return <div className="space-y-3 p-4" role="status">
    <p>Watch đã rời quy trình media này. Ảnh và nội dung đã lưu vẫn được giữ.</p>
    <AdminAnchorAction variant="quiet" href="/admin/coordination/media">Về danh sách media</AdminAnchorAction>
  </div>;
}
