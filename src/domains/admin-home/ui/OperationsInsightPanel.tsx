"use client";
import { AdminDisclosureSummary } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import { useEffect, useState, type ReactNode } from "react";
import styles from "./OperationsDashboard.module.css";

export function OperationsInsightPanel({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const screen = window.matchMedia("(min-width: 1280px)");
    const sync = () => setOpen(screen.matches);
    sync();
    screen.addEventListener("change", sync);
    return () => screen.removeEventListener("change", sync);
  }, []);
  return <details className={styles.insightPanel} data-insight-panel open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <AdminDisclosureSummary className="rounded py-3 text-sm font-semibold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">Insight vận hành</AdminDisclosureSummary>
    <div className="space-y-7 pt-3 xl:pt-0">{children}</div>
  </details>;
}
