import type { ReactNode } from "react";
import { ADMIN_UI } from "@/domains/shared/ui/admin-design-contract";

/** Flat sections shared by order create/edit/detail; no effect on other domains. */
export default function OrderSection({ icon, title, subtitle, actions, children }: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return <section className="min-w-0 border-t border-slate-100 pt-4">
    <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 className={`flex min-w-0 items-center gap-2 ${ADMIN_UI.sectionTitle}`}>
        {icon && <span className="shrink-0 text-slate-400" aria-hidden="true">{icon}</span>}{title}
      </h2>
      {actions}
    </header>
    {subtitle && <p className="sr-only">{subtitle}</p>}
    {children}
  </section>;
}
