import type { ReactNode } from "react";
import { ADMIN_OPERATION_PAGE_CLASS } from "@/domains/shared/ui/layout/admin-content";

type SpaceViewPageProps = {
  breadcrumbs?: ReactNode;
  title: ReactNode;
  status?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  headerIcon?: ReactNode;
  headerVariant?: "default" | "compact";
  children: ReactNode;
};

type SpaceViewSummaryProps = {
  columns?: string;
  children: ReactNode;
};

type SpaceViewCellProps = {
  as?: "div" | "label";
  children: ReactNode;
  className?: string;
};

type SpaceViewInfoCellProps = {
  icon: ReactNode;
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

type SpaceViewSectionHeaderProps = {
  title: ReactNode;
  badge?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

type SpaceViewFooterTipProps = {
  icon: ReactNode;
  children: ReactNode;
  action?: ReactNode;
};

export function SpaceViewPage({
  breadcrumbs,
  title,
  status,
  meta,
  actions,
  headerIcon,
  headerVariant = "default",
  children,
}: SpaceViewPageProps) {
  const compactHeader = headerVariant === "compact";

  return (
    <main className={`${ADMIN_OPERATION_PAGE_CLASS} bg-[#f6f7fb] px-3 py-5 text-[#111a3d] sm:px-4 lg:px-5 xl:px-6 2xl:px-8`}>
      <div className="mx-auto flex w-full max-w-none min-w-0 flex-col gap-4">
        {breadcrumbs}
        <section
          className={
            compactHeader
              ? "relative flex flex-col gap-4 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-r from-white via-white to-violet-50/50 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] lg:flex-row lg:items-center lg:justify-between"
              : "flex flex-col gap-4 pb-2 lg:flex-row lg:items-start lg:justify-between"
          }
        >
          {compactHeader ? (
            <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-violet-500 to-indigo-500" />
          ) : null}
          <div className={compactHeader ? "flex min-w-0 items-center gap-3 pl-1" : undefined}>
            {headerIcon ? (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-200">
                {headerIcon}
              </span>
            ) : null}
            <div className="min-w-0">
              <div
                className={
                  compactHeader
                    ? "flex flex-wrap items-center gap-2.5 text-2xl font-semibold tracking-[-0.02em] text-slate-950"
                    : "flex flex-wrap items-center gap-3 text-3xl font-semibold tracking-normal text-slate-950"
                }
              >
                {title}
                {status}
              </div>
              {meta ? (
                <div
                  className={
                    compactHeader
                      ? "mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500"
                      : "mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500"
                  }
                >
                  {meta}
                </div>
              ) : null}
            </div>
          </div>
          {actions ? (
            <div className={`flex flex-wrap items-center gap-2 ${compactHeader ? "pl-14 lg:pl-0" : ""}`}>
              {actions}
            </div>
          ) : null}
        </section>
        {children}
      </div>
    </main>
  );
}

export function SpaceViewPanel({ children }: { children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(30,43,79,0.06)]">
      {children}
    </section>
  );
}

export function SpaceViewPanelIntro({ children }: { children: ReactNode }) {
  return <div className="px-5 py-4">{children}</div>;
}

export function SpaceViewSummary({
  columns = "lg:grid-cols-[1.05fr_0.75fr_1fr_1.8fr_auto]",
  children,
}: SpaceViewSummaryProps) {
  return (
    <div
      className={`grid overflow-hidden rounded-2xl border border-slate-200 bg-white text-xs text-slate-600 shadow-[0_8px_24px_rgba(30,43,79,0.06)] ${columns}`}
    >
      {children}
    </div>
  );
}

export function SpaceViewSummaryCell({
  as = "div",
  children,
  className = "",
}: SpaceViewCellProps) {
  const Component = as;
  return (
    <Component
      className={`p-5 lg:relative lg:after:absolute lg:after:bottom-8 lg:after:right-0 lg:after:top-8 lg:after:w-px lg:after:bg-slate-100 ${className}`}
    >
      {children}
    </Component>
  );
}

export function SpaceViewInfoGrid({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 grid overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-50/70 to-[#f3f8ff] text-xs text-slate-700 shadow-[0_8px_24px_rgba(30,43,79,0.04)] lg:grid-cols-[1fr_1.35fr_1.25fr]">
      {children}
    </div>
  );
}

export function SpaceViewInfoCell({
  icon,
  label,
  children,
  className = "",
}: SpaceViewInfoCellProps) {
  return (
    <div
      className={`p-5 lg:relative lg:after:absolute lg:after:bottom-8 lg:after:right-0 lg:after:top-8 lg:after:w-px lg:after:bg-sky-100 ${className}`}
    >
      <div className="flex items-center gap-2 font-bold uppercase tracking-wide text-violet-700">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white text-violet-700 ring-1 ring-violet-100">
          {icon}
        </span>
        {label}
      </div>
      {children}
    </div>
  );
}

export function SpaceViewSectionHeader({
  title,
  badge,
  description,
  actions,
}: SpaceViewSectionHeaderProps) {
  return (
    <div className="m-5 mb-4 grid gap-4 rounded-xl border border-[#e5e9f2] bg-white p-4 lg:grid-cols-[minmax(360px,1fr)_auto] lg:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="m-0 text-lg font-extrabold text-[#07113d]">{title}</h2>
          {badge}
        </div>
        {description ? <p className="mt-2 text-sm text-[#6f7a96]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2 lg:justify-end">{actions}</div> : null}
    </div>
  );
}

export function SpaceViewFooterTip({ icon, children, action }: SpaceViewFooterTipProps) {
  return (
    <div className="m-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-violet-100 bg-violet-50/70 px-4 py-3 text-sm text-violet-700">
      <div className="inline-flex items-center gap-2">
        {icon}
        <span>{children}</span>
      </div>
      {action}
    </div>
  );
}
