"use client";

import { useId, type ReactNode } from "react";
import { operationalDomainPresentation } from "@/domains/shared/ui/signals/operational-domain-presentation";
import { ADMIN_SPLIT_WORKSPACE as split, ADMIN_SPLIT_WORKSPACE_STYLE, useAdminSplitWorkspace } from "@/domains/shared/ui/admin-design-contract/AdminSplitWorkspace";
import { ADMIN_SPLIT_RESIZE as resize, useAdminSplitResize } from "@/domains/shared/ui/admin-design-contract/AdminSplitResize";
import styles from "./OperationWorkspaceLayout.module.css";

export type OperationNavigationGroup = {
  key: string;
  label: string;
  domainKey?: string;
};

export type OperationNavigationStage = {
  key: string;
  label: string;
  count?: number | string;
};

type Props = {
  enabled?: boolean;
  groups: OperationNavigationGroup[];
  activeGroup: string;
  onGroupChange: (key: string) => void;
  stages: OperationNavigationStage[];
  activeStage: string;
  onStageChange: (key: string) => void;
  children: ReactNode;
};

function countLabel(count: number | string) {
  return typeof count === "number" ? count.toLocaleString("vi-VN") : count;
}

/** Presentation only: navigation reuses domain selection callbacks, never mutations. */
export function OperationWorkspaceLayout({
  enabled = true, groups, activeGroup, onGroupChange, stages, activeStage, onStageChange, children,
}: Props) {
  const layoutRef = useAdminSplitWorkspace<HTMLDivElement>(enabled);
  const pane = useAdminSplitResize(layoutRef, "admin:operations:menu-width:v1", enabled);
  const navigationId = useId();
  if (!enabled) return <>{children}</>;
  const selected = groups.find((group) => group.key === activeGroup);
  return <div ref={layoutRef} className={`${styles.layout} ${split.layout} ${resize.layout}`} data-sidebar-collapsed={pane.width === 0} data-resizing={pane.resizing} style={{ ...ADMIN_SPLIT_WORKSPACE_STYLE, ...pane.style }}>
      <aside id={navigationId} data-admin-pane="sidebar" className={styles.desktop} aria-label="Điều hướng vận hành">
        <h2 className={styles.navigationTitle}>Khu vực vận hành</h2>
        <nav aria-label="Khu vực vận hành">
          {groups.map((group) => {
            const active = group.key === activeGroup;
            const Icon = operationalDomainPresentation(group.domainKey ?? group.key).icon;
            return <div key={group.key} className={styles.group}>
              <button type="button" aria-current={active ? "page" : undefined}
                className={styles.groupButton} data-has-stages={active && stages.length > 0 || undefined}
                onClick={() => onGroupChange(group.key)}>
                <Icon className={styles.icon} aria-hidden="true" />
                <span>{group.label}</span>
              </button>
              {active && stages.length > 0 && <div className={styles.stages} role="group" aria-label={`Giai đoạn ${group.label}`}>
                {stages.map((stage) => <button key={stage.key} type="button"
                  className={styles.stageButton} aria-pressed={stage.key === activeStage}
                  onClick={() => onStageChange(stage.key)}>
                  <span>{stage.label}</span>
                  {stage.count !== undefined && <span className={styles.count}>{countLabel(stage.count)}</span>}
                </button>)}
              </div>}
            </div>;
          })}
        </nav>
      </aside>
      <div className={styles.mobile}>
        <label>Khu vực vận hành
          <select value={activeGroup} onChange={(event) => onGroupChange(event.target.value)}>
            {groups.map((group) => <option key={group.key} value={group.key}>{group.label}</option>)}
          </select>
        </label>
        {stages.length > 0 && <label>Giai đoạn {selected?.label}
          <select value={activeStage} onChange={(event) => onStageChange(event.target.value)}>
            {stages.map((stage) => <option key={stage.key} value={stage.key}>
              {stage.label}{stage.count !== undefined ? ` (${countLabel(stage.count)})` : ""}
            </option>)}
          </select>
        </label>}
      </div>
      <div {...pane.separatorProps} aria-controls={navigationId} className={resize.separator} />
      <div data-admin-pane="content" className={styles.content}>{children}</div>
  </div>;
}
