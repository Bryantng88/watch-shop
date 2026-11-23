"use client";

import { useId, type ReactNode } from "react";
import { ADMIN_MANAGEMENT_STYLE } from "./AdminManagement";
import { ADMIN_SPLIT_WORKSPACE as split, ADMIN_SPLIT_WORKSPACE_STYLE, useAdminSplitWorkspace } from "./AdminSplitWorkspace";
import { ADMIN_SPLIT_RESIZE as resize, useAdminSplitResize } from "./AdminSplitResize";
import { AdminWorkspaceViewNavigation } from "./AdminWorkspaceNavigation";

/** Record-level navigation inside the centered detail frame; content stays mounted. */
export function AdminDetailWorkspace<T extends string>({ label, storageKey, items, value, onChange, actions, children }: {
    label: string; storageKey: string; items: readonly { value: T; label: string }[]; value: T;
    onChange: (value: T) => void; actions?: ReactNode; children: ReactNode;
}) {
    const ref = useAdminSplitWorkspace<HTMLDivElement>();
    const pane = useAdminSplitResize(ref, storageKey);
    const id = useId();
    return <div ref={ref} className={`${split.layout} ${resize.layout}`} data-detail-workspace data-sidebar-collapsed={pane.width === 0} data-resizing={pane.resizing} style={{ ...ADMIN_MANAGEMENT_STYLE, ...ADMIN_SPLIT_WORKSPACE_STYLE, ...pane.style }}>
        <aside id={id} data-admin-pane="sidebar"><AdminWorkspaceViewNavigation label={label} items={items} value={value} onChange={onChange}/></aside>
        <div {...pane.separatorProps} aria-label={`Điều chỉnh độ rộng ${label.toLocaleLowerCase("vi-VN")}`} aria-controls={id} className={resize.separator}/>
        <div data-admin-pane="content">{actions && <div className="mb-4 flex justify-end">{actions}</div>}{children}</div>
    </div>;
}
