"use client";

import type { ReactNode } from "react";
import { AdminManagementPage } from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import { ADMIN_SPLIT_WORKSPACE as s, ADMIN_SPLIT_WORKSPACE_STYLE, useAdminSplitWorkspace } from "@/domains/shared/ui/admin-design-contract/AdminSplitWorkspace";
import { AdminWorkspaceNavigation } from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceNavigation";
import type { DirectoryEntry } from "../shared/directory-navigation";

export default function DirectoryWorkspace({ entries, selected, children }: { entries: DirectoryEntry[]; selected: string; children: ReactNode }) {
  const ref = useAdminSplitWorkspace<HTMLDivElement>();
  return <AdminManagementPage title="Danh bạ" description="Tra cứu và quản lý thông tin người dùng, khách hàng, nhà cung cấp.">
    <div ref={ref} className={s.layout} style={ADMIN_SPLIT_WORKSPACE_STYLE}>
      <aside data-admin-pane="sidebar"><AdminWorkspaceNavigation label="Nhóm liên hệ" entries={entries} selected={selected} /></aside>
      <div data-admin-pane="content">{children}</div>
    </div>
  </AdminManagementPage>;
}
