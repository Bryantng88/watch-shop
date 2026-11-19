import type { ReactNode } from "react";
import clsx from "clsx";
import { ADMIN_UI } from "./admin-ui.tokens";

export function AdminPageCanvas({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx(ADMIN_UI.page, ADMIN_UI.pageFlow, className)}>{children}</div>;
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  meta,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  className?: string;
}) {
  return <header className={clsx("flex flex-wrap items-end justify-between gap-4", className)}>
    <div>
      {eyebrow ? <p className={ADMIN_UI.eyebrow}>{eyebrow}</p> : null}
      <h1 className={ADMIN_UI.pageTitle}>{title}</h1>
      {description ? <p className={ADMIN_UI.pageDescription}>{description}</p> : null}
    </div>
    {meta ? <div className="flex items-center gap-5 text-sm">{meta}</div> : null}
  </header>;
}

/** Filters are grouped; document actions sit flat between the header and editor. */
export function AdminFlatToolbar({
  children,
  className,
  variant = "filters",
}: {
  children: ReactNode;
  className?: string;
  variant?: "filters" | "actions";
}) {
  return <div className={clsx(
    variant === "actions"
      ? "flex flex-col gap-3 border-b border-slate-100 bg-white pb-4 lg:flex-row lg:items-center lg:justify-between"
      : ADMIN_UI.toolbar,
    className,
  )}>{children}</div>;
}
