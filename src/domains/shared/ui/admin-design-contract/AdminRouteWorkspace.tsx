"use client";

import { useId, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Package, Link2, BarChart3, ChartNoAxesCombined, Tags, ShoppingBag, BellRing, Activity } from "lucide-react";
import { AdminWorkspaceFilterProvider, AdminWorkspaceFilterTarget } from "./AdminWorkspaceFilters";
import { AdminButton } from "./AdminButton";
import { AdminManagementPage } from "./AdminManagement";
import { AdminWorkspaceNavigation } from "./AdminWorkspaceNavigation";
import { ADMIN_SPLIT_WORKSPACE as split, ADMIN_SPLIT_WORKSPACE_STYLE, useAdminSplitWorkspace } from "./AdminSplitWorkspace";
import { ADMIN_SPLIT_RESIZE as resize, useAdminSplitResize } from "./AdminSplitResize";

export type AdminRouteEntry = { href: string; label: string };
const icons = { "/admin/system/channels": BellRing, "/admin/activity": Activity, "/admin/watches": Package, "/admin/straps": Link2, "/admin/reports/overview": BarChart3, "/admin/reports/finance": BarChart3, "/admin/reports/sales": ChartNoAxesCombined, "/admin/acquisitions": Tags, "/admin/orders": ShoppingBag };

/** Presentation only: callers retain permission policy, URLs and domain state. */
export function AdminRouteWorkspace({ title, description, navigationLabel, storageKey, entries, selected, extraNavigation, selectedNavigation, filtersUnderSelected = false, children }: {
  title: string; description?: string; navigationLabel: string; storageKey: string;
  entries: AdminRouteEntry[]; selected: string; extraNavigation?: ReactNode; selectedNavigation?: ReactNode; filtersUnderSelected?: boolean; children: ReactNode;
}) {
  const ref = useAdminSplitWorkspace<HTMLDivElement>();
  const pane = useAdminSplitResize(ref, storageKey);
  const id = useId();
  return <AdminWorkspaceFilterProvider><AdminManagementPage title={title} description={description}>
    <div ref={ref} className={`${split.layout} ${resize.layout}`} data-has-pane-toggle="true" data-sidebar-collapsed={pane.width === 0} data-resizing={pane.resizing} style={{ ...ADMIN_SPLIT_WORKSPACE_STYLE, ...pane.style }}>
      {pane.wide && <div className={resize.toggleRail}><AdminButton variant="quiet" iconOnly className={resize.toggleButton} type="button" aria-controls={id} aria-expanded={pane.width !== 0} aria-label={pane.width === 0 ? `Mở menu ${navigationLabel.toLocaleLowerCase("vi-VN")}` : `Thu menu ${navigationLabel.toLocaleLowerCase("vi-VN")}`} title={pane.width === 0 ? "Mở menu · giữ nguyên bộ lọc và trang" : "Thu menu để xem danh sách rộng hơn"} onClick={pane.toggle}>{pane.width === 0 ? <ChevronRight aria-hidden="true" size={16} /> : <ChevronLeft aria-hidden="true" size={16} />}</AdminButton></div>}
      <aside id={id} data-admin-pane="sidebar" className="space-y-6">
        <AdminWorkspaceNavigation label={navigationLabel} entries={entries.map(entry => {
          const Icon = icons[entry.href as keyof typeof icons];
          return { ...entry, icon: Icon ? <Icon /> : undefined };
        })} selected={selected} selectedNavigation={filtersUnderSelected ? <>{selectedNavigation}<AdminWorkspaceFilterTarget /></> : selectedNavigation} nestedWide={pane.wide} />
        {extraNavigation}
        {!filtersUnderSelected && <AdminWorkspaceFilterTarget />}
      </aside>
      <div {...pane.separatorProps} aria-label={`Điều chỉnh độ rộng menu ${title.toLocaleLowerCase("vi-VN")}`} aria-controls={id} className={resize.separator} />
      <div data-admin-pane="content">{children}</div>
    </div>
  </AdminManagementPage></AdminWorkspaceFilterProvider>;
}
