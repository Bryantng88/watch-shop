"use client";

import { useId, type ReactNode } from "react";
import { UsersRound, ContactRound, Store } from "lucide-react";
import { AdminManagementPage, ADMIN_MANAGEMENT as management } from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import { ADMIN_SPLIT_WORKSPACE as s, ADMIN_SPLIT_WORKSPACE_STYLE, useAdminSplitWorkspace } from "@/domains/shared/ui/admin-design-contract/AdminSplitWorkspace";
import { AdminWorkspaceNavigation } from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceNavigation";
import { ADMIN_SPLIT_RESIZE as resize, useAdminSplitResize } from "@/domains/shared/ui/admin-design-contract/AdminSplitResize";
import type { DirectoryEntry } from "../shared/directory-navigation";

export default function DirectoryWorkspace({ entries, selected, children }: { entries: DirectoryEntry[]; selected: string; children: ReactNode }) {
  const ref = useAdminSplitWorkspace<HTMLDivElement>();
  const pane = useAdminSplitResize(ref, "admin:directory:menu-width:v1");
  const navigationId = useId();
  const icons: Record<string, ReactNode> = {
    "/admin/users": <UsersRound strokeWidth={1.75} />,
    "/admin/customers": <ContactRound strokeWidth={1.75} />,
    "/admin/vendors": <Store strokeWidth={1.75} />,
  };
  return <AdminManagementPage title="Danh bạ" description="Tra cứu và quản lý thông tin người dùng, khách hàng, nhà cung cấp.">
    <div ref={ref} className={`${s.layout} ${resize.layout}`} data-sidebar-collapsed={pane.width === 0} data-resizing={pane.resizing} style={{ ...ADMIN_SPLIT_WORKSPACE_STYLE, ...pane.style }}>
      <aside id={navigationId} data-admin-pane="sidebar"><AdminWorkspaceNavigation label="Nhóm liên hệ" entries={entries.map(entry => ({ ...entry, icon: icons[entry.href] }))} selected={selected} /></aside>
      <div {...pane.separatorProps} aria-label="Điều chỉnh độ rộng menu danh bạ" aria-controls={navigationId} className={resize.separator} />
      <div data-admin-pane="content" className={management.directoryPanel}>{children}</div>
    </div>
  </AdminManagementPage>;
}
