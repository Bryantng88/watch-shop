"use client";
import type { ReactNode } from "react";
import { AdminRouteWorkspace, type AdminRouteEntry } from "@/domains/shared/ui/admin-design-contract/AdminRouteWorkspace";
export default function SystemWorkspace({ entries, selected, children, extraNavigation }: { extraNavigation?: ReactNode; entries: AdminRouteEntry[]; selected: string; children: ReactNode }) {
  return <AdminRouteWorkspace title="System" description="Quản lý kênh thông báo và nhật ký hệ thống." navigationLabel="Khu vực hệ thống" storageKey="admin:system:menu-width:v1" entries={entries} selected={selected} extraNavigation={extraNavigation}>{children}</AdminRouteWorkspace>;
}
