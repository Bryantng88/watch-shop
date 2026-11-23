"use client";
import { useId, type ReactNode } from "react";
import Link from "next/link";
import { AdminPageCanvas } from "@/domains/shared/ui/admin-design-contract/AdminPage";
import { AdminPageHeading } from "@/domains/shared/ui/admin-design-contract/AdminShellHeading";
import { AdminManagementPage } from "@/domains/shared/ui/admin-design-contract/AdminManagement";
import { AdminWorkspaceViewNavigation } from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceNavigation";
import { ADMIN_SPLIT_WORKSPACE as split, ADMIN_SPLIT_WORKSPACE_STYLE, useAdminSplitWorkspace } from "@/domains/shared/ui/admin-design-contract/AdminSplitWorkspace";
import { ADMIN_SPLIT_RESIZE as resize, useAdminSplitResize } from "@/domains/shared/ui/admin-design-contract/AdminSplitResize";
import { PERSONAL_WORK_VIEWS, type WorkListView } from "./PersonalWorkListToolbar";
import styles from "./PersonalWorkList.module.css";

export function PersonalWorkWorkspace({ compact, view, onView, summary, children }: {
  compact: boolean; view: WorkListView; onView: (value: WorkListView) => void; summary: ReactNode; children: ReactNode;
}) {
  const ref = useAdminSplitWorkspace<HTMLDivElement>(!compact);
  const pane = useAdminSplitResize(ref, "admin:personal-work:menu-width:v1", !compact);
  const id = useId();
  if (compact) return <AdminPageCanvas className="min-w-0 !px-4 !py-3 sm:!px-6 sm:!py-5">
    <Link href="/admin/ben" className={`${styles.back} focus-visible:ring-2 focus-visible:ring-blue-300`}>← Trò chuyện với Ben</Link>
    <header className={styles.header}><AdminPageHeading className="text-xl font-bold text-slate-950 sm:text-2xl">Quản lý công việc</AdminPageHeading>{summary}</header>
    {children}
  </AdminPageCanvas>;
  return <AdminManagementPage title="Quản lý công việc" actions={summary}>
    <div ref={ref} className={`${split.layout} ${resize.layout}`} style={{ ...ADMIN_SPLIT_WORKSPACE_STYLE, ...pane.style }}
      data-sidebar-collapsed={pane.width === 0} data-resizing={pane.resizing}>
      <aside id={id} data-admin-pane="sidebar"><AdminWorkspaceViewNavigation label="Hiển thị công việc"
        items={PERSONAL_WORK_VIEWS.map(([value, label]) => ({ value, label }))} value={view} onChange={onView} /></aside>
      <div {...pane.separatorProps} aria-label="Điều chỉnh độ rộng menu công việc" aria-controls={id} className={resize.separator} />
      <div data-admin-pane="content" className="flex min-w-0 flex-col gap-5">{children}</div>
    </div>
  </AdminManagementPage>;
}
