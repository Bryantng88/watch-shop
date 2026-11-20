"use client";

import { useId, type ReactNode } from "react";
import { Tags, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { AdminManagementPage } from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import { AdminWorkspaceNavigation } from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceNavigation";
import { ADMIN_SPLIT_WORKSPACE as split, ADMIN_SPLIT_WORKSPACE_STYLE, useAdminSplitWorkspace } from "@/domains/shared/ui/admin-design-contract/AdminSplitWorkspace";
import { ADMIN_SPLIT_RESIZE as resize, useAdminSplitResize } from "@/domains/shared/ui/admin-design-contract/AdminSplitResize";
import type { TradingEntry } from "../shared/trading-navigation";

const acquisitionStatuses = [["", "Tất cả"], ["DRAFT", "Nháp"], ["POSTED", "Đã nhập kho"], ["CANCELLED", "Đã hủy"]];
const orderStatuses = [["all", "Tất cả"], ["pending", "Chờ xác minh"], ["need_action", "Cần xử lý"], ["processing", "Đang xử lý"], ["returning", "Đang hoàn"], ["completed", "Hoàn tất"], ["returned", "Đã hoàn"], ["cancelled", "Đã hủy"]];

export default function TradingWorkspace({ entries, selected, children }: { entries: TradingEntry[]; selected: "/admin/acquisitions" | "/admin/orders"; children: ReactNode }) {
  const ref = useAdminSplitWorkspace<HTMLDivElement>();
  const pane = useAdminSplitResize(ref, "admin:trading:menu-width:v1");
  const id = useId();
  const params = useSearchParams();
  const orders = selected === "/admin/orders";
  const key = orders ? "view" : "status";
  const current = params.get(key) || (orders ? "all" : "");
  const statuses = orders ? orderStatuses : acquisitionStatuses;
  const href = (value: string) => {
    const next = new URLSearchParams(params.toString());
    next.delete("page");
    next.delete("focus");
    if (orders) next.delete("subFilter");
    if (value && value !== "all") next.set(key, value); else next.delete(key);
    const query = next.toString();
    return selected + (query ? `?${query}` : "");
  };
  const statusEntries = statuses.map(([value, label]) => ({ href: href(value), label }));
  const active = statuses.some(([value]) => value === current) ? href(current) : "";
  if (!active) statusEntries.push({ href: href(current), label: "Bộ lọc hiện tại" });
  return <AdminManagementPage title="Mua bán" description="Quản lý phiếu nhập và đơn hàng.">
    <div ref={ref} className={`${split.layout} ${resize.layout}`} data-sidebar-collapsed={pane.width === 0} data-resizing={pane.resizing} style={{ ...ADMIN_SPLIT_WORKSPACE_STYLE, ...pane.style }}>
      <aside id={id} data-admin-pane="sidebar" className="space-y-6">
        <AdminWorkspaceNavigation label="Khu vực mua bán" entries={entries.map(entry => ({ ...entry, icon: entry.href === "/admin/orders" ? <ShoppingBag /> : <Tags /> }))} selected={selected} />
        <AdminWorkspaceNavigation label={`Trạng thái ${orders ? "đơn hàng" : "phiếu nhập"}`} entries={statusEntries} selected={active || href(current)} />
      </aside>
      <div {...pane.separatorProps} aria-label="Điều chỉnh độ rộng menu mua bán" aria-controls={id} className={resize.separator} />
      <div data-admin-pane="content">{children}</div>
    </div>
  </AdminManagementPage>;
}
