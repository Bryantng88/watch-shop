"use client";

import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { createPortal } from "react-dom";
import { AdminButton } from "./AdminButton";
import { ADMIN_WORKSPACE_NAVIGATION_STYLE } from "./AdminWorkspaceNavigation";
import { AdminWorkspaceHeading } from "./AdminWorkspaceHeading";
import { ADMIN_SPLIT_WORKSPACE as s } from "./AdminSplitWorkspace";

const FilterContext = createContext<{ target: HTMLDivElement | null; setTarget: Dispatch<SetStateAction<HTMLDivElement | null>> } | null>(null);
/** Slots share presentation only; each consumer owns its real filter state/callback. */
export function AdminWorkspaceFilterProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const value = useMemo(() => ({ target, setTarget }), [target]);
  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}
export function AdminWorkspaceFilterTarget() {
  const context = useContext(FilterContext);
  return <div ref={context?.setTarget} className={`${s.filterTarget} space-y-6`} />;
}
export function useWorkspaceFilterHost() { return useContext(FilterContext) !== null; }
export function AdminWorkspaceFilter({ label, value, options, onChange, disabled = false }: {
  label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void; disabled?: boolean;
}) {
  const context = useContext(FilterContext);
  const content = <nav aria-label={label} className={s.filterNavigation} style={ADMIN_WORKSPACE_NAVIGATION_STYLE}>
    <div className={s.navigationLinks}><AdminWorkspaceHeading navigation compact>{label}</AdminWorkspaceHeading>
      {options.map(option => <AdminButton key={option.value} variant="contextual" type="button" className={s.navigationLink} aria-pressed={option.value === value} disabled={disabled} onClick={() => onChange(option.value)}>{option.label}</AdminButton>)}
    </div>
    <label className={s.navigationSelect}>{label}<select value={value} disabled={disabled} onChange={event => onChange(event.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
  </nav>;
  return context ? context.target ? createPortal(content, context.target) : null : content;
}
