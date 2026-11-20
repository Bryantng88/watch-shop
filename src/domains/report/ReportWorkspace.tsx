"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminRouteWorkspace, type AdminRouteEntry } from "@/domains/shared/ui/admin-design-contract/AdminRouteWorkspace";
export default function ReportWorkspace({ entries, children }: { entries: AdminRouteEntry[]; children: ReactNode }) {
  const pathname = usePathname();
  return <AdminRouteWorkspace title="Báo cáo" description="Theo dõi tổng quan, tài chính và hiệu quả bán hàng." navigationLabel="Nhóm báo cáo" storageKey="admin:reports:menu-width:v1" entries={entries} selected={pathname}>{children}</AdminRouteWorkspace>;
}
