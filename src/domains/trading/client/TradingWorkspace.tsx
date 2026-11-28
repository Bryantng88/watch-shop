"use client";

import { type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { AdminRouteWorkspace } from "@/domains/shared/ui/admin-design-contract/AdminRouteWorkspace";
import { AdminWorkspaceNavigation } from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceNavigation";
import type { TradingEntry } from "../shared/trading-navigation";

const acquisitionStatuses = [["", "Tất cả"], ["DRAFT", "Nháp"], ["POSTED", "Đã nhập kho"], ["CANCELLED", "Đã hủy"]];
const orderStatuses = [["all", "Tất cả"], ["pending", "Chờ xác minh"], ["need_action", "Cần xử lý"], ["processing", "Đang xử lý"], ["returning", "Đang hoàn"], ["completed", "Hoàn tất"], ["returned", "Đã hoàn"], ["cancelled", "Đã hủy"]];

export default function TradingWorkspace({ entries, selected, children, counts }: { counts?: Readonly<Record<string, unknown>>; entries: TradingEntry[]; selected: "/admin/acquisitions" | "/admin/orders" | "/admin/consignments"; children: ReactNode }) {
  const params = useSearchParams();
  const consignments = selected === "/admin/consignments";
  const orders = selected === "/admin/orders";
  const key = orders ? "view" : "status";
  const current = params.get(key) || (orders ? "all" : "");
  const statuses = consignments ? [["", "Tất cả"], ["DRAFT", "Nháp"], ["ACTIVE", "Đang ký gửi"], ["SOLD", "Chờ quyết toán"], ["SETTLED", "Đã quyết toán"], ["RETURNED", "Đã trả / nhận lại"], ["CANCELLED", "Đã hủy"]] : orders ? orderStatuses : acquisitionStatuses;
  const href = (value: string) => {
    const next = new URLSearchParams(params.toString());
    next.delete("page");
    next.delete("focus");
    if(consignments)["id","new","productId"].forEach(key=>next.delete(key));
    if (orders) next.delete("subFilter");
    if (value && value !== "all") next.set(key, value); else next.delete(key);
    const query = next.toString();
    return selected + (query ? `?${query}` : "");
  };
  const statusEntries = statuses.map(([value, label]) => ({ href: href(value), label, count: typeof counts?.[value || "all"] === "number" ? counts[value || "all"] as number : undefined }));
  const active = statuses.some(([value]) => value === current) ? href(current) : "";
  if (!active) statusEntries.push({ href: href(current), label: "Bộ lọc hiện tại", count: typeof counts?.[current] === "number" ? counts[current] as number : undefined });
  return <AdminRouteWorkspace title="Mua bán" description="Quản lý phiếu nhập, đơn hàng và ký gửi." navigationLabel="Khu vực mua bán" storageKey="admin:trading:menu-width:v1" entries={entries} selected={selected}
    selectedNavigation={<div className="space-y-6">{consignments&&<AdminWorkspaceNavigation compact label="Chiều ký gửi" entries={[["", "Tất cả"], ["IN", "Nhận ký gửi"], ["OUT", "Gửi đối tác"]].map(([direction,label])=>{const next=new URLSearchParams(params.toString());["page","id","new","productId"].forEach(key=>next.delete(key));if(direction)next.set("direction",direction);else next.delete("direction");return {href:`/admin/consignments?${next}`,label};})} selected={(()=>{const next=new URLSearchParams(params.toString());["page","id","new","productId"].forEach(key=>next.delete(key));return `/admin/consignments?${next}`;})()}/>}<AdminWorkspaceNavigation compact label={`Trạng thái ${consignments ? "ký gửi" : orders ? "đơn hàng" : "phiếu nhập"}`} entries={statusEntries} selected={active || href(current)} /></div>}>
    {children}
  </AdminRouteWorkspace>;
}
